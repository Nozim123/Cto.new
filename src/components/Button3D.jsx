import { useRef, useState } from 'react'

export default function Button3D({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false,
  fullWidth = false,
  size = 'md'
}) {
  const buttonRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!buttonRef.current || disabled) return
    
    const rect = buttonRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const tiltX = ((y - centerY) / centerY) * -10 // Inverted for natural feel
    const tiltY = ((x - centerX) / centerX) * 10
    
    setTilt({ x: tiltX, y: tiltY })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800 shadow-lg shadow-purple-500/50',
    secondary: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 shadow-lg shadow-blue-500/50',
    accent: 'bg-gradient-to-r from-pink-500 to-rose-700 text-white hover:from-pink-600 hover:to-rose-800 shadow-lg shadow-pink-500/50',
    outline: 'border-2 border-purple-500 dark:border-purple-400 text-purple-600 dark:text-purple-300 hover:bg-purple-500/10 dark:hover:bg-purple-400/10',
    ghost: 'bg-white/10 dark:bg-gray-800/30 backdrop-blur-md text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-gray-800/50',
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative font-semibold rounded-2xl
        transition-all duration-300 ease-out
        transform-gpu
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
        ${className}
      `}
      style={{
        transform: disabled 
          ? 'none' 
          : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out, box-shadow 0.3s ease, background 0.3s ease',
      }}
    >
      <span 
        className="relative z-10 flex items-center justify-center gap-2"
        style={{
          transform: 'translateZ(20px)',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </span>
      
      {/* Shine effect on hover */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
          backgroundSize: '200% 200%',
          animation: 'shine 3s ease-in-out infinite',
        }}
      />
    </button>
  )
}

// Export variants for easy use
Button3D.Primary = (props) => <Button3D {...props} variant="primary" />
Button3D.Secondary = (props) => <Button3D {...props} variant="secondary" />
Button3D.Accent = (props) => <Button3D {...props} variant="accent" />
Button3D.Outline = (props) => <Button3D {...props} variant="outline" />
Button3D.Ghost = (props) => <Button3D {...props} variant="ghost" />
