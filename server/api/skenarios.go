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

type Skenario struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Operasi   Operasi   `json:"operasi"`
	CenterX   float64   `json:"center_x"`
	CenterY   float64   `json:"center_y"`
	Zoom      float64   `json:"zoom"`
	MaxZoom   float64   `json:"max_zoom"`
	Pitch     float64   `json:"pitch"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type skenarioListResponse struct {
	Code    int        `json:"code"`
	Message string     `json:"message"`
	Data    []Skenario `json:"data"`
}

type skenarioSingleResponse struct {
	Code    int      `json:"code"`
	Message string   `json:"message"`
	Data    Skenario `json:"data"`
}

type skenarioRequest struct {
	Name      string  `json:"name" binding:"required"`
	OperasiId string  `json:"operasi_id" binding:"required"`
	CenterX   float64 `json:"center_x" binding:"required"`
	CenterY   float64 `json:"center_y" binding:"required"`
	Zoom      float64 `json:"zoom" binding:"required"`
	MaxZoom   float64 `json:"max_zoom" binding:"required"`
	Pitch     float64 `json:"pitch"`
}

type skenarioUpdateRequest struct {
	CenterX float64 `json:"center_x" binding:"required"`
	CenterY float64 `json:"center_y" binding:"required"`
	Zoom    float64 `json:"zoom" binding:"required"`
	Pitch   float64 `json:"pitch"`
}

func (server *Server) listSkenarios(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	operasiIdParam := ctx.Param("operasi_id")

	operasiId, err := uuid.Parse(operasiIdParam)
	if err != nil {
		log.Error().Err(err).Msg("listSkenarios")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	operasiPgtypeUuid, err := db.ToUuid(operasiIdParam)

	if err != nil {
		log.Error().Err(err).Msg("listSkenarios")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	rowOperasi, err := server.store.GetOperasis(ctx, operasiId)

	if err != nil {
		log.Error().Err(err).Msg("listSkenarios")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	rows, err := server.store.ListSkenariosByOperasi(ctx, operasiPgtypeUuid)

	if err != nil {
		log.Error().Err(err).Msg("allOperasis")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	operasi := Operasi{
		ID:        rowOperasi.ID,
		Name:      rowOperasi.Name.String,
		CreatedAt: utils.ToWitaTimezone(rowOperasi.CreatedAt.Time),
		UpdatedAt: utils.ToWitaTimezone(rowOperasi.UpdatedAt.Time),
	}

	var datas []Skenario

	for _, row := range rows {
		datas = append(datas, Skenario{
			ID:        row.ID,
			Name:      row.Name.String,
			Operasi:   operasi,
			CenterX:   row.CenterX.Float64,
			CenterY:   row.CenterY.Float64,
			Zoom:      row.Zoom.Float64,
			MaxZoom:   row.MaxZoom.Float64,
			Pitch:     row.Pitch.Float64,
			CreatedAt: utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt: utils.ToWitaTimezone(row.UpdatedAt.Time),
		})
	}

	resp := skenarioListResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data:    datas,
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) getSkenarios(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("getSkenarios")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	row, err := server.store.GetSkenarios(ctx, id)

	if err != nil {
		log.Error().Err(err).Msg("getSkenarios")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	operasi, err := server.getRowOperasi(ctx, row.OperasiID.String())
	if err != nil {
		log.Error().Err(err).Msg("updateSkenarios")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}
	resp := skenarioSingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: Skenario{
			ID:        row.ID,
			Name:      row.Name.String,
			Operasi:   operasi,
			CenterX:   row.CenterX.Float64,
			CenterY:   row.CenterY.Float64,
			Zoom:      row.Zoom.Float64,
			MaxZoom:   row.MaxZoom.Float64,
			Pitch:     row.Pitch.Float64,
			CreatedAt: utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt: utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) createSkenarios(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req skenarioRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("createSkenarios")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	operasiIdPgTypeUuid, err := db.ToUuid(req.OperasiId)
	if err != nil {
		log.Error().Err(err).Msg("createSkenarios")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	row, err := server.store.CreateSkenario(ctx, db.CreateSkenarioParams{
		Name:      db.ToText(req.Name),
		OperasiID: operasiIdPgTypeUuid,
		CenterX:   db.ToFloat8(req.CenterX),
		CenterY:   db.ToFloat8(req.CenterY),
		Zoom:      db.ToFloat8(req.Zoom),
		MaxZoom:   db.ToFloat8(req.MaxZoom),
		Pitch:     db.ToFloat8(req.Pitch),
	})

	if err != nil {
		log.Error().Err(err).Msg("createSkenarios")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	operasi, err := server.getRowOperasi(ctx, row.OperasiID.String())
	if err != nil {
		log.Error().Err(err).Msg("updateSkenarios")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	resp := skenarioSingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: Skenario{
			ID:        row.ID,
			Name:      row.Name.String,
			Operasi:   operasi,
			CenterX:   row.CenterX.Float64,
			CenterY:   row.CenterY.Float64,
			Zoom:      row.Zoom.Float64,
			MaxZoom:   row.MaxZoom.Float64,
			Pitch:     row.Pitch.Float64,
			CreatedAt: utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt: utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusCreated, resp)

}

func (server *Server) updateSkenarios(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req skenarioUpdateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("updateSkenarios")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("updateSkenarios")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	row, err := server.store.UpdateSkenario(ctx, db.UpdateSkenarioParams{
		ID:      id,
		CenterX: db.ToFloat8(req.CenterX),
		CenterY: db.ToFloat8(req.CenterY),
		Zoom:    db.ToFloat8(req.Zoom),
		Pitch:   db.ToFloat8(req.Pitch),
	})

	if err != nil {
		log.Error().Err(err).Msg("updateSkenarios")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	operasi, err := server.getRowOperasi(ctx, row.OperasiID.String())
	if err != nil {
		log.Error().Err(err).Msg("updateSkenarios")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	resp := skenarioSingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: Skenario{
			ID:        row.ID,
			Name:      row.Name.String,
			Operasi:   operasi,
			CenterX:   row.CenterX.Float64,
			CenterY:   row.CenterY.Float64,
			Zoom:      row.Zoom.Float64,
			MaxZoom:   row.MaxZoom.Float64,
			Pitch:     row.Pitch.Float64,
			CreatedAt: utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt: utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) deleteSkenarios(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("deleteSkenarios")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	err = server.store.DeleteSkenarios(ctx, id)

	if err != nil {
		log.Error().Err(err).Msg("deleteSkenarios")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, successResponse())

}

func (server *Server) getRowOperasi(ctx *gin.Context, id string) (Operasi, error) {
	operasiId, err := uuid.Parse(id)
	if err != nil {
		return Operasi{}, err
	}

	rowOperasi, err := server.store.GetOperasis(ctx, operasiId)
	if err != nil {
		return Operasi{}, err
	}

	operasi := Operasi{
		ID:        rowOperasi.ID,
		Name:      rowOperasi.Name.String,
		CreatedAt: utils.ToWitaTimezone(rowOperasi.CreatedAt.Time),
		UpdatedAt: utils.ToWitaTimezone(rowOperasi.UpdatedAt.Time),
	}

	return operasi, nil
}
