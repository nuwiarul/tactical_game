-- name: CreateLastPosition :one
INSERT INTO last_positions (operasi_id, skenario_id, marker_id, rot_x, rot_y, rot_z, pos_x, pos_y)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;

-- name: ListLastPositonsBySkenario :many
SELECT
    id, operasi_id, skenario_id, marker_id, rot_x, rot_y, rot_z, pos_x, pos_y,  created_at, updated_at
FROM
    last_positions
WHERE skenario_id = sqlc.arg(skenario_id)
ORDER BY created_at ASC;

-- name: ListLastPositonsByMarkerId :many
SELECT
    id, operasi_id, skenario_id, marker_id, rot_x, rot_y, rot_z, pos_x, pos_y,  created_at, updated_at
FROM
    last_positions
WHERE marker_id = sqlc.arg(marker_id)
ORDER BY created_at DESC;

-- name: UpdateLastPositionMove :one
UPDATE last_positions
SET
    pos_x = sqlc.arg(pos_x),
    pos_y = sqlc.arg(pos_y),
    updated_at = NOW()
WHERE
    marker_id = sqlc.arg(marker_id)
RETURNING *;

-- name: UpdateLastPositionRot :one
UPDATE last_positions
SET
    rot_x = sqlc.arg(rot_x),
    rot_y = sqlc.arg(rot_y),
    rot_z = sqlc.arg(rot_z),
    updated_at = NOW()
WHERE
    marker_id = sqlc.arg(marker_id)
RETURNING *;