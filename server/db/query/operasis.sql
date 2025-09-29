-- name: CreateOperasi :one
INSERT INTO operasis (name)
VALUES ($1)
RETURNING *;

-- name: UpdateOperasi :one
UPDATE operasis
SET
    name = sqlc.arg(name),
    updated_at = NOW()
WHERE
    id = sqlc.arg(id)
RETURNING *;


-- name: ListOperasis :many
SELECT
    id, name, created_at, updated_at
FROM
    operasis
ORDER BY created_at DESC;

-- name: GetOperasis :one
SELECT
    id, name, created_at, updated_at
FROM
    operasis
WHERE id=sqlc.arg(id)
LIMIT 1
;

-- name: PaginateOperasis :many
SELECT
    id, name,  created_at, updated_at
FROM
    operasis
ORDER BY created_at DESC
LIMIT sqlc.arg(page_size) OFFSET sqlc.arg(page_number)
;

-- name: PaginateSearchOperasis :many
SELECT
    id, name, created_at, updated_at
FROM
    operasis
WHERE name ILIKE '%' || sqlc.arg(name)::text || '%'
ORDER BY
    created_at DESC
LIMIT sqlc.arg(page_size) OFFSET sqlc.arg(page_number)
;

-- name: CountOperasis :one
SELECT count(*)
FROM operasis
LIMIT 1
;

-- name: CountSearchOperasis :one
SELECT count(*)
FROM operasis
WHERE name ILIKE '%' || sqlc.arg(name)::text || '%'
LIMIT 1
;
-- name: DeleteOperasis :exec
DELETE FROM operasis
WHERE id=sqlc.arg(id)
;