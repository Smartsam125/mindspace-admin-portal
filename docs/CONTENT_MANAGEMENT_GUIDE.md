# Content Management API Guide (Admin Portal)

**Date:** 2026-04-17
**Status:** MVP
**Base URL:** `/api/v1/admin`

---

## Overview

Admins manage three content types through a unified API: **Library (Resources)**, **Affirmations**, and **Events**. All are stored as `AppContent` with a `type` discriminator.

---

## Authentication

All admin endpoints require a valid JWT token with `ADMIN` or `SUPER_ADMIN` role.

```
Authorization: Bearer <jwt_token>
```

---

## 1. Create Content

```
POST /api/v1/admin/content
```

### Create a Resource (Library Item)

```json
{
  "type": "RESOURCE",
  "title": "The Body Keeps the Score",
  "body": "A pioneering researcher explores how trauma reshapes the body...",
  "author": "Bessel van der Kolk",
  "category": "SELF_HELP_BOOKS",
  "imageUrl": "https://example.com/cover.jpg",
  "externalLink": "https://example.com/buy"
}
```

### Create an Affirmation

```json
{
  "type": "AFFIRMATION",
  "title": "You Are Not Alone",
  "body": "Remember that asking for help is a sign of strength, not weakness.",
  "category": "SAD"
}
```

**Note:** The `category` for affirmations maps to mood names (`HAPPY`, `OKAY`, `ANXIOUS`, `SAD`, `OVERWHELMED`). This allows mood-specific affirmations to be shown when clients log their mood. Leave `category` null for general affirmations.

### Create an Event

```json
{
  "type": "EVENT",
  "title": "World Mental Health Day Workshop",
  "body": "Join us for a virtual workshop on managing stress.",
  "location": "Online / Zoom",
  "eventDate": "2026-05-10",
  "imageUrl": "https://example.com/event.jpg",
  "externalLink": "https://meet.google.com/xyz"
}
```

**Response `201`:**

```json
{
  "status": "OK",
  "message": "Content created.",
  "data": {
    "id": 15,
    "type": "RESOURCE",
    "title": "The Body Keeps the Score",
    "body": "...",
    "imageUrl": "https://example.com/cover.jpg",
    "externalLink": "https://example.com/buy",
    "category": "SELF_HELP_BOOKS",
    "author": "Bessel van der Kolk",
    "location": null,
    "eventDate": null,
    "active": true,
    "createdAt": "2026-04-17T14:00:00",
    "updatedAt": "2026-04-17T14:00:00"
  }
}
```

---

## 2. Update Content

```
PUT /api/v1/admin/content/{id}
```

Same body structure as create. All fields are sent (full replacement).

---

## 3. Delete Content

```
DELETE /api/v1/admin/content/{id}
```

Permanently deletes the content.

---

## 4. Toggle Active/Inactive

```
PATCH /api/v1/admin/content/{id}/toggle
```

Toggles content visibility. Inactive content is hidden from mobile clients.

---

## 5. List Content by Type

```
GET /api/v1/admin/content?type=RESOURCE
GET /api/v1/admin/content?type=AFFIRMATION
GET /api/v1/admin/content?type=EVENT
```

Returns all content of the given type (including inactive).

---

## Content Fields Reference

| Field | Type | Required | Used By | Description |
|-------|------|----------|---------|-------------|
| type | Enum | Yes | All | `RESOURCE`, `AFFIRMATION`, `EVENT` |
| title | String | Yes | All | Content title |
| body | String | No | All | Full description/text |
| imageUrl | String | No | All | Cover image or banner |
| externalLink | String | No | Resources, Events | Link to external resource or registration |
| category | String | No | Resources, Affirmations | Resource category or mood name for affirmations |
| author | String | No | Resources | Author/creator name |
| location | String | No | Events | Physical location or "Online" |
| eventDate | LocalDate | No | Events | Event date (format: `2026-05-10`) |

---

## Resource Categories

These are seeded automatically and displayed as filter tabs in the mobile Library:

| Name | Label |
|------|-------|
| `SELF_HELP_BOOKS` | Self-Help Books |
| `JOURNALS` | Guided Journals |
| `ARTICLES` | Articles |
| `AUDIO` | Audio & Podcasts |
| `VIDEOS` | Videos |

### Manage Categories

Resource categories are stored as `EnumOption` with category `RESOURCE_CATEGORY`.

```
POST /api/v1/admin/options
```

```json
{
  "category": "RESOURCE_CATEGORY",
  "name": "WORKSHEETS",
  "label": "Worksheets",
  "description": "Printable mental health worksheets"
}
```

```
GET /api/v1/admin/options          — List all options (all categories)
DELETE /api/v1/admin/options/{id}  — Delete an option
```

---

## Affirmation Categories (Mood Mapping)

When creating affirmations, set `category` to a mood name so the affirmation is shown to clients who log that mood:

| Category | Shown When Client Logs... |
|----------|--------------------------|
| `HAPPY` | Happy mood |
| `OKAY` | Neutral/Okay mood |
| `ANXIOUS` | Anxious mood |
| `SAD` | Sad mood |
| `OVERWHELMED` | Overwhelmed mood |
| *(null)* | General affirmation (random selection fallback) |

**Daily Push:** Every day at 9 AM, a random affirmation is sent as a push notification to all active clients.

---

## Admin Portal UI Suggestions

### Library Page

- **Tabs/sidebar:** Resource | Affirmation | Event
- **Table columns:** Title, Author, Category, Active (toggle), Created, Actions (Edit/Delete)
- **Add button:** Opens modal/form with fields based on selected type
- **Search/filter:** By category or keyword

### Event Management

- **Calendar view** or table sorted by `eventDate`
- Show past events grayed out
- Include `location` in the form

### Affirmation Management

- Group by category (mood) for easier management
- Show total count per mood category
- Quick-add form for batch entry

---

## Seeded Data (Available at Launch)

### Resources (5 items)

| Title | Author | Category |
|-------|--------|----------|
| Feeling Good: The New Mood Therapy | David D. Burns | SELF_HELP_BOOKS |
| The Body Keeps the Score | Bessel van der Kolk | SELF_HELP_BOOKS |
| Atomic Habits | James Clear | SELF_HELP_BOOKS |
| The Anxiety and Phobia Workbook | Edmund J. Bourne | JOURNALS |
| Understanding Your Emotions | MindSpace Team | ARTICLES |

### Resource Categories (5 options)

SELF_HELP_BOOKS, JOURNALS, ARTICLES, AUDIO, VIDEOS
