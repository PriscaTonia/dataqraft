const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ"
const LOWER = "abcdefghijkmnpqrstuvwxyz"
const DIGITS = "23456789"
const SYMBOLS = "!@#$%^&*-_=+"

export function generateSecurePassword(length = 14) {
  const all = UPPER + LOWER + DIGITS + SYMBOLS
  const pick = (chars: string) => chars[Math.floor(Math.random() * chars.length)]

  const required = [pick(UPPER), pick(LOWER), pick(DIGITS), pick(SYMBOLS)]
  const rest = Array.from({ length: Math.max(0, length - required.length) }, () => pick(all))

  const combined = [...required, ...rest]
  for (let i = combined.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[combined[i], combined[j]] = [combined[j], combined[i]]
  }

  return combined.join("")
}

export type PasswordStrength = "weak" | "fair" | "strong"

export function passwordStrength(password: string): PasswordStrength {
  if (!password) return "weak"

  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (score >= 4) return "strong"
  if (score >= 2) return "fair"
  return "weak"
}
