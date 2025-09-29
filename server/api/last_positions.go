package api

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	db "github.com/nuwiarul/twgdev/db/sqlc"
	"github.com/rs/zerolog/log"
)

type LastPosition struct {
	ID         uuid.UUID `json:"id"`
	OperasiId  string    `json:"operasi_id"`
	SkenarioId string    `json:"skenario_id"`
	MarkerId   string    `json:"marker_id"`
	RotX       float64   `json:"rot_x"`
	RotY       float64   `json:"rot_y"`
	RotZ       float64   `json:"rot_z"`
	PosX       float64   `json:"pos_x"`
	PosY       float64   `json:"pos_y"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type LastMap struct {
	ID         uuid.UUID `json:"id"`
	OperasiId  string    `json:"operasi_id"`
	SkenarioId string    `json:"skenario_id"`
	CenterX    float64   `json:"center_x"`
	CenterY    float64   `json:"center_y"`
	Zoom       float64   `json:"zoom"`
	Bearing    float64   `json:"bearing"`
	Pitch      float64   `json:"pitch"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type LastPositionMap struct {
	LastMap      LastMap        `json:"last_map"`
	LastPosition []LastPosition `json:"last_position"`
}

type lastPositionSingleResponse struct {
	Code    int             `json:"code"`
	Message string          `json:"message"`
	Data    LastPositionMap `json:"data"`
}

func (server *Server) getLastPosition(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	pgtypeSkenarioId, err := db.ToUuid(ctx.Param("skenario_id"))

	if err != nil {
		log.Error().Err(err).Msg("getLastPosition")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	lastPositions, err := server.store.ListLastPositonsBySkenario(ctx, pgtypeSkenarioId)

	if err != nil {
		log.Error().Err(err).Msg("getLastPosition")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	var dataLastPositions []LastPosition

	for _, lastPosition := range lastPositions {
		dataLastPositions = append(dataLastPositions, LastPosition{
			ID:         lastPosition.ID,
			MarkerId:   lastPosition.MarkerID.String(),
			SkenarioId: lastPosition.SkenarioID.String(),
			OperasiId:  lastPosition.OperasiID.String(),
			RotX:       lastPosition.RotX.Float64,
			RotY:       lastPosition.RotY.Float64,
			RotZ:       lastPosition.RotZ.Float64,
			PosX:       lastPosition.PosX.Float64,
			PosY:       lastPosition.PosY.Float64,
		})
	}

	lastMaps, err := server.store.ListLastMapsBySkenario(ctx, pgtypeSkenarioId)

	if err != nil {
		log.Error().Err(err).Msg("getLastPosition")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	var lastMap LastMap

	if len(lastMaps) > 0 {
		lastMap.ID = lastMaps[0].ID
		lastMap.OperasiId = lastMaps[0].OperasiID.String()
		lastMap.SkenarioId = lastMaps[0].SkenarioID.String()
		lastMap.CenterX = lastMaps[0].CenterX.Float64
		lastMap.CenterY = lastMaps[0].CenterY.Float64
		lastMap.Zoom = lastMaps[0].Zoom.Float64
		lastMap.Bearing = lastMaps[0].Bearing.Float64
		lastMap.Pitch = lastMaps[0].Pitch.Float64
		lastMap.CreatedAt = lastMaps[0].CreatedAt.Time
		lastMap.UpdatedAt = lastMaps[0].UpdatedAt.Time
	}

	resp := lastPositionSingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: LastPositionMap{
			LastMap:      lastMap,
			LastPosition: dataLastPositions,
		},
	}

	ctx.JSON(http.StatusOK, resp)

}
