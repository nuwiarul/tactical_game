-- name: CreateLastMap :one
INSERT INTO last_maps (operasi_id, skenario_id, center_x, center_y, zoom, pitch, bearing)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: ListLastMapsBySkenario :many
SELECT
    id, operasi_id, skenario_id, center_x, center_y, zoom, pitch, bearing,  created_at, updated_at
FROM
    last_maps
WHERE skenario_id = sqlc.arg(skenario_id)
ORDER BY created_at DESC;

-- name: UpdateLastMaps :one
UPDATE last_maps
SET
    center_x = sqlc.arg(center_x),
    center_y = sqlc.arg(center_y),
    zoom = sqlc.arg(zoom),
    pitch = sqlc.arg(pitch),
    bearing = sqlc.arg(bearing),
    updated_at = NOW()
WHERE
    skenario_id = sqlc.arg(skenario_id)
RETURNING *;