# Events - Admin Portal Changes

## Overview

Events are already managed in `ContentPage.jsx` under the EVENT tab. The changes below add:
1. **Attendee count** on each event card
2. **Attendees list** modal to view who has RSVP'd
3. **Resource type** dropdown for RESOURCE content
4. Remove the **External Link** field from events (RSVP is in-app, no external registration)

---

## API Endpoints

### Existing (no changes)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/admin/content?type=EVENT` | List all events |
| `POST` | `/api/v1/admin/content` | Create event |
| `PUT` | `/api/v1/admin/content/{id}` | Update event |
| `DELETE` | `/api/v1/admin/content/{id}` | Delete event |
| `PATCH` | `/api/v1/admin/content/{id}/toggle` | Toggle active/inactive |

### New

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/admin/events/{eventId}/attendees` | Get list of users who RSVP'd to an event |

**Attendees response:**
```json
{
  "status": "OK",
  "message": "Attendees fetched.",
  "data": [
    {
      "id": 5,
      "email": "jane@example.com",
      "fullName": "Jane Doe",
      "phone": "0771234567",
      "gender": "FEMALE",
      "location": "Kampala",
      "role": "CLIENT",
      "profilePictureUrl": "https://...",
      "active": true
    }
  ]
}
```

### Updated response fields

The event response now includes two new fields:

```json
{
  "id": 1,
  "type": "EVENT",
  "title": "Mental Health Awareness Walk",
  "attendeeCount": 24,
  "resourceType": null,
  ...
}
```

- `attendeeCount` (Long, null for non-events) — number of users who RSVP'd
- `resourceType` (String, null for non-resources) — `ARTICLE`, `DOCUMENT`, `VIDEO`, `CONTACT`, `EXTERNAL_LINK`

---

## Changes to `api.js`

Add the attendees endpoint:

```javascript
// Events
export const getEventAttendees = (eventId) => get(`/admin/events/${eventId}/attendees`)
```

---

## Changes to `ContentPage.jsx`

### 1. Show attendee count on EventCard

The `attendeeCount` field is now returned in the event response. Display it on the event card.

In `EventCard`, add the attendee count badge in the footer section (next to location):

```jsx
{/* Add after the location span, before ActivePill */}
{item.attendeeCount != null && (
  <button
    onClick={(e) => { e.stopPropagation(); onViewAttendees(item) }}
    className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
    style={{ background: '#ede9fe', color: '#7c3aed' }}>
    <Users size={10} />
    {item.attendeeCount} {item.attendeeCount === 1 ? 'attendee' : 'attendees'}
  </button>
)}
```

Add `Users` to the lucide-react imports at the top of the file.

Add `onViewAttendees` to EventCard's props (alongside `onEdit`, `onDelete`, `onToggle`).

### 2. Attendees modal

Add a new modal to show the attendees list. When the admin clicks the attendee count badge:

```jsx
const [attendeesEvent, setAttendeesEvent] = useState(null)
const { data: attendees, loading: loadingAttendees } = useQuery(
  () => attendeesEvent ? api.getEventAttendees(attendeesEvent.id) : null,
  [attendeesEvent?.id]
)
```

Modal content:

```jsx
<Modal open={!!attendeesEvent} onClose={() => setAttendeesEvent(null)}
  title={`Attendees — ${attendeesEvent?.title || ''}`}>
  {loadingAttendees ? <Spinner center /> :
    !attendees?.length ? <Empty message="No one has RSVP'd to this event yet" /> : (
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {attendees.map(user => (
          <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: '#f9fafb' }}>
            <Avatar src={user.profilePictureUrl} name={user.fullName} size={36} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: colors.dark }}>{user.fullName}</p>
              <p className="text-xs truncate" style={{ color: colors.muted }}>{user.email}</p>
            </div>
            {user.phone && (
              <span className="text-xs" style={{ color: colors.muted }}>{user.phone}</span>
            )}
          </div>
        ))}
      </div>
    )
  }
  <div className="flex justify-end pt-4">
    <Btn variant="secondary" onClick={() => setAttendeesEvent(null)}>Close</Btn>
  </div>
</Modal>
```

Add `Avatar` to the shared components import.

### 3. Pass `onViewAttendees` to EventCard

In `renderCard`, update the EventCard case:

```jsx
case 'EVENT': return <EventCard key={item.id} {...props} onViewAttendees={setAttendeesEvent} />
```

### 4. Remove External Link from event form

In the event form section (`form.type === 'EVENT'`), remove the External Link input. Users RSVP directly in the app — there's no external registration link.

**Before:**
```jsx
{form.type === 'EVENT' && (
  <>
    <Input label="Event Date" type="date" ... />
    <Input label="Location" ... />
    <Input label="External Link" ... />   {/* ← Remove this */}
  </>
)}
```

**After:**
```jsx
{form.type === 'EVENT' && (
  <>
    <Input label="Event Date" type="date" ... />
    <Input label="Location" ... />
  </>
)}
```

### 5. Remove "Join" external link from EventCard footer

In `EventCard`, remove the external link "Join" anchor:

```jsx
{/* Remove this block from EventCard footer */}
{item.externalLink && (
  <a href={item.externalLink} target="_blank" rel="noreferrer" ...>
    <Globe size={11} /> Join
  </a>
)}
```

### 6. Add Resource Type to resource form (bonus)

Resources now support a `resourceType` field. Add a dropdown in the RESOURCE form section:

```jsx
{form.type === 'RESOURCE' && (
  <>
    <Input label="Author" ... />
    <Select label="Category" ... />
    <Select label="Resource Type" value={form.resourceType || ''}
      onChange={e => setForm(f => ({ ...f, resourceType: e.target.value }))}>
      <option value="">— Select type —</option>
      <option value="ARTICLE">Article</option>
      <option value="DOCUMENT">Document</option>
      <option value="VIDEO">Video</option>
      <option value="CONTACT">Contact</option>
      <option value="EXTERNAL_LINK">External Link</option>
    </Select>
    <Input label="External Link" ... />
  </>
)}
```

Also update `BLANK` to include `resourceType: ''` and `openEdit` to read `item.resourceType || ''`.

---

## Summary of UI changes

| Area | Change |
|------|--------|
| EventCard footer | Add attendee count badge (clickable) |
| EventCard footer | Remove "Join" external link |
| Event form | Remove External Link field |
| Content page | Add attendees list modal |
| Resource form | Add Resource Type dropdown |
| BLANK constant | Add `resourceType: ''` |
| api.js | Add `getEventAttendees()` |
| Imports | Add `Users` from lucide-react, `Avatar` from shared components |
