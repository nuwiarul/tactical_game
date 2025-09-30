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

type Building struct {
	ID         uuid.UUID `json:"id"`
	Name       string    `json:"name"`
	Operasi    Operasi   `json:"operasi"`
	Skenario   Skenario  `json:"skenario"`
	Keterangan string    `json:"keterangan"`
	Color      string    `json:"color"`
	Geom       string    `json:"geom"`
	Height     int32     `json:"height"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type buildingListResponse struct {
	Code    int        `json:"code"`
	Message string     `json:"message"`
	Data    []Building `json:"data"`
}

type buildingSingleResponse struct {
	Code    int      `json:"code"`
	Message string   `json:"message"`
	Data    Building `json:"data"`
}

type buildingRequest struct {
	Name       string `json:"name" binding:"required"`
	OperasiId  string `json:"operasi_id" binding:"required"`
	SkenarioId string `json:"skenario_id" binding:"required"`
	Color      string `json:"color" binding:"required"`
	Geom       string `json:"geom" binding:"required"`
	Height     int32  `json:"height" binding:"required"`
	Keterangan string `json:"keterangan"`
}

type buildingUpdateRequest struct {
	Name       string `json:"name" binding:"required"`
	Color      string `json:"color" binding:"required"`
	Keterangan string `json:"keterangan"`
	Height     int32  `json:"height" binding:"required"`
}

func (server *Server) createBuildings(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req buildingRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("createBuildings")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	operasiPgTypeUuid, skenarioPgTypeUuid, err := server.pgTypeOperasiSkenario(req.OperasiId, req.SkenarioId)
	if err != nil {
		log.Error().Err(err).Msg("createBuildings")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	row, err := server.store.CreateBuilding(ctx, db.CreateBuildingParams{
		Name:       db.ToText(req.Name),
		OperasiID:  operasiPgTypeUuid,
		SkenarioID: skenarioPgTypeUuid,
		Keterangan: db.ToText(req.Keterangan),
		Color:      db.ToText(req.Color),
		Geom:       db.ToText(req.Geom),
		Height:     db.ToInt4(req.Height),
	})

	if err != nil {
		log.Error().Err(err).Msg("createBuildings")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	skenario, err := server.getRowSkenario(ctx, row.SkenarioID.String())
	if err != nil {
		log.Error().Err(err).Msg("createBuildings")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	resp := buildingSingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: Building{
			ID:         row.ID,
			Name:       row.Name.String,
			Operasi:    skenario.Operasi,
			Skenario:   skenario,
			Keterangan: row.Keterangan.String,
			Color:      row.Color.String,
			Geom:       row.Geom.String,
			Height:     row.Height.Int32,
			CreatedAt:  utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt:  utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusCreated, resp)

}

func (server *Server) listBuildings(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	skenarioIdParam := ctx.Param("skenario_id")

	skenarioPgTypeUuid, err := db.ToUuid(skenarioIdParam)

	rows, err := server.store.ListBuildingsBySkenario(ctx, skenarioPgTypeUuid)

	if err != nil {
		log.Error().Err(err).Msg("listBuildings")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	skenario, err := server.getRowSkenario(ctx, skenarioIdParam)

	if err != nil {
		log.Error().Err(err).Msg("listBuildings")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	var datas []Building

	for _, row := range rows {
		datas = append(datas, Building{
			ID:         row.ID,
			Name:       row.Name.String,
			Operasi:    skenario.Operasi,
			Skenario:   skenario,
			Color:      row.Color.String,
			Height:     row.Height.Int32,
			Keterangan: row.Keterangan.String,
			Geom:       row.Geom.String,
			CreatedAt:  utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt:  utils.ToWitaTimezone(row.UpdatedAt.Time),
		})
	}

	resp := buildingListResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data:    datas,
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) updateBuilding(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req buildingUpdateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("updateBuilding")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("updateBuilding")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	row, err := server.store.UpdateBuilding(ctx, db.UpdateBuildingParams{
		ID:         id,
		Name:       db.ToText(req.Name),
		Keterangan: db.ToText(req.Keterangan),
		Color:      db.ToText(req.Color),
		Height:     db.ToInt4(req.Height),
	})

	if err != nil {
		log.Error().Err(err).Msg("updateBuilding")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	skenario, err := server.getRowSkenario(ctx, row.SkenarioID.String())
	if err != nil {
		log.Error().Err(err).Msg("updateBuilding")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	resp := buildingSingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: Building{
			ID:         row.ID,
			Name:       row.Name.String,
			Operasi:    skenario.Operasi,
			Skenario:   skenario,
			Keterangan: row.Keterangan.String,
			Color:      row.Color.String,
			Geom:       row.Geom.String,
			Height:     row.Height.Int32,
			CreatedAt:  utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt:  utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) deleteBuildings(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("deleteBuildings")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	err = server.store.DeleteBuilding(ctx, id)

	if err != nil {
		log.Error().Err(err).Msg("deleteBuildings")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, successResponse())

}
