import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;

/**
 * Genera un token JWT.
 * @param payload Datos que se incluirán en el token.
 * @param expiresIn Tiempo de expiración del token (por defecto: "1h").
 * @param options Opciones adicionales para la configuración del token.
 * @returns Token JWT como string.
 */
export const generateToken = (
  payload: object,
  expiresIn: string = '1h',
  options: SignOptions = {}
): string => {
  if (!JWT_SECRET_KEY) {
    throw new Error('La clave secreta JWT no está definida en las variables de entorno.');
  }

  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn, ...options });
};

/**
 * Verifica un token JWT.
 * @param token El token a verificar.
 * @param secret La clave secreta usada para firmar el token.
 * @returns El payload decodificado.
 */
export function verifyToken(token: string, secret: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === 'object' && decoded !== null) {
      return decoded as JwtPayload;
    }

    throw new Error('El token no contiene un payload válido.');
  } catch (error) {
    console.error('Error al verificar el token:', error);
    throw new Error('Token inválido o expirado.');
  }
}
