/**
 * ============================================================================
 * MIDDLEWARES: Manejo de Errores y Validación de Esquemas
 * ============================================================================
 * Este archivo centraliza:
 * 1. AppError: Clase para lanzar errores de negocio personalizados con código HTTP.
 * 2. validate: Middleware para verificar los datos de entrada con esquemas Zod.
 * 3. errorHandler: Middleware global de Express que captura todas las excepciones
 *    y responde con el formato estándar: { error: true, msg: string }.
 */

import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Clase para errores operacionales y de negocio conocidos.
 * Ejemplo: throw new AppError('Tarjeta rechazada por fondos insuficientes', 422);
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 400, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware para validar el cuerpo (body) de las peticiones HTTP contra un esquema Zod.
 * Si los datos son válidos, continúan al controlador; si fallan, se envía el error al manejador global.
 */
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware global de Express para capturar errores controlados y no controlados.
 * Devuelve siempre una estructura uniforme: { error: true, msg: string }
 */
export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 1. Errores de validación provocados por esquemas Zod (HTTP 400)
  if (err instanceof ZodError) {
    const errorMessages = err.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join(' | ');

    res.status(400).json({
      error: true,
      msg: errorMessages || ''
    });
    return;
  }

  // 2. Errores de negocio controlados lanzados con AppError (HTTP statusCode)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: true,
      msg: err.message || ''
    });
    return;
  }

  // 3. Errores inesperados o no controlados (HTTP 500)
  console.error('[Unhandled Error]:', err);
  res.status(500).json({
    error: true,
    msg: err.message || ''
  });
};
