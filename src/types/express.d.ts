import type { JWTPayload } from '../lib/jwt'

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload
    }
  }
}