# Livestream Overlay API Documentation

## Base URL
All API endpoints are accessed via Lovable Cloud edge functions.

## Authentication
All endpoints require authentication using Bearer token:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Overlays API

### GET /overlays
Retrieve all overlays for authenticated user.

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "My Text Overlay",
    "type": "text",
    "content": "Sample Text",
    "image_url": null,
    "position_x": 50,
    "position_y": 100,
    "width": 200,
    "height": 50,
    "font_size": 24,
    "color": "#ffffff",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### GET /overlays?id={overlay_id}
Retrieve a specific overlay by ID.

**Parameters:**
- `id` (query): UUID of the overlay

**Response:**
```json
{
  "id": "uuid",
  "name": "My Overlay",
  "type": "logo",
  "image_url": "https://example.com/logo.png",
  "position_x": 10,
  "position_y": 10,
  "width": 150,
  "height": 150
}
```

### POST /overlays
Create a new overlay.

**Request Body:**
```json
{
  "name": "New Overlay",
  "type": "text|logo|image",
  "content": "Text content (for text type)",
  "image_url": "Image URL (for logo/image type)",
  "position_x": 50,
  "position_y": 50,
  "width": 100,
  "height": 100,
  "font_size": 16,
  "color": "#000000"
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "New Overlay",
  ...
}
```

### PUT /overlays?id={overlay_id}
Update an existing overlay.

**Parameters:**
- `id` (query): UUID of the overlay to update

**Request Body:**
```json
{
  "name": "Updated Overlay",
  "type": "text",
  "content": "Updated text",
  "position_x": 100,
  "position_y": 150
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Updated Overlay",
  ...
}
```

### DELETE /overlays?id={overlay_id}
Delete an overlay.

**Parameters:**
- `id` (query): UUID of the overlay to delete

**Response:**
```json
{
  "success": true
}
```

---

## Livestream Settings API

### GET /livestream-settings
Retrieve livestream settings for authenticated user.

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "rtsp_url": "rtsp://example.com/stream",
  "stream_name": "My Stream",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### POST /livestream-settings
Create or update livestream settings.

**Request Body:**
```json
{
  "rtsp_url": "rtsp://example.com/stream",
  "stream_name": "My Livestream"
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "rtsp_url": "rtsp://example.com/stream",
  "stream_name": "My Livestream"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

---

## Data Types

### Overlay Types
- `text` - Text overlay with customizable font and color
- `logo` - Logo image overlay
- `image` - General image overlay

### Field Constraints
- `name`: Required, max 255 characters
- `type`: Required, one of: text, logo, image
- `content`: Required for text type
- `image_url`: Required for logo/image types
- `position_x`, `position_y`: Float values (pixels)
- `width`, `height`: Float values (pixels)
- `font_size`: Integer (for text overlays)
- `color`: Hex color code (for text overlays)

---

## Example Usage

### JavaScript/TypeScript
```typescript
// Create an overlay
const response = await fetch('YOUR_EDGE_FUNCTION_URL/overlays', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'My Text',
    type: 'text',
    content: 'Hello World',
    position_x: 50,
    position_y: 50,
    width: 200,
    height: 50,
    font_size: 24,
    color: '#ffffff'
  })
});

const data = await response.json();
console.log(data);
```

### cURL
```bash
# Get all overlays
curl -X GET "YOUR_EDGE_FUNCTION_URL/overlays" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create overlay
curl -X POST "YOUR_EDGE_FUNCTION_URL/overlays" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Overlay",
    "type": "text",
    "content": "Test",
    "position_x": 0,
    "position_y": 0
  }'

# Update overlay
curl -X PUT "YOUR_EDGE_FUNCTION_URL/overlays?id=OVERLAY_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Overlay"
  }'

# Delete overlay
curl -X DELETE "YOUR_EDGE_FUNCTION_URL/overlays?id=OVERLAY_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
