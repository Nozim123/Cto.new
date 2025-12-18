import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { UserProvider } from './contexts/UserContext'
import { EcosystemProvider } from './contexts/EcosystemContext'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import BottomNavigation from './components/BottomNavigation'
import SeasonalBackground from './components/SeasonalBackground'
import HomePage from './pages/HomePage'
import MallDetailsPage from './pages/MallDetailsPage'
import StoreDirectoryPage from './pages/StoreDirectoryPage'
import StoreDetailsPage from './pages/StoreDetailsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import SearchResultsPage from './pages/SearchResultsPage'
import PromotionsPage from './pages/PromotionsPage'
import StoresPage from './pages/StoresPage'
import AccountPage from './pages/AccountPage'
import MapPage from './pages/MapPage'
import VirtualTourPage from './pages/VirtualTourPage'
import ComparePage from './pages/ComparePage'
import RewardsPage from './pages/RewardsPage'
import OrdersPage from './pages/OrdersPage'
import ReturnsPage from './pages/ReturnsPage'
import FeedbackPage from './pages/FeedbackPage'
import InsightsPage from './pages/InsightsPage'
import SellerDashboardPage from './pages/SellerDashboardPage'
import CmsPage from './pages/CmsPage'
import CompareBar from './components/CompareBar'

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
import CmsPagesPage from './admin/pages/CmsPagesPage'
import FeedbackAdminPage from './admin/pages/FeedbackAdminPage'
import SellerApprovalsPage from './admin/pages/SellerApprovalsPage'
import SeasonEnginePage from './admin/pages/SeasonEnginePage'
import { ProtectedRoute } from './admin/hooks/useAuth'

// Component to handle route-based navigation
function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
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
              <Route path="/admin/sellers" element={<SellerApprovalsPage />} />
              <Route path="/admin/season" element={<SeasonEnginePage />} />
              <Route path="/admin/cms" element={<CmsPagesPage />} />
              <Route path="/admin/feedback" element={<FeedbackAdminPage />} />
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
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/promotions" element={<PromotionsPage />} />
                <Route path="/stores" element={<StoresPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/rewards" element={<RewardsPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/returns" element={<ReturnsPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/seller" element={<SellerDashboardPage />} />
                <Route path="/p/:slug" element={<CmsPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/virtual-tour" element={<VirtualTourPage />} />
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
               <CompareBar />
             </>
            )}

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
          <EcosystemProvider>
            <Router>
              <AppContent />
            </Router>
          </EcosystemProvider>
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
