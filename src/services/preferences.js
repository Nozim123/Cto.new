const makeKey = (userId) => `sme_preferences_v1_${userId || 'guest'}`

const safeParse = (value, fallback) => {
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export const getUserPreferences = (userId) => {
  if (typeof window === 'undefined') {
    return { interests: [], onboardingCompleted: false, notificationOptIn: true }
  }

  const stored = safeParse(window.localStorage.getItem(makeKey(userId)), null)

  return {
    interests: [],
    onboardingCompleted: false,
    notificationOptIn: true,
    ...(stored || {})
  }
}

export const saveUserPreferences = (userId, prefs) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(makeKey(userId), JSON.stringify(prefs))
}
