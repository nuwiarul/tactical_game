-- name: CreateCommand :one
INSERT INTO commands (operasi_id, skenario_id, marker_id,  command, data)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: ListCommandsBySkenario :many
SELECT
    id, operasi_id, skenario_id, marker_id,  command, data,  created_at, updated_at
FROM
    commands
WHERE skenario_id = sqlc.arg(skenario_id)
ORDER BY id ASC;