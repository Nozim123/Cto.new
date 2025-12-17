import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { UserProvider } from './contexts/UserContext'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import BottomNavigation from './components/BottomNavigation'
import SeasonalBackground from './components/SeasonalBackground'
import InteractiveBackground from './components/InteractiveBackground'
import FloatingActionButton from './components/FloatingActionButton'
import CustomCursor from './components/CustomCursor'
import HomePage from './pages/HomePage'
import MallDetailsPage from './pages/MallDetailsPage'
import StoreDirectoryPage from './pages/StoreDirectoryPage'
import StoreDetailsPage from './pages/StoreDetailsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import MapPage from './pages/MapPage'

// Admin pages
import LoginPage from './admin/pages/LoginPage'
import DashboardPage from './admin/pages/DashboardPage'
import MallListPage from './admin/pages/MallListPage'
import MallFormPage from './admin/pages/MallFormPage'
import StoreListPage from './admin/pages/StoreListPage'
import StoreFormPage from './admin/pages/StoreFormPage'
import ProductListPage from './admin/pages/ProductListPage'
import ProductFormPage from './admin/pages/ProductFormPage'
import BannerListPage from './admin/pages/BannerListPage'
import BannerFormPage from './admin/pages/BannerFormPage'
import SettingsPage from './admin/pages/SettingsPage'
import { ProtectedRoute } from './admin/hooks/useAuth'

// Component to handle route-based navigation
function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="flex flex-col min-h-screen bg-cream dark:bg-primary transition-colors duration-300 relative">
      <CustomCursor />
      <InteractiveBackground />
      <SeasonalBackground />
      
      {/* Public routes */}
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <Routes>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/malls" element={<MallListPage />} />
              <Route path="/admin/malls/new" element={<MallFormPage />} />
              <Route path="/admin/malls/:id/edit" element={<MallFormPage />} />
              <Route path="/admin/stores" element={<StoreListPage />} />
              <Route path="/admin/stores/new" element={<StoreFormPage />} />
              <Route path="/admin/stores/:id/edit" element={<StoreFormPage />} />
              <Route path="/admin/products" element={<ProductListPage />} />
              <Route path="/admin/products/new" element={<ProductFormPage />} />
              <Route path="/admin/products/:id/edit" element={<ProductFormPage />} />
              <Route path="/admin/banners" element={<BannerListPage />} />
              <Route path="/admin/banners/new" element={<BannerFormPage />} />
              <Route path="/admin/banners/:id/edit" element={<BannerFormPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
            </Routes>
          </ProtectedRoute>
        } />
        <Route path="/*" element={
          <>
            {!isAdminRoute && <Navigation />}
            <main className={`flex-grow relative z-10 ${!isAdminRoute ? 'pb-16 md:pb-0' : ''}`}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/mall/:mallId" element={<MallDetailsPage />} />
                <Route path="/mall/:mallId/stores" element={<StoreDirectoryPage />} />
                <Route path="/mall/:mallId/store/:storeId" element={<StoreDetailsPage />} />
                <Route path="/product/:productId" element={<ProductDetailPage />} />
              </Routes>
            </main>
            {!isAdminRoute && (
              <>
                <Footer />
                <BottomNavigation />
                <FloatingActionButton />
              </>
            )}
          </>
        } />
      </Routes>
      
      {/* Toast notifications - only show on public routes */}
      {!isAdminRoute && (
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <UserProvider>
          <Router>
            <AppContent />
          </Router>
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
