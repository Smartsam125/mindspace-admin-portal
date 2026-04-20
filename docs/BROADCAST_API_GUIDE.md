# Broadcast Notification API

Send a push notification and in-app notification to all active users of a specific role.

## Endpoint

```
POST /api/v1/admin/broadcast
```

## Authentication

Requires an **Admin** or **Super Admin** JWT.

```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

## Request Body

```json
{
  "title": "Platform Update",
  "body": "We've added new features! Check them out.",
  "targetRole": "CLIENT"
}
```

| Field        | Type   | Required | Allowed Values                                  |
|--------------|--------|----------|-------------------------------------------------|
| `title`      | string | Yes      | Any non-blank string                            |
| `body`       | string | Yes      | Any non-blank string                            |
| `targetRole` | string | Yes      | `CLIENT`, `THERAPIST`, `ADMIN`, `SUPER_ADMIN`   |

## Success Response

**Status:** `200 OK`

```json
{
  "status": "OK",
  "message": "Broadcast sent.",
  "data": null
}
```

## Error Responses

| Status | Cause                                  |
|--------|----------------------------------------|
| `400`  | Missing or blank `title`, `body`, or invalid `targetRole` |
| `401`  | Missing or invalid JWT token           |
| `403`  | Authenticated user is not an admin     |

## Behavior

- The endpoint returns immediately. Notifications are sent **asynchronously** in the background.
- Each targeted user receives both a **push notification** (via Firebase Cloud Messaging) and a **persisted in-app notification**.
- Users without an FCM token still receive the in-app notification (visible via `GET /api/v1/notifications`).
- Only **active** users are included in the broadcast.
- The notification `type` is set to `"broadcast"` so the frontend can distinguish it from other notification types.

## Example (cURL)

```bash
curl -X POST https://your-api-domain.com/api/v1/admin/broadcast \
  -H "Authorization: Bearer <admin_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Scheduled Maintenance",
    "body": "The platform will be briefly unavailable on Saturday 10pm-11pm EAT.",
    "targetRole": "CLIENT"
  }'
```

## Example (JavaScript / Fetch)

```javascript
const response = await fetch("/api/v1/admin/broadcast", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${adminToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "Welcome!",
    body: "We're excited to have you on MindSpace.",
    targetRole: "CLIENT",
  }),
});

const result = await response.json();
console.log(result.message); // "Broadcast sent."
```
