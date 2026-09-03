# Implemented PostgreSQL ERD

```mermaid
erDiagram
    USERS o|--o{ ITEMS : reports
    USERS ||--o{ CLAIMS : submits
    ITEMS ||--o{ CLAIMS : receives
    USERS o|--o{ CLAIMS : reviews
    USERS {
        int id PK
        string name
        string email UK
        string phone
        string password_hash
        string role
        boolean active
        int token_version
        timestamp created_at
    }
    ITEMS {
        int id PK
        int owner_id FK
        string title
        string description
        string category
        string kind
        string status
        date event_date
        string location
        string route
        text image_data
        boolean is_sample
        timestamp created_at
        timestamp updated_at
    }
    CLAIMS {
        int id PK
        int item_id FK
        int user_id FK
        string proof
        string status
        string review_note
        int reviewed_by FK
        timestamp created_at
        timestamp updated_at
    }
```

`items.owner_id` is nullable for seeded records; real reports are assigned the logged-in user. A more precise optionality for sample item ownership is zero-or-one user per item. `claims.reviewed_by` is nullable until review. Claim item/user are required. The database enforces unique email, unique `(item_id,user_id)` and at most one Approved/Returned claim per item. See `db/schema.sql` for exact types, lengths, checks and indexes.
