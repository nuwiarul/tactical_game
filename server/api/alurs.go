package api

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	db "github.com/nuwiarul/twgdev/db/sqlc"
	"github.com/nuwiarul/twgdev/utils"
	"github.com/rs/zerolog/log"
)

type Alur struct {
	ID        uuid.UUID `json:"id"`
	Operasi   Operasi   `json:"operasi"`
	Skenario  Skenario  `json:"skenario"`
	Alur      string    `json:"alur"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type alurListResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    []Alur `json:"data"`
}

type alurSingleResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    Alur   `json:"data"`
}

type alurCreateRequest struct {
	OperasiId  string `json:"operasi_id" binding:"required"`
	SkenarioId string `json:"skenario_id" binding:"required"`
	Alur       string `json:"alur" binding:"required"`
}

type alurUpdateRequest struct {
	Alur string `json:"alur" binding:"required"`
}

func (server *Server) createAlurs(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req alurCreateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("createAlurs")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	operasiPgTypeUuid, skenarioPgTypeUuid, err := server.pgTypeOperasiSkenario(req.OperasiId, req.SkenarioId)
	if err != nil {
		log.Error().Err(err).Msg("createAlurs")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	row, err := server.store.CreateAlur(ctx, db.CreateAlurParams{
		OperasiID:  operasiPgTypeUuid,
		SkenarioID: skenarioPgTypeUuid,
		Alur:       db.ToText(req.Alur),
	})

	if err != nil {
		log.Error().Err(err).Msg("createAlurs")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	skenario, err := server.getRowSkenario(ctx, row.SkenarioID.String())
	if err != nil {
		log.Error().Err(err).Msg("createAlurs")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	resp := alurSingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: Alur{
			ID:        row.ID,
			Operasi:   skenario.Operasi,
			Skenario:  skenario,
			Alur:      row.Alur.String,
			CreatedAt: utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt: utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusCreated, resp)

}

func (server *Server) listAlurs(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	skenarioIdParam := ctx.Param("skenario_id")

	skenarioPgTypeUuid, err := db.ToUuid(skenarioIdParam)

	rows, err := server.store.ListAlursBySkenario(ctx, skenarioPgTypeUuid)

	if err != nil {
		log.Error().Err(err).Msg("listAlurs")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	skenario, err := server.getRowSkenario(ctx, skenarioIdParam)

	if err != nil {
		log.Error().Err(err).Msg("listAlurs")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	var datas []Alur

	for _, row := range rows {
		datas = append(datas, Alur{
			ID:        row.ID,
			Operasi:   skenario.Operasi,
			Skenario:  skenario,
			Alur:      row.Alur.String,
			CreatedAt: utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt: utils.ToWitaTimezone(row.UpdatedAt.Time),
		})
	}

	resp := alurListResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data:    datas,
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) updateAlur(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req alurUpdateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("updateAlur")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("updateAlur")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	row, err := server.store.UpdateAlur(ctx, db.UpdateAlurParams{
		ID:   id,
		Alur: db.ToText(req.Alur),
	})

	if err != nil {
		log.Error().Err(err).Msg("updateAlur")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	skenario, err := server.getRowSkenario(ctx, row.SkenarioID.String())
	if err != nil {
		log.Error().Err(err).Msg("updateAlur")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	resp := alurSingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: Alur{
			ID:        row.ID,
			Operasi:   skenario.Operasi,
			Skenario:  skenario,
			Alur:      row.Alur.String,
			CreatedAt: utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt: utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) deleteAlurs(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("deleteAlurs")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	err = server.store.DeleteAlur(ctx, id)

	if err != nil {
		log.Error().Err(err).Msg("deleteAlurs")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, successResponse())

}
