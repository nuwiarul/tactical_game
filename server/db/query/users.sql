-- name: CreateUser :one
INSERT INTO users (name, username, password, role, profile_img)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: SelectUsers :one
SELECT
    id, name, username, password, role, profile_img, created_at, updated_at
FROM
    users
WHERE username=sqlc.arg(username)
LIMIT 1
;