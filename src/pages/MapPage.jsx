import { useEffect } from 'react'
import RealTimeMap from '../components/RealTimeMap'

export default function MapPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <RealTimeMap />
    </div>
  )
}
