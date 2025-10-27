# Livestream Overlay Application - User Guide

## Overview
This application allows you to play livestreams and add custom overlays (text, logos, images) on top of the video in real-time.

---

## Getting Started

### 1. Sign Up / Sign In
- Open the application
- Create an account using email and password
- Or sign in if you already have an account

### 2. Configure Your Livestream

#### Navigate to Settings Tab
1. Click on the **Settings** tab
2. Enter your **Stream Name** (optional, for identification)
3. Enter your **Stream URL**

#### RTSP URL Configuration
**Important:** RTSP streams need to be converted to web-compatible format (HLS/DASH).

**Options:**
- Use RTSP.me service to create temporary HLS streams
- Convert your RTSP stream using FFmpeg:
  ```bash
  ffmpeg -i rtsp://your-stream-url -c:v copy -c:a aac -f hls output.m3u8
  ```
- Use services like Wowza or Ant Media Server for RTSP to HLS conversion

**Supported Stream Formats:**
- HLS (.m3u8)
- DASH
- Direct video files (MP4, WebM)

4. Click **Save Settings**

---

## Managing Overlays

### Create an Overlay

1. Navigate to the **Overlays** tab
2. Fill in the overlay details:

#### Overlay Types

**Text Overlay:**
- **Name:** Give your overlay a descriptive name
- **Type:** Select "Text"
- **Content:** Enter the text you want to display
- **Font Size:** Set text size (default: 16)
- **Color:** Choose text color using color picker

**Logo/Image Overlay:**
- **Name:** Give your overlay a descriptive name
- **Type:** Select "Logo" or "Image"
- **Image URL:** Enter the URL of your image
  - Must be a publicly accessible URL
  - Supported formats: PNG, JPG, GIF, SVG

#### Position and Size
- **Position X:** Horizontal position in pixels (0 = left edge)
- **Position Y:** Vertical position in pixels (0 = top edge)
- **Width:** Overlay width in pixels
- **Height:** Overlay height in pixels

3. Click **Create Overlay**

### View Saved Overlays
All your saved overlays appear in the "Saved Overlays" section showing:
- Overlay name
- Type
- Position coordinates

### Delete an Overlay
Click the trash icon (🗑️) next to any overlay to delete it.

---

## Watching Your Livestream

### Play the Stream

1. Navigate to the **Livestream** tab
2. You'll see your video player with all active overlays
3. Use the playback controls:
   - **Play/Pause button:** Start or pause the stream
   - **Volume slider:** Adjust audio volume
   - **Mute button:** Toggle audio on/off

### Overlay Display
- All your saved overlays automatically appear on the video
- Text overlays show with your configured font and color
- Image overlays display at specified positions

---

## Tips and Best Practices

### Stream Quality
- Use stable internet connection for smooth playback
- HLS streams work best for web browsers
- Test your stream URL before setting up overlays

### Overlay Design
- Use contrasting colors for text visibility
- Position overlays in non-critical viewing areas
- Keep text concise and readable
- Use transparent PNG images for logo overlays

### Overlay Positioning
- Position values are in pixels from top-left corner
- Video canvas is typically 800x450 pixels
- Plan your layout before creating multiple overlays

### Image URLs
- Use HTTPS URLs for security
- Ensure images are hosted on reliable servers
- Use CDN for better performance
- Recommended image sizes:
  - Logos: 100x100 to 200x200 pixels
  - Banners: 600x100 pixels

---

## Troubleshooting

### Stream Won't Play
- **Check URL format:** Ensure it's HLS (.m3u8) or compatible format
- **RTSP streams:** Must be converted to HLS/DASH
- **CORS issues:** Stream server must allow cross-origin requests
- **Network:** Check your internet connection

### Overlays Not Showing
- **Verify overlay creation:** Check "Saved Overlays" section
- **Position issues:** Ensure X/Y coordinates are within video bounds
- **Image URLs:** Verify images are publicly accessible
- **Refresh:** Try reloading the Livestream tab

### Image Overlay Issues
- **URL accessibility:** Test image URL in new browser tab
- **HTTPS required:** Use secure URLs for images
- **CORS:** Image server must allow cross-origin access
- **File format:** Use standard formats (PNG, JPG, GIF)

---

## API Integration

For developers wanting to integrate with the API, see `API_DOCUMENTATION.md` for:
- REST API endpoints
- Request/response formats
- Authentication methods
- Code examples

---

## Data Privacy

- Your overlays and settings are stored securely
- Only you can access your overlays
- Authentication required for all operations
- Data is encrypted in transit and at rest

---

## Support

For issues or questions:
1. Check this documentation
2. Review API documentation for technical details
3. Verify your stream format compatibility
4. Ensure proper authentication

---

## Quick Reference

### Supported Stream Formats
✅ HLS (.m3u8)  
✅ DASH  
✅ MP4 (direct)  
✅ WebM (direct)  
❌ RTSP (requires conversion)

### Overlay Types
- **Text:** Custom text with font/color
- **Logo:** Small branded images
- **Image:** Larger graphics/banners

### Default Canvas Size
- Width: 800px
- Height: 450px

### Recommended Overlay Sizes
- Small logo: 100x100px
- Large logo: 200x200px
- Text banner: 600x100px
- Full banner: 800x100px
