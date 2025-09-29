package api

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	db "github.com/nuwiarul/twgdev/db/sqlc"
	"github.com/rs/zerolog/log"
)

type commandRequest struct {
	OperasiId  string `json:"operasi_id" binding:"required"`
	SkenarioId string `json:"skenario_id" binding:"required"`
	MarkerId   string `json:"marker_id" binding:"required"`
	Command    string `json:"command" binding:"required"`
	Data       string `json:"data"`
	IsSave     int    `json:"is_save"`
}

type Center struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

type DataZoom struct {
	Center  Center  `json:"center"`
	Zoom    float64 `json:"zoom"`
	Pitch   float64 `json:"pitch"`
	Bearing float64 `json:"bearing"`
}

type DataMove struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

type DataRot struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
	Z float64 `json:"z"`
}

func (server *Server) getRowMarker(ctx *gin.Context, markerId string) (db.GetMarkerRow, error) {

	id, err := uuid.Parse(markerId)
	if err != nil {
		return db.GetMarkerRow{}, err
	}

	row, err := server.store.GetMarker(ctx, id)
	if err != nil {
		return db.GetMarkerRow{}, err
	}

	return row, nil
}

func (server *Server) createOrUpdateLastMap(ctx *gin.Context, data string, operasiId, skenarioId pgtype.UUID) error {
	var dataZoom DataZoom
	// 4. Proses Unmarshal: mengubah JSON (byte slice) ke struct
	err := json.Unmarshal([]byte(data), &dataZoom)
	if err != nil {
		return err
	}

	lastMaps, err := server.store.ListLastMapsBySkenario(ctx, skenarioId)
	if len(lastMaps) > 0 {
		_, err := server.store.UpdateLastMaps(ctx, db.UpdateLastMapsParams{
			SkenarioID: skenarioId,
			CenterX:    db.ToFloat8(dataZoom.Center.X),
			CenterY:    db.ToFloat8(dataZoom.Center.Y),
			Zoom:       db.ToFloat8(dataZoom.Zoom),
			Pitch:      db.ToFloat8(dataZoom.Pitch),
			Bearing:    db.ToFloat8(dataZoom.Bearing),
		})
		if err != nil {
			return err
		}
	} else {
		_, err = server.store.CreateLastMap(ctx, db.CreateLastMapParams{
			SkenarioID: skenarioId,
			CenterX:    db.ToFloat8(dataZoom.Center.X),
			CenterY:    db.ToFloat8(dataZoom.Center.Y),
			Zoom:       db.ToFloat8(dataZoom.Zoom),
			Pitch:      db.ToFloat8(dataZoom.Pitch),
			Bearing:    db.ToFloat8(dataZoom.Bearing),
			OperasiID:  operasiId,
		})
		if err != nil {
			return err
		}
	}
	return nil
}

func (server *Server) createOrUpdateLastPosition(ctx *gin.Context, command, data string, operasiId, skenarioId, markerId pgtype.UUID) error {
	lastPositions, err := server.store.ListLastPositonsByMarkerId(ctx, markerId)
	if err != nil {
		return err
	}

	if command == "MOVE" {
		err = server.createOrUpdateMove(ctx, data, lastPositions, operasiId, skenarioId, markerId)
		if err != nil {
			return err
		}
	}

	if command == "ROT" {
		err = server.createOrUpdateRot(ctx, data, lastPositions, operasiId, skenarioId, markerId)
		if err != nil {
			return err
		}
	}

	return nil
}

