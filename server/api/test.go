package api

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

type mapDataSocket struct {
	ID   int64  `json:"id"`
	Data string `json:"data"`
}

type mapDataRequest struct {
	Type string `json:"type"`
	Data string `json:"data"`
}

func (server *Server) publishSocket(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req mapDataRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("publishSocket")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	jsonData, err := json.Marshal(req)

	if err != nil {
		log.Error().Err(err).Msg("publishSocket")
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
