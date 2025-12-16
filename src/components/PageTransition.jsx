import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

export default function PageTransition({ children }) {
  const location = useLocation()

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Simple wrapper without framer-motion dependency (fallback)
export function SimplePageTransition({ children }) {
  return (
    <div className="animate-fade-in-up">
      {children}
    </div>
  )
}
