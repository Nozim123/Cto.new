import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { UserProvider } from './contexts/UserContext'
import PublicLayout from './components/PublicLayout'

// Public pages
import HomePage from './pages/HomePage'
import MallDetailsPage from './pages/MallDetailsPage'
import StoreDirectoryPage from './pages/StoreDirectoryPage'
import StoreDetailsPage from './pages/StoreDetailsPage'

import DiscoverPage from './pages/DiscoverPage'
import ExploreMapPage from './pages/ExploreMapPage'
import ExperiencesPage from './pages/ExperiencesPage'
import EventsPage from './pages/EventsPage'
import FavoritesPage from './pages/FavoritesPage'
import ProfilePage from './pages/ProfilePage'
import UserLoginPage from './pages/UserLoginPage'
import RegisterPage from './pages/RegisterPage'
import HelpCenterPage from './pages/HelpCenterPage'
import PartnerWithUsPage from './pages/PartnerWithUsPage'
import FutureInnovationsPage from './pages/FutureInnovationsPage'

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
import ContentStudioPage from './admin/pages/ContentStudioPage'
import MediaLibraryPage from './admin/pages/MediaLibraryPage'
import UsersPage from './admin/pages/UsersPage'
import { ProtectedRoute } from './admin/hooks/useAuth'

import Skeleton from './components/ui/Skeleton'

function App() {
  return (
    <Router>
      <UserProvider>
        <Suspense
          fallback={
            <div className="min-h-screen bg-midnight flex items-center justify-center p-6">
              <div className="w-full max-w-3xl space-y-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
              </div>
            </div>
          }
        >
          <Routes>
            {/* Admin */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="content" element={<ContentStudioPage />} />
                    <Route path="media" element={<MediaLibraryPage />} />
                    <Route path="users" element={<UsersPage />} />
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
              }
            />

            {/* Public */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="discover" element={<DiscoverPage />} />
              <Route path="map" element={<ExploreMapPage />} />
              <Route path="experiences" element={<ExperiencesPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="help" element={<HelpCenterPage />} />
              <Route path="partner" element={<PartnerWithUsPage />} />
              <Route path="future" element={<FutureInnovationsPage />} />

              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="login" element={<UserLoginPage />} />
              <Route path="register" element={<RegisterPage />} />

              <Route path="mall/:mallId" element={<MallDetailsPage />} />
              <Route path="mall/:mallId/stores" element={<StoreDirectoryPage />} />
              <Route path="mall/:mallId/store/:storeId" element={<StoreDetailsPage />} />

              <Route
                path="*"
                element={
                  <div className="section-padding max-w-6xl mx-auto">
                    <h1 className="heading-large">Page not found</h1>
                    <p className="text-subtle mt-3">The page you’re looking for doesn’t exist.</p>
                  </div>
                }
              />
            </Route>
          </Routes>
        </Suspense>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(17, 18, 24, 0.85)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(14px)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22D3EE',
                secondary: '#111218',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#FB7185',
                secondary: '#111218',
              },
            },
          }}
        />
      </UserProvider>
    </Router>
  )
}

export default App
