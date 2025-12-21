# Google Maps Integration Setup Guide

## Overview
This application includes interactive maps with the following features:
- Real-time mall locations with markers
- User location detection
- Turn-by-turn directions to selected malls
- Dark mode support for maps
- Fallback handling when API key is missing

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geocoding API

### 2. Create API Key

1. Go to "Credentials" section
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. (Optional) Restrict the API key to your domain

### 3. Configure Environment Variables

Create or update your `.env` file:

```bash
# Copy from .env.example if it doesn't exist
cp .env.example .env

# Edit .env and add your Google Maps API key
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 4. Restart Development Server

```bash
# If running, stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## Features

### Interactive Map Components

1. **RealTimeHours**: Shows live opening/closing status with countdown
2. **InteractiveMap**: Google Maps integration with user location and directions
3. **MapErrorBoundary**: Graceful handling when API key is missing

### Map Functionality

- **User Location**: Automatically detects and shows your current location
- **Mall Markers**: Click on any mall marker to view details
- **Directions**: Get turn-by-turn directions to any mall
- **Dark Mode**: Maps automatically adapt to dark/light theme
- **Responsive**: Works on mobile and desktop devices

### Error Handling

- If API key is missing: Shows setup instructions
- If location access is denied: Fallback to Samarkand center
- If directions fail: Shows error message
- Network issues: Graceful degradation

## Troubleshooting

### Map Not Loading

1. Check browser console for errors
2. Verify API key is correctly set in `.env`
3. Ensure all required APIs are enabled
4. Check domain restrictions on API key

### Location Not Detected

1. Ensure browser supports geolocation
2. Check if location permissions are granted
3. Try refreshing the page
4. Check browser privacy settings

### Directions Not Working

1. Verify Directions API is enabled
2. Check if user location was successfully detected
3. Ensure the mall coordinates are valid

## Security Notes

- API keys should be restricted to your domain in production
- Don't commit API keys to version control
- Consider using environment-specific keys
- Monitor API usage in Google Cloud Console

## Cost Considerations

- Google Maps API has usage limits and costs
- Monitor usage to avoid unexpected charges
- Consider implementing caching for production use
- Set up billing alerts in Google Cloud Console