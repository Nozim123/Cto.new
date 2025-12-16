import { useTheme } from '../contexts/ThemeContext'

export default function RealisticIcon({
  Icon,
  size = 20,
  padding = 10,
  radius = 16,
  className = '',
  variant = 'purple',
  label
}) {
  const { darkMode } = useTheme()

  const variantClasses = {
    purple: 'text-purple-600 dark:text-purple-300',
    gold: 'text-gold',
    green: 'text-green-600 dark:text-green-300',
    blue: 'text-blue-600 dark:text-blue-300'
  }

  return (
    <span
      className={`realistic-icon-shell ${darkMode ? 'realistic-icon-shell--dark' : 'realistic-icon-shell--light'} ${className}`}
      style={{ padding, borderRadius: radius }}
      aria-label={label}
    >
      <Icon
        className={`realistic-icon ${variantClasses[variant] || variantClasses.purple}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    </span>
  )
}
