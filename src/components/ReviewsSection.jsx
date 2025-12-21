import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import Button3D from './Button3D'

export default function ReviewsSection({ entityType, entityId, entityName }) {
  const { darkMode } = useTheme()
  const { user, isAuthenticated } = useUser()
  const { t } = useLanguage()
  const [reviews, setReviews] = useState([])
  const [userReview, setUserReview] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [entityType, entityId])

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      // In a real app, this would be an API call
      const response = await fetch(`/api/reviews?entityType=${entityType}&entityId=${entityId}`)
      const data = await response.json()
      setReviews(data.reviews || [])
      
      // Check if current user has already reviewed
      if (user) {
        const existingReview = data.reviews.find(r => r.userId === user.id)
        setUserReview(existingReview)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      alert('Please login to leave a review')
      return
    }

    if (!newComment.trim()) {
      alert('Please write a review comment')
      return
    }

    setIsSubmitting(true)

    try {
      const reviewData = {
        entityType,
        entityId,
        rating: newRating,
        comment: newComment.trim(),
        userId: user.id,
        userName: user.name,
        timestamp: new Date().toISOString()
      }

      // In a real app, this would be an API call
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      })

      if (response.ok) {
        // Refresh reviews
        await fetchReviews()
        setShowReviewForm(false)
        setNewRating(5)
        setNewComment('')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return

    try {
      setIsSubmitting(true)
      // Admin or review owner can delete
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': user?.token }
      })

      if (response.ok) {
        await fetchReviews()
      }
    } catch (error) {
      console.error('Error deleting review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Pagination for reviews
  const [page, setPage] = useState(1)
  const reviewsPerPage = 5
  const totalPages = Math.ceil(reviews.length / reviewsPerPage)
  const paginatedReviews = reviews.slice((page - 1) * reviewsPerPage, page * reviewsPerPage)

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  return (
    <div className={`rounded-2xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'} p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            ⭐ Reviews & Ratings
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-2xl ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {averageRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>
        
        {!showReviewForm && !userReview && (
          <Button3D onClick={() => setShowReviewForm(true)} variant="primary" size="sm">
            Write Review
          </Button3D>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className={`mb-6 p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Rate {entityName}
          </h4>
          
          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewRating(star)}
                  className={`text-3xl transition-colors ${
                    star <= newRating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Your Review
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-900 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder={`Share your experience with ${entityName}...`}
            />
          </div>

          <div className="flex gap-3">
            <Button3D 
              onClick={handleSubmitReview}
              variant="primary" 
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button3D>
            <Button3D 
              onClick={() => setShowReviewForm(false)}
              variant="outline" 
              size="sm"
            >
              Cancel
            </Button3D>
          </div>
        </div>
      )}

      {/* User's Existing Review */}
      {userReview && !showReviewForm && (
        <div className={`mb-4 p-4 rounded-2xl border ${darkMode ? 'border-purple-500/30 bg-purple-900/20' : 'border-purple-200 bg-purple-50'}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-purple-600">Your Review</span>
                <div className="flex text-yellow-400">
                  {[...Array(userReview.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {userReview.comment}
              </p>
            </div>
            <button
              onClick={() => handleDeleteReview(userReview.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : paginatedReviews.length > 0 ? (
        <div className="space-y-4">
          {paginatedReviews.map((review) => (!userReview || userReview.id !== review.id) && (
            <div key={review.id} className={`p-4 rounded-xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {review.userName}
                    </span>
                    <div className="flex text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-sm">★</span>
                      ))}
                    </div>
                  </div>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(review.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📝</div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            No reviews yet. Be the first to review {entityName}!
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded-lg ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            } ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ←
          </button>
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded-lg ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            } ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}