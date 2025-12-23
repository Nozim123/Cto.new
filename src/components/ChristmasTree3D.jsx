import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import './ChristmasTree3D.css'

export default function ChristmasTree3D() {
  const [lightsOn, setLightsOn] = useState(true)
  const [snowflakes, setSnowflakes] = useState([])
  const { darkMode } = useTheme()

  useEffect(() => {
    // Generate snowflakes
    const generateSnowflakes = () => {
      const flakes = []
      for (let i = 0; i < 50; i++) {
        flakes.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          size: Math.random() * 4 + 1,
          speed: Math.random() * 2 + 1,
          opacity: Math.random() * 0.8 + 0.2
        })
      }
      setSnowflakes(flakes)
    }

    generateSnowflakes()

    // Animate snowflakes
    const animateSnow = () => {
      setSnowflakes(prev => 
        prev.map(flake => ({
          ...flake,
          y: flake.y > 100 ? -10 : flake.y + flake.speed
        }))
      )
    }

    const snowInterval = setInterval(animateSnow, 50)
    
    // Toggle Christmas lights
    const lightInterval = setInterval(() => {
      setLightsOn(prev => !prev)
    }, 800)

    return () => {
      clearInterval(snowInterval)
      clearInterval(lightInterval)
    }
  }, [])

  return (
    <div className="christmas-tree-container">
      {/* Snowflakes */}
      <div className="snowflakes">
        {snowflakes.map(flake => (
          <div
            key={flake.id}
            className="snowflake"
            style={{
              left: `${flake.x}%`,
              top: `${flake.y}%`,
              fontSize: `${flake.size}px`,
              opacity: flake.opacity
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* 3D Christmas Tree */}
      <div className="tree-scene">
        {/* Tree Base/Pot */}
        <div className="tree-pot"></div>
        
        {/* Tree Trunk */}
        <div className="tree-trunk"></div>
        
        {/* Tree Layers (3D effect with multiple layers) */}
        <div className="tree-layer layer-1">
          <div className="layer-content">
            {/* ornaments */}
            <div className="ornament red" style={{top: '20%', left: '15%'}}></div>
            <div className="ornament gold" style={{top: '25%', right: '20%'}}></div>
            <div className="ornament blue" style={{top: '30%', left: '25%'}}></div>
            <div className="ornament red" style={{top: '35%', right: '15%'}}></div>
          </div>
        </div>
        
        <div className="tree-layer layer-2">
          <div className="layer-content">
            {/* ornaments */}
            <div className="ornament gold" style={{top: '15%', left: '10%'}}></div>
            <div className="ornament blue" style={{top: '20%', right: '25%'}}></div>
            <div className="ornament red" style={{top: '25%', left: '30%'}}></div>
            <div className="ornament gold" style={{top: '30%', right: '10%'}}></div>
            <div className="ornament blue" style={{top: '35%', left: '20%'}}></div>
          </div>
        </div>
        
        <div className="tree-layer layer-3">
          <div className="layer-content">
            {/* ornaments */}
            <div className="ornament red" style={{top: '10%', left: '20%'}}></div>
            <div className="ornament gold" style={{top: '15%', right: '15%'}}></div>
            <div className="ornament blue" style={{top: '20%', left: '25%'}}></div>
            <div className="ornament red" style={{top: '25%', right: '20%'}}></div>
            <div className="ornament gold" style={{top: '30%', left: '15%'}}></div>
            <div className="ornament blue" style={{top: '35%', right: '25%'}}></div>
          </div>
        </div>

        {/* Tree Top */}
        <div className="tree-top">
          <div className="star" style={{animation: lightsOn ? 'starTwinkle 2s infinite' : 'none'}}>
            ⭐
          </div>
        </div>

        {/* Christmas Lights */}
        <div className="lights-container">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className={`light ${i % 4 === 0 ? 'red' : i % 4 === 1 ? 'green' : i % 4 === 2 ? 'blue' : 'yellow'} ${
                lightsOn ? 'on' : 'off'
              }`}
              style={{
                left: `${10 + (i * 4)}%`,
                animationDelay: `${i * 0.1}s`
              }}
            ></div>
          ))}
        </div>

        {/* Gift Boxes */}
        <div className="gifts">
          <div className="gift gift-1">
            <div className="ribbon ribbon-vertical"></div>
            <div className="ribbon ribbon-horizontal"></div>
          </div>
          <div className="gift gift-2">
            <div className="ribbon ribbon-vertical"></div>
            <div className="ribbon ribbon-horizontal"></div>
          </div>
          <div className="gift gift-3">
            <div className="ribbon ribbon-vertical"></div>
            <div className="ribbon ribbon-horizontal"></div>
          </div>
        </div>
      </div>

      {/* Tree Info */}
      <div className="tree-info">
        <h3>🎄 Christmas Tree 🎄</h3>
        <p>Wishing you a season filled with joy and wonder!</p>
        <div className="tree-lights-toggle">
          <button 
            onClick={() => setLightsOn(!lightsOn)}
            className={`lights-button ${lightsOn ? 'on' : 'off'}`}
          >
            {lightsOn ? '💡 Turn Off Lights' : '💡 Turn On Lights'}
          </button>
        </div>
      </div>
    </div>
  )
}