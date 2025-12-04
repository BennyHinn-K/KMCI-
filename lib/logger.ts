import { createLogger, format, transports, Logger } from 'winston'
import path from 'path'
import fs from 'fs'

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

// Custom format for better readability
const customFormat = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  format.errors({ stack: true }),
  format.json(),
  format.prettyPrint()
)

// Console format for development
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({
    format: 'HH:mm:ss'
  }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    let output = `${timestamp} [${level}]: ${message}`

    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      output += '\n' + JSON.stringify(meta, null, 2)
    }

    return output
  })
)

// Create the logger instance
const logger: Logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: {
    service: 'kmci-website',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Error logs - separate file for errors only
    new transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // Combined logs - all levels
    new transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // Database specific logs
    new transports.File({
      filename: path.join(logsDir, 'database.log'),
      level: 'debug',
      maxsize: 5242880, // 5MB
      maxFiles: 3,
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.printf(({ timestamp, level, message, query, duration, ...meta }) => {
          if (query) {
            return `${timestamp} [${level.toUpperCase()}] DB: ${message}\nQuery: ${query}\nDuration: ${duration}\nMeta: ${JSON.stringify(meta, null, 2)}`
          }
          return `${timestamp} [${level.toUpperCase()}] DB: ${message}\nMeta: ${JSON.stringify(meta, null, 2)}`
        })
      )
    })
  ],

  // Handle uncaught exceptions
  exceptionHandlers: [
    new transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
      maxsize: 5242880,
      maxFiles: 2
    })
  ],

  // Handle unhandled promise rejections
  rejectionHandlers: [
    new transports.File({
      filename: path.join(logsDir, 'rejections.log'),
      maxsize: 5242880,
      maxFiles: 2
    })
  ]
})

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: consoleFormat
  }))
}

// Specialized logging functions
export const dbLogger = {
  query: (message: string, query: string, duration?: string, meta?: any) => {
    logger.debug(message, {
      type: 'query',
      query: query.replace(/\s+/g, ' ').trim(),
      duration,
      ...meta
    })
  },

  transaction: (message: string, meta?: any) => {
    logger.info(message, { type: 'transaction', ...meta })
  },

  connection: (message: string, meta?: any) => {
    logger.info(message, { type: 'connection', ...meta })
  },

  error: (message: string, error: Error, meta?: any) => {
    logger.error(message, {
      type: 'database_error',
      error: error.message,
      stack: error.stack,
      ...meta
    })
  }
}

export const authLogger = {
  login: (message: string, userId?: string, email?: string, ip?: string) => {
    logger.info(message, {
      type: 'auth_login',
      userId,
      email,
      ip
    })
  },

  logout: (message: string, userId?: string, email?: string) => {
    logger.info(message, {
      type: 'auth_logout',
      userId,
      email
    })
  },

  failed: (message: string, email?: string, ip?: string, reason?: string) => {
    logger.warn(message, {
      type: 'auth_failed',
      email,
      ip,
      reason
    })
  },

  register: (message: string, userId?: string, email?: string) => {
    logger.info(message, {
      type: 'auth_register',
      userId,
      email
    })
  }
}

export const auditLogger = {
  create: (message: string, table: string, recordId: string, userId?: string, data?: any) => {
    logger.info(message, {
      type: 'audit_create',
      table,
      recordId,
      userId,
      data
    })
  },

  update: (message: string, table: string, recordId: string, userId?: string, oldData?: any, newData?: any) => {
    logger.info(message, {
      type: 'audit_update',
      table,
      recordId,
      userId,
      oldData,
      newData
    })
  },

  delete: (message: string, table: string, recordId: string, userId?: string, data?: any) => {
    logger.warn(message, {
      type: 'audit_delete',
      table,
      recordId,
      userId,
      data
    })
  },

  read: (message: string, table: string, userId?: string, filters?: any) => {
    logger.debug(message, {
      type: 'audit_read',
      table,
      userId,
      filters
    })
  }
}

export const apiLogger = {
  request: (method: string, url: string, userId?: string, ip?: string, userAgent?: string) => {
    logger.info(`${method} ${url}`, {
      type: 'api_request',
      method,
      url,
      userId,
      ip,
      userAgent
    })
  },

  response: (method: string, url: string, statusCode: number, duration: number, userId?: string) => {
    logger.info(`${method} ${url} - ${statusCode}`, {
      type: 'api_response',
      method,
      url,
      statusCode,
      duration,
      userId
    })
  },

  error: (method: string, url: string, error: Error, userId?: string, statusCode?: number) => {
    logger.error(`${method} ${url} - Error: ${error.message}`, {
      type: 'api_error',
      method,
      url,
      error: error.message,
      stack: error.stack,
      userId,
      statusCode
    })
  }
}

// Performance logging
export const perfLogger = {
  slow: (operation: string, duration: number, threshold: number = 1000, meta?: any) => {
    if (duration > threshold) {
      logger.warn(`Slow operation detected: ${operation}`, {
        type: 'performance',
        operation,
        duration: `${duration}ms`,
        threshold: `${threshold}ms`,
        ...meta
      })
    }
  },

  memory: (operation: string, heapUsed: number, heapTotal: number) => {
    logger.debug(`Memory usage for ${operation}`, {
      type: 'memory',
      operation,
      heapUsed: `${Math.round(heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(heapTotal / 1024 / 1024)}MB`
    })
  }
}

// System health logging
export const healthLogger = {
  check: (service: string, status: 'healthy' | 'unhealthy', details?: any) => {
    const level = status === 'healthy' ? 'info' : 'error'
    logger.log(level, `Health check: ${service} - ${status}`, {
      type: 'health_check',
      service,
      status,
      details
    })
  },

  startup: (message: string, meta?: any) => {
    logger.info(message, {
      type: 'system_startup',
      ...meta
    })
  },

  shutdown: (message: string, meta?: any) => {
    logger.info(message, {
      type: 'system_shutdown',
      ...meta
    })
  }
}

// Export the main logger and specialized loggers
export { logger }
export default logger
