-- name: CreateUser :one
INSERT INTO users (name, username, password, role, profile_img, units)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: SelectUsers :one
SELECT
    id, name, username, password, role, profile_img, units, created_at, updated_at
FROM
    users
WHERE username=sqlc.arg(username)
LIMIT 1
;

-- name: ListUsers :many
SELECT
    id, name, username, password, role, profile_img, units, created_at, updated_at
FROM
    users
WHERE role!='admin'
;

-- name: GetUser :one
SELECT
    id, name, username, password, role, profile_img, units, created_at, updated_at
FROM
    users
WHERE id=$1
;

-- name: UpdateUserUnit :one
UPDATE users
SET
    name = sqlc.arg(name),
    units = sqlc.arg(units),
    updated_at = NOW()
WHERE
    id = sqlc.arg(id)
RETURNING *;

-- name: DeleteUsers :exec
DELETE FROM users
WHERE id=sqlc.arg(id)
;