-- name: CreateSkenario :one
INSERT INTO skenarios (name, operasi_id, center_x, center_y, zoom, max_zoom, pitch)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: UpdateSkenario :one
UPDATE skenarios
SET
    center_x = sqlc.arg(center_x),
    center_y = sqlc.arg(center_y),
    zoom = sqlc.arg(zoom),
    pitch = sqlc.arg(pitch),
    updated_at = NOW()
WHERE
    id = sqlc.arg(id)
RETURNING *;


-- name: ListSkenariosByOperasi :many
SELECT
    id, name, operasi_id, center_x, center_y, zoom, max_zoom, pitch, created_at, updated_at
FROM
    skenarios
WHERE operasi_id = sqlc.arg(operasi_id)
ORDER BY created_at ASC;

-- name: GetSkenarios :one
SELECT
    id, name, operasi_id, center_x, center_y, zoom, max_zoom, pitch, created_at, updated_at
FROM
    skenarios
WHERE id=sqlc.arg(id)
LIMIT 1
;

-- name: DeleteSkenarios :exec
DELETE FROM skenarios
WHERE id=sqlc.arg(id)
;