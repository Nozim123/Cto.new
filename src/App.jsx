import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import MallDetailsPage from './pages/MallDetailsPage'
import StoreDirectoryPage from './pages/StoreDirectoryPage'
import StoreDetailsPage from './pages/StoreDetailsPage'

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
    <Router>
      <div className="flex flex-col min-h-screen bg-cream">
        {/* Public routes */}
        <Routes>
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="malls" element={<MallListPage />} />
                <Route path="malls/new" element={<MallFormPage />} />
                <Route path="malls/:id/edit" element={<MallFormPage />} />
                <Route path="stores" element={<StoreListPage />} />
                <Route path="stores/new" element={<StoreFormPage />} />
                <Route path="stores/:id/edit" element={<StoreFormPage />} />
                <Route path="products" element={<ProductListPage />} />
                <Route path="products/new" element={<ProductFormPage />} />
                <Route path="products/:id/edit" element={<ProductFormPage />} />
                <Route path="banners" element={<BannerListPage />} />
                <Route path="banners/new" element={<BannerFormPage />} />
                <Route path="banners/:id/edit" element={<BannerFormPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Routes>
            </ProtectedRoute>
          } />
          <Route path="/*" element={
            <>
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
  )
}

export default App
