/**
 * Cliente HTTP base para realizar peticiones al backend de forma segura y tipada.
 */

export interface ApiErrorResponse {
  error: boolean;
  msg: string;
  statusCode?: number;
}

export class SnailApiException extends Error {
  public statusCode: number;
  public details?: string;

  constructor(message: string, statusCode: number, details?: string) {
    super(message);
    this.name = 'SnailApiException';
    this.statusCode = statusCode;
    this.details = details;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Realiza una petición HTTP con soporte de timeout y manejo centralizado de errores.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit & { timeoutMs?: number } = {}
): Promise<T> {
  const { timeoutMs = 10000, headers = {}, ...customConfig } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const config: RequestInit = {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    signal: controller.signal,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage = typeof data === 'object' && data !== null && 'msg' in data
        ? (data as ApiErrorResponse).msg
        : `Error ${response.status}: ${response.statusText || 'Error en el servidor'}`;

      throw new SnailApiException(errorMessage, response.status);
    }

    return data as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof SnailApiException) {
      throw err;
    }

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new SnailApiException('La solicitud a la pasarela excedió el tiempo límite de espera (Timeout).', 408);
    }

    if (err instanceof Error) {
      throw new SnailApiException(
        `No se pudo conectar con el servidor de pagos. Verifique que el backend esté en ejecución (${err.message})`,
        0
      );
    }

    throw new SnailApiException('Error desconocido al procesar la solicitud.', 500);
  }
}
