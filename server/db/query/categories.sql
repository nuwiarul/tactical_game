-- name: CreateCategory :one
INSERT INTO categories (name, icon)
VALUES ($1, $2)
RETURNING *;

-- name: UpdateCategory :one
UPDATE categories
SET
    name = sqlc.arg(name),
    icon = COALESCE(sqlc.narg(icon), icon),
    updated_at = NOW()
WHERE
    id = sqlc.arg(id)
RETURNING *;


-- name: ListCategories :many
SELECT
    id, name, icon, created_at, updated_at
FROM
    categories
ORDER BY created_at DESC;

-- name: GetCategories :one
SELECT
    id, name, icon, created_at, updated_at
FROM
    categories
WHERE id=sqlc.arg(id)
LIMIT 1
;

-- name: PaginateCategories :many
SELECT
    id, name, icon, created_at, updated_at
FROM
    categories
ORDER BY created_at DESC
LIMIT sqlc.arg(page_size) OFFSET sqlc.arg(page_number)
;

-- name: PaginateSearchCategories :many
SELECT
    id, name, icon, created_at, updated_at
FROM
    categories
WHERE name ILIKE '%' || sqlc.arg(name)::text || '%'
ORDER BY
    created_at DESC
LIMIT sqlc.arg(page_size) OFFSET sqlc.arg(page_number)
;

-- name: CountCategories :one
SELECT count(*)
FROM categories
LIMIT 1
;

-- name: CountSearchCategories :one
SELECT count(*)
FROM categories
WHERE name ILIKE '%' || sqlc.arg(name)::text || '%'
LIMIT 1
;
-- name: DeleteCategories :exec
DELETE FROM categories
WHERE id=sqlc.arg(id)
;