import { Request, Response, NextFunction } from 'express'

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  // Log request
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`)
  
  // Override res.end to log response
  const originalEnd = res.end.bind(res)
  res.end = function(chunk?: any, encoding?: any) {
    const duration = Date.now() - start
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`)
    return originalEnd(chunk, encoding)
  }
  
  next()
}

