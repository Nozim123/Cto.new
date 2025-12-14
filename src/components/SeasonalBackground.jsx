import { useTheme } from '../contexts/ThemeContext'
import './SeasonalBackground.css'

export default function SeasonalBackground() {
  const { season } = useTheme()

  return (
    <div className="seasonal-background-container">
      {season === 'winter' && (
        <div className="snowflakes" aria-hidden="true">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="snowflake">❄</div>
          ))}
        </div>
      )}
      
      {season === 'spring' && (
        <div className="cherry-blossoms" aria-hidden="true">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="blossom">🌸</div>
          ))}
        </div>
      )}
      
      {season === 'summer' && (
        <div className="sun-rays" aria-hidden="true">
          <div className="sun">☀️</div>
        </div>
      )}
      
      {season === 'autumn' && (
        <div className="falling-leaves" aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="leaf">🍂</div>
          ))}
        </div>
      )}
    </div>
  )
}
