package api

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	db "github.com/nuwiarul/twgdev/db/sqlc"
)

func (server *Server) convertPageSizeAndNumber(pageSize, pageNumber string) (int, int, error) {
	size, err := strconv.Atoi(pageSize)
	if err != nil {
		return 0, 0, err
	}

	number, err := strconv.Atoi(pageNumber)
	if err != nil {
		return 0, 0, err
	}

	return size, number, nil
}

func (server *Server) getPageSizeAndNumber(ctx *gin.Context) (int, int, error) {

	pageSize, pageNumber, err := server.convertPageSizeAndNumber(ctx.Query("pageSize"), ctx.Query("pageNumber"))

	if err != nil {
		return 0, 1, err
	}

	return pageSize, (pageNumber - 1) * pageSize, nil

}

func (server *Server) pgTypeOperasiSkenarioUnit(operasiId, skenarioId, unitId string) (pgtype.UUID, pgtype.UUID, pgtype.UUID, error) {
	operasiUUID, err := db.ToUuid(operasiId)
	if err != nil {
		return pgtype.UUID{}, pgtype.UUID{}, pgtype.UUID{}, err
	}

	skenarioUUID, err := db.ToUuid(skenarioId)
	if err != nil {
		return pgtype.UUID{}, pgtype.UUID{}, pgtype.UUID{}, err
	}

	unitUUID, err := db.ToUuid(unitId)
	if err != nil {
		return pgtype.UUID{}, pgtype.UUID{}, pgtype.UUID{}, err
	}

	return operasiUUID, skenarioUUID, unitUUID, nil
}

func (server *Server) uuidOperasiSkenarioUnit(operasiId, skenarioId, unitId string) (uuid.UUID, uuid.UUID, uuid.UUID, error) {
	operasiUUID, err := uuid.Parse(operasiId)
	if err != nil {
		return uuid.UUID{}, uuid.UUID{}, uuid.UUID{}, err
	}

	skenarioUUID, err := uuid.Parse(skenarioId)
	if err != nil {
		return uuid.UUID{}, uuid.UUID{}, uuid.UUID{}, err
	}

	unitUUID, err := uuid.Parse(unitId)
	if err != nil {
		return uuid.UUID{}, uuid.UUID{}, uuid.UUID{}, err
	}

	return operasiUUID, skenarioUUID, unitUUID, nil
}
