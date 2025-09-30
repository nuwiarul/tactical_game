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

type Marker struct {
	ID         uuid.UUID `json:"id"`
	Name       string    `json:"name"`
	Operasi    Operasi   `json:"operasi"`
	Skenario   Skenario  `json:"skenario"`
	UnitId     string    `json:"unit_id"`
	Kategori   string    `json:"kategori"`
	Jumlah     int32     `json:"jumlah"`
	RotX       float64   `json:"rot_x"`
	RotY       float64   `json:"rot_y"`
	RotZ       float64   `json:"rot_z"`
	PosX       float64   `json:"pos_x"`
	PosY       float64   `json:"pos_y"`
	Scale      float64   `json:"scale"`
	Keterangan string    `json:"keterangan"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type markerListResponse struct {
	Code    int      `json:"code"`
	Message string   `json:"message"`
	Data    []Marker `json:"data"`
}

type markerSingleResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    Marker `json:"data"`
}

type markerRequest struct {
	Name       string  `json:"name" binding:"required"`
	OperasiId  string  `json:"operasi_id" binding:"required"`
	SkenarioId string  `json:"skenario_id" binding:"required"`
	UnitId     string  `json:"unit_id" binding:"required"`
	Kategori   string  `json:"kategori"`
	RotX       float64 `json:"rot_x"`
	RotY       float64 `json:"rot_y"`
	RotZ       float64 `json:"rot_z"`
	PosX       float64 `json:"pos_x" binding:"required"`
	PosY       float64 `json:"pos_y" binding:"required"`
	Jumlah     int32   `json:"jumlah" binding:"required"`
	Keterangan string  `json:"keterangan"`
}

type markerGeomRequest struct {
	RotX float64 `json:"rot_x"`
	RotY float64 `json:"rot_y"`
	RotZ float64 `json:"rot_z"`
	PosX float64 `json:"pos_x" binding:"required"`
	PosY float64 `json:"pos_y" binding:"required"`
}

type markerKetRequest struct {
	Name       string `json:"name" binding:"required"`
	Jumlah     int32  `json:"jumlah" binding:"required"`
	Keterangan string `json:"keterangan"`
}

type markerScaleRequest struct {
	Scale float64 `json:"scale" binding:"required"`
}

type markerRotasiRequest struct {
	Rotasi float64 `json:"rotasi"`
}

func (server *Server) createMarkers(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req markerRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("createMarkers")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	operasiPgTypeUuid, skenarioPgTypeUuid, unitPgTypeUuid, err := server.pgTypeOperasiSkenarioUnit(req.OperasiId, req.SkenarioId, req.UnitId)
	if err != nil {
		log.Error().Err(err).Msg("createMarkers")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	row, err := server.store.CreateMarker(ctx, db.CreateMarkerParams{
		Name:       db.ToText(req.Name),
		OperasiID:  operasiPgTypeUuid,
		SkenarioID: skenarioPgTypeUuid,
		UnitID:     unitPgTypeUuid,
		RotX:       db.ToFloat8(req.RotX),
		RotY:       db.ToFloat8(req.RotY),
		RotZ:       db.ToFloat8(req.RotZ),
		PosX:       db.ToFloat8(req.PosX),
		PosY:       db.ToFloat8(req.PosY),
		Jumlah:     db.ToInt4(req.Jumlah),
		Keterangan: db.ToText(req.Keterangan),
		Kategori:   db.ToText(req.Kategori),
	})

	if err != nil {
		log.Error().Err(err).Msg("createMarkers")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	skenario, err := server.getRowSkenario(ctx, row.SkenarioID.String())
	if err != nil {
		log.Error().Err(err).Msg("createMarkers")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	resp := markerSingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: Marker{
			ID:         row.ID,
			Name:       row.Name.String,
			Operasi:    skenario.Operasi,
			Skenario:   skenario,
			UnitId:     row.UnitID.String(),
			RotX:       row.RotX.Float64,
			RotY:       row.RotY.Float64,
			RotZ:       row.RotZ.Float64,
			PosX:       row.PosX.Float64,
			PosY:       row.PosY.Float64,
			Jumlah:     row.Jumlah.Int32,
			Keterangan: row.Keterangan.String,
			Kategori:   row.Kategori.String,
			Scale:      row.Scale.Float64,
			CreatedAt:  utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt:  utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusCreated, resp)

}

func (server *Server) listMarkers(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	skenarioIdParam := ctx.Param("skenario_id")

	skenarioPgTypeUuid, err := db.ToUuid(skenarioIdParam)

	rows, err := server.store.ListMarkersBySkenario(ctx, skenarioPgTypeUuid)

	if err != nil {
		log.Error().Err(err).Msg("listMarkers")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	skenario, err := server.getRowSkenario(ctx, skenarioIdParam)

	if err != nil {
		log.Error().Err(err).Msg("listMarkers")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	var datas []Marker

	for _, row := range rows {
		datas = append(datas, Marker{
			ID:         row.ID,
			Name:       row.Name.String,
			Operasi:    skenario.Operasi,
			Skenario:   skenario,
			UnitId:     row.UnitID.String(),
			Kategori:   row.Kategori.String,
			Jumlah:     row.Jumlah.Int32,
			RotX:       row.RotX.Float64,
			RotY:       row.RotY.Float64,
			RotZ:       row.RotZ.Float64,
			PosX:       row.PosX.Float64,
			PosY:       row.PosY.Float64,
			Keterangan: row.Keterangan.String,
			Scale:      row.Scale.Float64,
			CreatedAt:  utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt:  utils.ToWitaTimezone(row.UpdatedAt.Time),
		})
	}

	resp := markerListResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data:    datas,
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) getRowSkenario(ctx *gin.Context, id string) (Skenario, error) {
	skenarioId, err := uuid.Parse(id)
	if err != nil {
		return Skenario{}, err
	}

	rowSkenario, err := server.store.GetSkenarios(ctx, skenarioId)
	if err != nil {
		return Skenario{}, err
	}

	rowOperasi, err := server.getRowOperasi(ctx, rowSkenario.OperasiID.String())

	if err != nil {
		return Skenario{}, err
	}

	operasi := Operasi{
		ID:        rowOperasi.ID,
		Name:      rowOperasi.Name,
		CreatedAt: utils.ToWitaTimezone(rowOperasi.CreatedAt),
		UpdatedAt: utils.ToWitaTimezone(rowOperasi.UpdatedAt),
	}

	skenario := Skenario{
		ID:        rowSkenario.ID,
		Name:      rowSkenario.Name.String,
		Operasi:   operasi,
		CenterX:   rowSkenario.CenterX.Float64,
		CenterY:   rowSkenario.CenterY.Float64,
		Zoom:      rowSkenario.Zoom.Float64,
		MaxZoom:   rowSkenario.MaxZoom.Float64,
		Pitch:     rowSkenario.Pitch.Float64,
		CreatedAt: utils.ToWitaTimezone(rowSkenario.CreatedAt.Time),
		UpdatedAt: utils.ToWitaTimezone(rowSkenario.UpdatedAt.Time),
	}

	return skenario, nil
}

func (server *Server) updateMarkerGeom(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req markerGeomRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("updateMarkerGeom")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("updateMarkerGeom")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	row, err := server.store.UpdateMarkerGeom(ctx, db.UpdateMarkerGeomParams{
		ID:   id,
		RotX: db.ToFloat8(req.RotX),
		RotY: db.ToFloat8(req.RotY),
		RotZ: db.ToFloat8(req.RotZ),
		PosX: db.ToFloat8(req.PosX),
		PosY: db.ToFloat8(req.PosY),
	})

	if err != nil {
		log.Error().Err(err).Msg("updateMarkerGeom")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	skenario, err := server.getRowSkenario(ctx, row.SkenarioID.String())
	if err != nil {
		log.Error().Err(err).Msg("updateMarkerGeom")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	resp := markerSingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: Marker{
			ID:         row.ID,
			Name:       row.Name.String,
			Operasi:    skenario.Operasi,
			Skenario:   skenario,
			UnitId:     row.UnitID.String(),
			RotX:       row.RotX.Float64,
			RotY:       row.RotY.Float64,
			RotZ:       row.RotZ.Float64,
			PosX:       row.PosX.Float64,
			PosY:       row.PosY.Float64,
			Jumlah:     row.Jumlah.Int32,
			Keterangan: row.Keterangan.String,
			Kategori:   row.Kategori.String,
			Scale:      row.Scale.Float64,
			CreatedAt:  utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt:  utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) updateMarkerScale(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req markerScaleRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("updateMarkerScale")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("updateMarkerScale")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	row, err := server.store.UpdateMarkerScale(ctx, db.UpdateMarkerScaleParams{
		ID:    id,
		Scale: db.ToFloat8(req.Scale),
	})

	if err != nil {
		log.Error().Err(err).Msg("updateMarkerScale")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	skenario, err := server.getRowSkenario(ctx, row.SkenarioID.String())
	if err != nil {
		log.Error().Err(err).Msg("updateMarkerScale")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	resp := markerSingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: Marker{
			ID:         row.ID,
			Name:       row.Name.String,
			Operasi:    skenario.Operasi,
			Skenario:   skenario,
			UnitId:     row.UnitID.String(),
			RotX:       row.RotX.Float64,
			RotY:       row.RotY.Float64,
			RotZ:       row.RotZ.Float64,
			PosX:       row.PosX.Float64,
			PosY:       row.PosY.Float64,
			Jumlah:     row.Jumlah.Int32,
			Keterangan: row.Keterangan.String,
			Kategori:   row.Kategori.String,
			Scale:      row.Scale.Float64,
			CreatedAt:  utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt:  utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) updateMarkerRotasi(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req markerRotasiRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("updateMarkerRotasi")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("updateMarkerRotasi")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	row, err := server.store.UpdateMarkerRotasi(ctx, db.UpdateMarkerRotasiParams{
		ID:     id,
		Rotasi: db.ToFloat8(req.Rotasi),
	})

	if err != nil {
		log.Error().Err(err).Msg("updateMarkerRotasi")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	skenario, err := server.getRowSkenario(ctx, row.SkenarioID.String())
	if err != nil {
		log.Error().Err(err).Msg("updateMarkerRotasi")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	resp := markerSingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: Marker{
			ID:         row.ID,
			Name:       row.Name.String,
			Operasi:    skenario.Operasi,
			Skenario:   skenario,
			UnitId:     row.UnitID.String(),
			RotX:       row.RotX.Float64,
			RotY:       row.RotY.Float64,
			RotZ:       row.RotZ.Float64,
			PosX:       row.PosX.Float64,
			PosY:       row.PosY.Float64,
			Jumlah:     row.Jumlah.Int32,
			Keterangan: row.Keterangan.String,
			Kategori:   row.Kategori.String,
			Scale:      row.Scale.Float64,
			CreatedAt:  utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt:  utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) updateMarkerName(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req markerKetRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("updateMarkerName")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("updateMarkerName")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	row, err := server.store.UpdateMarkerName(ctx, db.UpdateMarkerNameParams{
		ID:         id,
		Name:       db.ToText(req.Name),
		Jumlah:     db.ToInt4(req.Jumlah),
		Keterangan: db.ToText(req.Keterangan),
	})

	if err != nil {
		log.Error().Err(err).Msg("updateMarkerName")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	skenario, err := server.getRowSkenario(ctx, row.SkenarioID.String())
	if err != nil {
		log.Error().Err(err).Msg("updateMarkerName")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	resp := markerSingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: Marker{
			ID:         row.ID,
			Name:       row.Name.String,
			Operasi:    skenario.Operasi,
			Skenario:   skenario,
			UnitId:     row.UnitID.String(),
			RotX:       row.RotX.Float64,
			RotY:       row.RotY.Float64,
			RotZ:       row.RotZ.Float64,
			PosX:       row.PosX.Float64,
			PosY:       row.PosY.Float64,
			Jumlah:     row.Jumlah.Int32,
			Keterangan: row.Keterangan.String,
			Kategori:   row.Kategori.String,
			Scale:      row.Scale.Float64,
			CreatedAt:  utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt:  utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) deleteMarkers(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("deleteMarkers")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	err = server.store.DeleteMarkers(ctx, id)

	if err != nil {
		log.Error().Err(err).Msg("deleteMarkers")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, successResponse())

}
