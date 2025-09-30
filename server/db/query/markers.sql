-- name: CreateMarker :one
INSERT INTO markers (name, operasi_id, skenario_id, unit_id,  jumlah, rot_x, rot_y, rot_z, pos_x, pos_y, keterangan, kategori)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
RETURNING *;

-- name: ListMarkersBySkenario :many
SELECT
    id, name, operasi_id, skenario_id, unit_id,  jumlah, rot_x, rot_y, rot_z, pos_x, pos_y, keterangan, kategori, scale,  created_at, updated_at
FROM
    markers
WHERE skenario_id = sqlc.arg(skenario_id)
ORDER BY created_at DESC;

-- name: GetMarker :one
SELECT
    id, name, operasi_id, skenario_id, unit_id,  jumlah, rot_x, rot_y, rot_z, pos_x, pos_y, keterangan, kategori, scale,  created_at, updated_at
FROM
    markers
WHERE id = sqlc.arg(id)
;

-- name: UpdateMarkerGeom :one
UPDATE markers
SET
    pos_x = sqlc.arg(pos_x),
    pos_y = sqlc.arg(pos_y),
    rot_x = sqlc.arg(rot_x),
    rot_y = sqlc.arg(rot_y),
    rot_z = sqlc.arg(rot_z),
    updated_at = NOW()
WHERE
    id = sqlc.arg(id)
RETURNING *;

-- name: UpdateMarkerName :one
UPDATE markers
SET
    name = sqlc.arg(name),
    jumlah = sqlc.arg(jumlah),
    keterangan = sqlc.arg(keterangan),
    updated_at = NOW()
WHERE
    id = sqlc.arg(id)
RETURNING *;

-- name: UpdateMarkerScale :one
UPDATE markers
SET
    scale = sqlc.arg(scale),
    updated_at = NOW()
WHERE
    id = sqlc.arg(id)
RETURNING *;

-- name: UpdateMarkerRotasi :one
UPDATE markers
SET
    rot_z = sqlc.arg(rotasi),
    updated_at = NOW()
WHERE
    id = sqlc.arg(id)
RETURNING *;

-- name: DeleteMarkers :exec
DELETE FROM markers
WHERE id=sqlc.arg(id)
;