-- name: CreateAlur :one
INSERT INTO alurs (operasi_id, skenario_id, alur)
VALUES ($1, $2, $3)
RETURNING *;

-- name: ListAlursBySkenario :many
SELECT
    id, operasi_id, skenario_id, alur,  created_at, updated_at
FROM
    alurs
WHERE skenario_id = sqlc.arg(skenario_id)
ORDER BY created_at ASC;

-- name: UpdateAlur :one
UPDATE alurs
SET
    alur = sqlc.arg(alur),
    updated_at = NOW()
WHERE
    id = sqlc.arg(id)
RETURNING *;

-- name: DeleteAlur :exec
DELETE FROM alurs
WHERE id=sqlc.arg(id)
;