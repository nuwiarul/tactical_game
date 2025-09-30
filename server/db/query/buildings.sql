-- name: CreateBuilding :one
INSERT INTO buildings (name, operasi_id, skenario_id, keterangan, color, geom, height)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: ListBuildingsBySkenario :many
SELECT
    id, name, operasi_id, skenario_id, keterangan, color, geom, height,  created_at, updated_at
FROM
    buildings
WHERE skenario_id = sqlc.arg(skenario_id)
ORDER BY created_at DESC;

-- name: UpdateBuilding :one
UPDATE buildings
SET
    name = sqlc.arg(name),
    keterangan = sqlc.arg(keterangan),
    color = sqlc.arg(color),
    height = sqlc.arg(height),
    updated_at = NOW()
WHERE
    id = sqlc.arg(id)
RETURNING *;

-- name: DeleteBuilding :exec
DELETE FROM buildings
WHERE id=sqlc.arg(id)
;