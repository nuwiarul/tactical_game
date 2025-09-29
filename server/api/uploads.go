package api

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nuwiarul/twgdev/utils"
	"github.com/rs/zerolog/log"
)

type uploadResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    string `json:"data"`
}

var AllowedImageTypes = map[string]bool{
	"image/jpeg": true,
	"image/jpg":  true,
	"image/png":  true,
	"image/gif":  true,
}

func (server *Server) uploadImage(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	file, err := ctx.FormFile("image")
	if err != nil {
		log.Error().Err(err).Msg("uploadImage")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	fileType := file.Header.Get("Content-Type")
	if !AllowedImageTypes[fileType] {
		log.Error().Err(err).Msg("uploadImage")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(fmt.Errorf("invalid file type: %s", fileType)))
		return
	}

	filename := fmt.Sprintf("%s-%s", utils.GenerateFilenameUnix(), file.Filename)

	err = ctx.SaveUploadedFile(file, "./uploads/"+filename)
	if err != nil {
		log.Error().Err(err).Msg("uploadImage")
		ctx.JSON(http.StatusInternalServerError, serverInternalResponse(err))
		return
	}

	resp := uploadResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data:    fmt.Sprintf("/uploads/%s", filename),
	}

	ctx.JSON(http.StatusOK, resp)

}
