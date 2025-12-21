import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import mallsData from '../data/malls.json'
import MapErrorBoundary from './MapErrorBoundary'

export default function InteractiveMap({ 
  selectedMallId, 
  onMallSelect, 
  showDirections = false,
  className = '' 
}) {
  const { darkMode } = useTheme()
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [directionsService, setDirectionsService] = useState(null)
  const [directionsRenderer, setDirectionsRenderer] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Load Google Maps API
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap()
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initializeMap
      script.onerror = () => setError('Failed to load Google Maps')
      document.head.appendChild(script)
    }

    const initializeMap = () => {
      try {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: 39.6542, lng: 66.9597 }, // Samarkand center
          zoom: 13,
          styles: darkMode ? getDarkMapStyles() : [],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        })

        setMap(mapInstance)
        setDirectionsService(new window.google.maps.DirectionsService())
        setDirectionsRenderer(new window.google.maps.DirectionsRenderer({
          map: mapInstance,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#F59E0B',
            strokeWeight: 4,
            strokeOpacity: 0.8,
          }
        }))

        // Add mall markers
        addMallMarkers(mapInstance)
        
        // Get user location
        getUserLocation(mapInstance)
        
        setIsLoaded(true)
      } catch (err) {
        setError('Failed to initialize map')
        console.error('Map initialization error:', err)
      }
    }

    loadGoogleMaps()

    return () => {
      // Cleanup
      if (map) {
        window.google?.maps?.event?.clearInstanceListeners(map)
      }
    }
  }, [])

  useEffect(() => {
    if (map && selectedMallId && showDirections) {
      const selectedMall = mallsData.find(m => m.id === selectedMallId)
      if (selectedMall && userLocation) {
        showDirectionsToMall(selectedMall)
      }
    }
  }, [selectedMallId, showDirections, userLocation, map])

  const getDarkMapStyles = () => [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }]
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }]
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }]
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }]
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }]
    }
  ]

  const addMallMarkers = (mapInstance) => {
    mallsData.forEach(mall => {
      if (mall.status === 'coming_soon') return

      const marker = new window.google.maps.Marker({
        position: { lat: mall.coordinates[0], lng: mall.coordinates[1] },
        map: mapInstance,
        title: mall.name,
        icon: {
          url: getMarkerIcon(mall),
          scaledSize: new window.google.maps.Size(40, 40),
        },
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: createInfoWindowContent(mall),
      })

      marker.addListener('click', () => {
        // Close all other info windows
        mallsData.forEach(otherMall => {
          if (otherMall.infoWindow) {
            otherMall.infoWindow.close()
          }
        })
        
        infoWindow.open(mapInstance, marker)
        onMallSelect?.(mall.id)
      })

      mall.infoWindow = infoWindow
      mall.marker = marker
    })
  }

  const getMarkerIcon = (mall) => {
    const isSelected = mall.id === selectedMallId
    const color = isSelected ? '#F59E0B' : '#6366F1'
    
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="20" cy="20" r="8" fill="white"/>
        <text x="20" y="25" text-anchor="middle" fill="${color}" font-size="12" font-weight="bold">M</text>
      </svg>
    `)}`
  }

  const createInfoWindowContent = (mall) => {
    return `
      <div class="p-3 min-w-[250px] ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}">
        <h3 class="font-bold text-lg mb-2">${mall.name}</h3>
        <p class="text-sm mb-2">${mall.description}</p>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs px-2 py-1 rounded-full ${mall.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
            ${mall.status === 'open' ? 'Open' : 'Closed'}
          </span>
          <span class="text-xs">${mall.hours}</span>
        </div>
        <p class="text-xs mb-3">${mall.address}</p>
        <div class="flex gap-2">
          <button onclick="window.selectMall('${mall.id}')" class="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
            View Details
          </button>
          <button onclick="window.getDirections('${mall.id}')" class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
            Directions
          </button>
        </div>
      </div>
    `
  }

  const getUserLocation = (mapInstance) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setUserLocation(userPos)

        // Add user marker
        new window.google.maps.Marker({
          position: userPos,
          map: mapInstance,
          title: 'Your Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="13" fill="#EF4444" stroke="white" stroke-width="2"/>
                <circle cx="15" cy="15" r="5" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(30, 30),
          },
        })

        // Center map on user location initially
        mapInstance.setCenter(userPos)
      },
      (error) => {
        console.error('Error getting user location:', error)
        setError('Unable to get your location')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }

  const showDirectionsToMall = (mall) => {
    if (!directionsService || !directionsRenderer || !userLocation) {
      console.error('Directions service not available or user location not set')
      return
    }

    directionsService.route(
      {
        origin: userLocation,
        destination: { lat: mall.coordinates[0], lng: mall.coordinates[1] },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result)
          
          // Calculate and display route info
          const route = result.routes[0]
          const leg = route.legs[0]
          
          // You can use this information to show distance and time
          console.log(`Distance: ${leg.distance.text}, Duration: ${leg.duration.text}`)
        } else {
          console.error('Directions request failed:', status)
        }
      }
    )
  }

  // Expose functions to window for info window buttons
  useEffect(() => {
    window.selectMall = (mallId) => {
      onMallSelect?.(mallId)
    }
    
    window.getDirections = (mallId) => {
      const mall = mallsData.find(m => m.id === mallId)
      if (mall) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${mall.coordinates[0]},${mall.coordinates[1]}&travelmode=driving`
        window.open(url, '_blank')
      }
    }

    return () => {
      delete window.selectMall
      delete window.getDirections
    }
  }, [onMallSelect])

  if (error) {
    return (
      <div className={`${className} bg-red-50 border border-red-200 rounded-lg p-4 ${darkMode ? 'bg-red-900/20 border-red-800' : ''}`}>
        <div className="text-red-600 text-center">
          <p className="font-semibold">Map Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <MapErrorBoundary>
      <div className={`${className} relative`}>
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg overflow-hidden border border-gray-300"
          style={{ minHeight: '400px' }}
        />
        
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading interactive map...</p>
            </div>
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <button
            onClick={() => {
              if (map && userLocation) {
                map.setCenter(userLocation)
                map.setZoom(15)
              }
            }}
            className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Center on my location"
          >
            📍
          </button>
          
          <button
            onClick={() => {
              if (map) {
                map.setCenter({ lat: 39.6542, lng: 66.9597 })
                map.setZoom(13)
              }
            }}
            className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Center on Samarkand"
          >
            🏛️
          </button>
        </div>
      </div>
    </MapErrorBoundary>
  )
}