import { Pool, Client, PoolConfig } from "pg";
import { logger } from "../logger";

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean | object;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

class DatabaseManager {
  private pool: Pool | null = null;
  private config: DatabaseConfig;

  constructor() {
    this.config = {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME || "kmci_db",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
      max: parseInt(process.env.DB_POOL_MAX || "20"),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || "30000"),
      connectionTimeoutMillis: parseInt(
        process.env.DB_CONNECTION_TIMEOUT || "2000",
      ),
    };
  }

  private createPool(): Pool {
    const poolConfig: PoolConfig = {
      ...this.config,
      statement_timeout: 30000,
      query_timeout: 30000,
    };

    const pool = new Pool(poolConfig);

    // Handle pool errors
    pool.on("error", (err) => {
      logger.error("Database pool error:", err);
    });

    pool.on("connect", (client) => {
      logger.info("New database connection established");
    });

    pool.on("remove", (client) => {
      logger.info("Database connection removed from pool");
    });

    return pool;
  }

  public async initialize(): Promise<void> {
    try {
      if (!this.pool) {
        this.pool = this.createPool();
      }

      // Test connection
      const client = await this.pool.connect();
      await client.query("SELECT NOW()");
      client.release();

      logger.info("Database connection pool initialized successfully");
    } catch (error) {
      logger.error("Failed to initialize database connection:", error);
      throw new Error("Database initialization failed");
    }
  }

  public getPool(): Pool {
    if (!this.pool) {
      throw new Error(
        "Database pool not initialized. Call initialize() first.",
      );
    }
    return this.pool;
  }

  public async query(text: string, params?: any[]): Promise<any> {
    const start = Date.now();
    const pool = this.getPool();

    try {
      const result = await pool.query(text, params);
      const duration = Date.now() - start;

      logger.debug("Query executed", {
        query: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
        duration: `${duration}ms`,
        rows: result.rowCount,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error("Query failed", {
        query: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
        duration: `${duration}ms`,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  public async transaction<T>(
    callback: (client: any) => Promise<T>,
  ): Promise<T> {
    const pool = this.getPool();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      logger.error("Transaction rolled back:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async healthCheck(): Promise<{
    status: "healthy" | "unhealthy";
    details: {
      poolSize: number;
      idleCount: number;
      waitingCount: number;
      totalCount: number;
    };
  }> {
    try {
      const pool = this.getPool();

      // Test query
      await this.query("SELECT 1 as health_check");

      return {
        status: "healthy",
        details: {
          poolSize: pool.totalCount,
          idleCount: pool.idleCount,
          waitingCount: pool.waitingCount,
          totalCount: pool.totalCount,
        },
      };
    } catch (error) {
      logger.error("Database health check failed:", error);
      return {
        status: "unhealthy",
        details: {
          poolSize: 0,
          idleCount: 0,
          waitingCount: 0,
          totalCount: 0,
        },
      };
    }
  }

  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      logger.info("Database connection pool closed");
    }
  }

  // Helper method for pagination
  public buildPaginationQuery(
    baseQuery: string,
    page: number = 1,
    limit: number = 20,
  ): { query: string; offset: number } {
    const offset = (page - 1) * limit;
    const query = `${baseQuery} LIMIT $${1} OFFSET $${2}`;
    return { query, offset };
  }

  // Helper method for search conditions
  public buildSearchConditions(
    fields: string[],
    searchTerm: string,
  ): { condition: string; params: string[] } {
    if (!searchTerm || fields.length === 0) {
      return { condition: "", params: [] };
    }

    const searchPattern = `%${searchTerm.toLowerCase()}%`;
    const conditions = fields
      .map((field, index) => `LOWER(${field}) LIKE $${index + 1}`)
      .join(" OR ");

    return {
      condition: `(${conditions})`,
      params: fields.map(() => searchPattern),
    };
  }

  // Helper method for dynamic WHERE clauses
  public buildWhereClause(
    conditions: Record<string, any>,
    startParamIndex: number = 1,
  ): { clause: string; params: any[]; nextParamIndex: number } {
    const entries = Object.entries(conditions).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "",
    );

    if (entries.length === 0) {
      return { clause: "", params: [], nextParamIndex: startParamIndex };
    }

    let paramIndex = startParamIndex;
    const clauses: string[] = [];
    const params: any[] = [];

    entries.forEach(([key, value]) => {
      if (Array.isArray(value)) {
        clauses.push(`${key} = ANY($${paramIndex})`);
        params.push(value);
      } else {
        clauses.push(`${key} = $${paramIndex}`);
        params.push(value);
      }
      paramIndex++;
    });

    return {
      clause: `WHERE ${clauses.join(" AND ")}`,
      params,
      nextParamIndex: paramIndex,
    };
  }
}

// Singleton instance
export const db = new DatabaseManager();

// Helper functions for common operations
export async function initializeDatabase(): Promise<void> {
  await db.initialize();
}

export async function closeDatabase(): Promise<void> {
  await db.close();
}

export async function executeQuery(
  query: string,
  params?: any[],
): Promise<any> {
  return await db.query(query, params);
}

export async function executeTransaction<T>(
  callback: (client: any) => Promise<T>,
): Promise<T> {
  return await db.transaction(callback);
}

export async function getDatabaseHealth() {
  return await db.healthCheck();
}

// Export types for use in other files
export type { DatabaseConfig };
export { DatabaseManager };
