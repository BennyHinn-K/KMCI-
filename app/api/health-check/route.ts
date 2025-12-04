import { NextRequest, NextResponse } from "next/server";
import { getDatabaseHealth } from "@/lib/database/connection";
import { healthLogger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface HealthCheckResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  environment: string;
  services: {
    database: {
      status: "healthy" | "unhealthy";
      responseTime: number;
      details?: any;
    };
    memory: {
      status: "healthy" | "degraded" | "unhealthy";
      usage: {
        heapUsed: string;
        heapTotal: string;
        external: string;
        arrayBuffers: string;
      };
      percentage: number;
    };
    uptime: {
      status: "healthy";
      seconds: number;
      formatted: string;
    };
  };
  checks: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
  };
}

function formatBytes(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);

  return parts.join(" ") || "0s";
}

async function checkDatabase(): Promise<{
  status: "healthy" | "unhealthy";
  responseTime: number;
  details?: any;
}> {
  const startTime = Date.now();

  try {
    const health = await getDatabaseHealth();
    const responseTime = Date.now() - startTime;

    return {
      status: health.status,
      responseTime,
      details: health.details,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;

    return {
      status: "unhealthy",
      responseTime,
      details: {
        error:
          error instanceof Error ? error.message : "Unknown database error",
      },
    };
  }
}

function checkMemory(): {
  status: "healthy" | "degraded" | "unhealthy";
  usage: {
    heapUsed: string;
    heapTotal: string;
    external: string;
    arrayBuffers: string;
  };
  percentage: number;
} {
  const memUsage = process.memoryUsage();
  const percentage = (memUsage.heapUsed / memUsage.heapTotal) * 100;

  let status: "healthy" | "degraded" | "unhealthy" = "healthy";
  if (percentage > 90) {
    status = "unhealthy";
  } else if (percentage > 75) {
    status = "degraded";
  }

  return {
    status,
    usage: {
      heapUsed: formatBytes(memUsage.heapUsed),
      heapTotal: formatBytes(memUsage.heapTotal),
      external: formatBytes(memUsage.external),
      arrayBuffers: formatBytes(memUsage.arrayBuffers),
    },
    percentage: Math.round(percentage * 100) / 100,
  };
}

function checkUptime(): {
  status: "healthy";
  seconds: number;
  formatted: string;
} {
  const uptimeSeconds = process.uptime();

  return {
    status: "healthy",
    seconds: Math.round(uptimeSeconds),
    formatted: formatUptime(uptimeSeconds),
  };
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Run all health checks in parallel
    const [databaseHealth, memoryHealth, uptimeHealth] = await Promise.all([
      checkDatabase(),
      Promise.resolve(checkMemory()),
      Promise.resolve(checkUptime()),
    ]);

    // Calculate overall status
    let overallStatus: "healthy" | "degraded" | "unhealthy" = "healthy";

    const checks = {
      totalChecks: 3,
      passedChecks: 0,
      failedChecks: 0,
    };

    // Database check
    if (databaseHealth.status === "healthy") {
      checks.passedChecks++;
    } else {
      checks.failedChecks++;
      overallStatus = "unhealthy";
    }

    // Memory check
    if (memoryHealth.status === "healthy") {
      checks.passedChecks++;
    } else if (memoryHealth.status === "degraded") {
      checks.passedChecks++;
      if (overallStatus === "healthy") {
        overallStatus = "degraded";
      }
    } else {
      checks.failedChecks++;
      overallStatus = "unhealthy";
    }

    // Uptime check (always healthy)
    checks.passedChecks++;

    const response: HealthCheckResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      services: {
        database: databaseHealth,
        memory: memoryHealth,
        uptime: uptimeHealth,
      },
      checks,
    };

    // Log health check
    const duration = Date.now() - startTime;
    healthLogger.check(
      "System health check completed",
      overallStatus as "healthy" | "unhealthy",
      {
        duration: `${duration}ms`,
        checks: response.checks,
      },
    );

    // Return appropriate status code
    const statusCode =
      overallStatus === "healthy"
        ? 200
        : overallStatus === "degraded"
          ? 200
          : 503;

    return NextResponse.json(response, {
      status: statusCode,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;

    healthLogger.check("System health check failed", "unhealthy", {
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "1.0.0",
        environment: process.env.NODE_ENV || "development",
        error: error instanceof Error ? error.message : "Health check failed",
        services: {
          database: { status: "unhealthy", responseTime: 0 },
          memory: { status: "unhealthy", usage: {}, percentage: 0 },
          uptime: { status: "healthy", seconds: 0, formatted: "0s" },
        },
        checks: {
          totalChecks: 3,
          passedChecks: 0,
          failedChecks: 3,
        },
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  }
}

// Simple ping endpoint for basic availability checks
export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