func (server *Server) createOrUpdateMove(ctx *gin.Context, data string, lastPositions []db.LastPosition, operasiId, skenarioId, markerId pgtype.UUID) error {
	var dataMove DataMove

	// 4. Proses Unmarshal: mengubah JSON (byte slice) ke struct
	err := json.Unmarshal([]byte(data), &dataMove)
	if err != nil {
		return err
	}

	if len(lastPositions) > 0 {
		_, err = server.store.UpdateLastPositionMove(ctx, db.UpdateLastPositionMoveParams{
			MarkerID: markerId,
			PosX:     db.ToFloat8(dataMove.X),
			PosY:     db.ToFloat8(dataMove.Y),
		})
		if err != nil {
			return err
		}
	} else {

		marker, err := server.getRowMarker(ctx, markerId.String())

		if err != nil {
			return err
		}

		_, err = server.store.CreateLastPosition(ctx, db.CreateLastPositionParams{
			MarkerID:   markerId,
			PosX:       db.ToFloat8(dataMove.X),
			PosY:       db.ToFloat8(dataMove.Y),
			RotX:       marker.RotX,
			RotY:       marker.RotY,
			RotZ:       marker.RotZ,
			OperasiID:  operasiId,
			SkenarioID: skenarioId,
		})

		if err != nil {
			return err
		}
	}

	return nil
}

func (server *Server) createOrUpdateRot(ctx *gin.Context, data string, lastPositions []db.LastPosition, operasiId, skenarioId, markerId pgtype.UUID) error {
	var dataRot DataRot

	// 4. Proses Unmarshal: mengubah JSON (byte slice) ke struct
	err := json.Unmarshal([]byte(data), &dataRot)
	if err != nil {
		return err
	}

	if len(lastPositions) > 0 {
		_, err = server.store.UpdateLastPositionRot(ctx, db.UpdateLastPositionRotParams{
			MarkerID: markerId,
			RotX:     db.ToFloat8(dataRot.X),
			RotY:     db.ToFloat8(dataRot.Y),
			RotZ:     db.ToFloat8(dataRot.Z),
		})
		if err != nil {
			return err
		}
	} else {

		marker, err := server.getRowMarker(ctx, markerId.String())

		if err != nil {
			return err
		}

		_, err = server.store.CreateLastPosition(ctx, db.CreateLastPositionParams{
			MarkerID:   markerId,
			PosX:       marker.PosX,
			PosY:       marker.PosY,
			RotX:       db.ToFloat8(dataRot.X),
			RotY:       db.ToFloat8(dataRot.Y),
			RotZ:       db.ToFloat8(dataRot.Z),
			OperasiID:  operasiId,
			SkenarioID: skenarioId,
		})

		if err != nil {
			return err
		}
	}

	return nil
}

func (server *Server) publishCommands(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req commandRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("publishCommands")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	if req.IsSave == 1 {

		operasiId, skenarioId, markerId, err := server.pgTypeOperasiSkenarioUnit(req.OperasiId, req.SkenarioId, req.MarkerId)

		if err != nil {
			log.Error().Err(err).Msg("publishCommands")
			ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
			return
		}

		_, err = server.store.CreateCommand(ctx, db.CreateCommandParams{
			SkenarioID: skenarioId,
			OperasiID:  operasiId,
			MarkerID:   markerId,
			Command:    db.ToText(req.Command),
			Data:       db.ToText(req.Data),
		})

		if err != nil {
			log.Error().Err(err).Msg("publishCommands")
			ctx.JSON(http.StatusInternalServerError, serverInternalResponse(err))
			return
		}

		if req.Command == "ZOOM" {
			err = server.createOrUpdateLastMap(ctx, req.Data, operasiId, skenarioId)
			if err != nil {
				log.Error().Err(err).Msg("publishCommands")
				ctx.JSON(http.StatusInternalServerError, serverInternalResponse(err))
				return
			}

		}

		if req.Command == "MOVE" || req.Command == "ROT" {
			err = server.createOrUpdateLastPosition(ctx, req.Command, req.Data, operasiId, skenarioId, markerId)
			if err != nil {
				log.Error().Err(err).Msg("publishCommands")
				ctx.JSON(http.StatusInternalServerError, serverInternalResponse(err))
				return
			}
		}

	}

	jsonData, err := json.Marshal(req)

	if err != nil {
		log.Error().Err(err).Msg("publishCommands")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	result, err := server.socket.Publish(ctx, server.config.Channel, jsonData)
	if err != nil {
		log.Error().Err(err).Msg("when publish socket")
		ctx.JSON(http.StatusInternalServerError, serverInternalResponse(err))
		return
	}

	//log.Info().Interface("result", result).Msg("publishSocket")

	ctx.JSON(http.StatusCreated, result)

}
