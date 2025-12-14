import { Outlet, useLocation } from 'react-router-dom'
import Navigation from './Navigation'
import Footer from './Footer'
import BottomNav from './BottomNav'
import FloatingActionButton from './FloatingActionButton'
import OnboardingModal from './OnboardingModal'

export default function PublicLayout() {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen bg-midnight">
      <Navigation />
      <main key={location.pathname} className="flex-grow page-enter">
        <Outlet />
      </main>
      <Footer />

      <BottomNav />
      <FloatingActionButton />
      <OnboardingModal />
    </div>
  )
}
