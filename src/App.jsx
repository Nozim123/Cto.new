import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import { UserAuthProvider, UserProtectedRoute } from './contexts/UserAuthContext'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import BottomNavigation from './components/BottomNavigation'
import SeasonalBackground from './components/SeasonalBackground'
import HomePage from './pages/HomePage'
import MallDetailsPage from './pages/MallDetailsPage'
import StoreDirectoryPage from './pages/StoreDirectoryPage'
import StoreDetailsPage from './pages/StoreDetailsPage'
import UserLoginPage from './pages/UserLoginPage'
import UserRegisterPage from './pages/UserRegisterPage'
import OnboardingPage from './pages/OnboardingPage'
import ProfilePage from './pages/ProfilePage'

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

function App() {
  return (
    <ThemeProvider>
      <UserAuthProvider>
        <Router>
        <div className="flex flex-col min-h-screen bg-cream dark:bg-primary transition-colors duration-300 relative">
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
              <Navigation />
              <main className="flex-grow relative z-10 pb-16 md:pb-0">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<UserLoginPage />} />
                  <Route path="/register" element={<UserRegisterPage />} />
                  <Route
                    path="/onboarding"
                    element={
                      <UserProtectedRoute>
                        <OnboardingPage />
                      </UserProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <UserProtectedRoute>
                        <ProfilePage />
                      </UserProtectedRoute>
                    }
                  />
                  <Route path="/mall/:mallId" element={<MallDetailsPage />} />
                  <Route path="/mall/:mallId/stores" element={<StoreDirectoryPage />} />
                  <Route path="/mall/:mallId/store/:storeId" element={<StoreDetailsPage />} />
                </Routes>
              </main>
              <Footer />
              <BottomNavigation />
            </>
          } />
        </Routes>
        
        {/* Toast notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
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
        </div>
        </Router>
      </UserAuthProvider>
    </ThemeProvider>
  )
}

export default App
