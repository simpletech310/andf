/**
 * Simple in-memory rate limiter for API routes.
 * For production, replace with Redis-based limiter (e.g. @upstash/ratelimit).
 */

const rateLimitMap = new Map<
  string,
  { count: number; lastReset: number }
>();

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now - value.lastReset > 60_000 * 10) {
        rateLimitMap.delete(key);
      }
    }
  }, 300_000);
}

interface RateLimitOptions {
  /** Max requests allowed in the window */
  limit?: number;
  /** Time window in milliseconds */
  window?: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const { limit = 10, window = 60_000 } = options;
  const now = Date.now();

  const entry = rateLimitMap.get(identifier);

  if (!entry || now - entry.lastReset > window) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return { success: true, remaining: limit - 1, reset: now + window };
  }

  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: entry.lastReset + window,
    };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: limit - entry.count,
    reset: entry.lastReset + window,
  };
}

/**
 * Get client IP from request headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
