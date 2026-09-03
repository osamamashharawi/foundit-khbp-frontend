# API reference

Base URL locally: `http://localhost:5000/api`. Hosted base URL is not yet available. Send `Content-Type: application/json`. Protected endpoints require `Authorization: Bearer <token>`.

## Endpoint table

| Method | Path | Access | Request / result |
| --- | --- | --- | --- |
| GET | `/health` | Public | Database connectivity check; 200 `{status,database}` |
| POST | `/auth/register` | Public | `{name,email,phone?,password}`; 201 `{token,user}` |
| POST | `/auth/login` | Public | `{email,password}`; 200 `{token,user}` |
| GET | `/auth/me` | Login | Current `{id,name,email,phone,role}` |
| PUT | `/auth/me` | Login | `{name,phone}`; updated profile. Email/role cannot be changed here. |
| POST | `/auth/logout` | Login | Revokes this user's issued tokens; 200 `{message}` |
| GET | `/items?q=&category=&page=1` | Public | Found records only; `{items,total,page,pages}`, 12 per page |
| GET | `/items/mine` | Login | Array of own reports |
| GET | `/items/:id` | Public found / private lost | Item object; lost requires owner or employee |
| POST | `/items` | Login | Item payload below; 201 item. Found kind requires employee. |
| PUT | `/items/:id` | Employee or owner of Lost report | Full editable item payload; 200 updated item. Kind/status/owner cannot be changed. |
| DELETE | `/items/:id` | Employee or owner of Lost report | 200 `{message}`; employee deletion also deletes associated claims |
| GET | `/claims` | Login | Own claims; employees see all claims with title/location/claimant name |
| POST | `/claims` | Customer | `{item_id,proof}`; 201 claim. Found items with status Found only. |
| PATCH | `/claims/:id` | Employee | `{status,review_note?}`; 200 updated claim |
| GET | `/admin/summary` | Employee | `{total,lost,found,returned,pending}`; PostgreSQL counts can be strings |
| GET | `/admin/items` | Employee | All items |
| PATCH | `/admin/items/:id/status` | Employee | `{status}`; lost reports advance Lost → Found → Matched → Returned |
| GET | `/admin/users` | Employee | Public account fields and active state; no password hashes |
| PATCH | `/admin/users/:id` | Employee | `{active:true/false}`; customer accounts only; revokes old sessions |
| GET | `/weather` | Public | `{temperature,precipitation,time,source,source_url}`; Amman forecast cached 15 minutes |

## Registration and login example

```http
POST /api/auth/register
Content-Type: application/json

{"name":"Sample Customer","email":"sample@example.test","phone":"","password":"UseYourOwnPassword123!"}
```

A successful response is shaped like this (the token is not a real credential):

```json
{"token":"<issued-JWT>","user":{"id":1,"name":"Sample Customer","email":"sample@example.test","phone":"","role":"customer"}}
```

Name: 2–80 characters. Email: normalized to lowercase, valid format, unique, maximum 254 characters. Phone: optional, maximum 25 characters. Password: minimum 8 characters, maximum 72 UTF-8 bytes. Public callers cannot choose an employee role.

## Item payload

```json
{
  "title":"Black backpack",
  "description":"A black backpack with a front pocket.",
  "category":"Bags",
  "kind":"lost",
  "event_date":"2026-08-30",
  "location":"Sweileh station",
  "route":"BRT",
  "image_data":null
}
```

Title: 3–100 characters; description: 10–2000; location: 2–160; route: optional, up to 60. Category: Electronics, Bags, Wallets, Keys, Documents, Clothing or Other. Date must be valid and not future. The server assigns owner and initial status. An optional image is a base64 data URL for a verified PNG/JPEG/WebP file, maximum 1 MB.

A returned item contains the payload fields plus `id`, `status`, `is_sample`, `created_at`, and `updated_at`. Owner IDs are excluded from public found-item responses. Authenticated owner/admin views may include `owner_id`. Send the full editable payload for PUT.

## Claim payload and state changes

```json
{"item_id":1,"proof":"My bag contains a blue notebook with my initials on the first page."}
```

Proof must be 15–2000 characters. Each customer can submit only one claim per item; rejected claims cannot be resubmitted in this version. Claim responses include `id`, `item_id`, `user_id`, `proof`, `status`, `review_note`, `reviewed_by`, `created_at` and `updated_at`.

A Pending claim may become Approved or Rejected. An Approved claim may become Returned. Other transitions return 409. Approving sets the item to Matched and rejects other Pending claims. Confirming collection sets both winning claim and item to Returned. Employees should put collection instructions in the review note (up to 1000 characters). Found-item statuses are changed through this workflow, not a free-form dropdown.

## Errors

Errors use `{"message":"Readable explanation"}`.

| Code | Meaning |
| --- | --- |
| 400 | Invalid field, date, ID or image |
| 401 | Missing, expired or revoked session, or incorrect login |
| 403 | Wrong role/owner, disallowed origin, or report no longer editable |
| 404 | Missing item/claim/endpoint |
| 409 | Duplicate email/claim or invalid state transition |
| 413 | Request exceeds 2 MB JSON limit |
| 429 | Rate limit reached |
| 500 | Unexpected server/database failure; details are not exposed |
| 503 | Weather provider temporarily unavailable |

Item edit/delete return a generic 403 if the record is unavailable or not permitted. This avoids identifying other users' private reports.
