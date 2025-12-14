import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import MallDetailsPage from './pages/MallDetailsPage'
import StoreDirectoryPage from './pages/StoreDirectoryPage'
import StoreDetailsPage from './pages/StoreDetailsPage'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-cream">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mall/:mallId" element={<MallDetailsPage />} />
            <Route path="/mall/:mallId/stores" element={<StoreDirectoryPage />} />
            <Route path="/mall/:mallId/store/:storeId" element={<StoreDetailsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
