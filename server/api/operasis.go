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

type Operasi struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type HomeSkenario struct {
	Name       string    `json:"name"`
	SkenarioId uuid.UUID `json:"skenario_id"`
}

type HomeOperasi struct {
	Name      string         `json:"name"`
	OperasiId uuid.UUID      `json:"operasi_id"`
	Skenario  []HomeSkenario `json:"skenario"`
}

type operasiListResponse struct {
	Code    int       `json:"code"`
	Message string    `json:"message"`
	Data    []Operasi `json:"data"`
	Total   int       `json:"total"`
}

type homeOperasiListResponse struct {
	Code    int           `json:"code"`
	Message string        `json:"message"`
	Data    []HomeOperasi `json:"data"`
	Total   int           `json:"total"`
}

type operasiSingleResponse struct {
	Code    int     `json:"code"`
	Message string  `json:"message"`
	Data    Operasi `json:"data"`
}

type homeOperasiSingleResponse struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    HomeOperasi `json:"data"`
}

type operasiRequest struct {
	Name string `json:"name" binding:"required"`
}

func (server *Server) listPaginateOperasis(ctx *gin.Context, pageSize, pageNumber int64, search string) ([]db.Operasi, int, error) {
	if search != "" {
		rows, err := server.store.PaginateSearchOperasis(ctx, db.PaginateSearchOperasisParams{
			Name:       search,
			PageSize:   pageSize,
			PageNumber: pageNumber,
		})

		if err != nil {
			return nil, 0, err
		}

		count, err := server.store.CountSearchOperasis(ctx, search)

		if err != nil {
			return nil, 0, err
		}

		return rows, int(count), nil
	} else {
		rows, err := server.store.PaginateOperasis(ctx, db.PaginateOperasisParams{
			PageSize:   pageSize,
			PageNumber: pageNumber,
		})

		if err != nil {
			return nil, 0, err
		}

		count, err := server.store.CountOperasis(ctx)

		if err != nil {
			return nil, 0, err
		}

		return rows, int(count), nil
	}
}

func (server *Server) paginateOperasis(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	pageSize, pageNumber, err := server.getPageSizeAndNumber(ctx)

	if err != nil {
		log.Error().Err(err).Msg("paginateOperasis")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	search := ctx.Query("search")

	operasis, totalOperasis, err := server.listPaginateOperasis(ctx, int64(pageSize), int64(pageNumber), search)

	if err != nil {
		log.Error().Err(err).Msg("paginateOperasis")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	var rows []Operasi

	for _, category := range operasis {
		row := Operasi{
			ID:        category.ID,
			Name:      category.Name.String,
			CreatedAt: utils.ToWitaTimezone(category.CreatedAt.Time),
			UpdatedAt: utils.ToWitaTimezone(category.UpdatedAt.Time),
		}

		rows = append(rows, row)
	}

	response := operasiListResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data:    rows,
		Total:   totalOperasis,
	}

	ctx.JSON(http.StatusOK, response)

}

func (server *Server) deleteOperasis(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("deleteOperasis")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	err = server.store.DeleteOperasis(ctx, id)

	if err != nil {
		log.Error().Err(err).Msg("deleteOperasis")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, successResponse())

}

func (server *Server) getOperasis(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("getOperasis")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	row, err := server.store.GetOperasis(ctx, id)

	if err != nil {
		log.Error().Err(err).Msg("getOperasis")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	resp := operasiSingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: Operasi{
			ID:        row.ID,
			Name:      row.Name.String,
			CreatedAt: utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt: utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) allOperasis(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	rows, err := server.store.ListOperasis(ctx)

	if err != nil {
		log.Error().Err(err).Msg("allOperasis")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	var datas []Operasi

	for _, row := range rows {
		datas = append(datas, Operasi{
			ID:        row.ID,
			Name:      row.Name.String,
			CreatedAt: utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt: utils.ToWitaTimezone(row.UpdatedAt.Time),
		})
	}

	resp := operasiListResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data:    datas,
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) homeOperasis(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	rows, err := server.store.ListOperasis(ctx)

	if err != nil {
		log.Error().Err(err).Msg("allOperasis")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	var datas []HomeOperasi

	for _, row := range rows {

		operasiId, err := db.ToUuid(row.ID.String())
		if err != nil {
			log.Error().Err(err).Msg("homeOperasis")
			ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
			return
		}
		skenarios, err := server.store.ListSkenariosByOperasi(ctx, operasiId)
		if err != nil {
			log.Error().Err(err).Msg("homeOperasis")
			ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
			return
		}

		if len(skenarios) > 0 {

			var homeSkaenarios []HomeSkenario
			for _, skenario := range skenarios {
				homeSkaenarios = append(homeSkaenarios, HomeSkenario{
					SkenarioId: skenario.ID,
					Name:       skenario.Name.String,
				})
			}

			datas = append(datas, HomeOperasi{
				OperasiId: row.ID,
				Name:      row.Name.String,
				Skenario:  homeSkaenarios,
			})
		}

	}

	resp := homeOperasiListResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data:    datas,
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) getHomeOperasis(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("getHomeOperasis")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	row, err := server.store.GetOperasis(ctx, id)

	if err != nil {
		log.Error().Err(err).Msg("getHomeOperasis")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	operasiPgTypeUuid, err := db.ToUuid(id.String())
	if err != nil {
		log.Error().Err(err).Msg("getHomeOperasis")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	rowsSkenario, err := server.store.ListSkenariosByOperasi(ctx, operasiPgTypeUuid)

	var homeSkaenarios []HomeSkenario
	for _, skenario := range rowsSkenario {
		homeSkaenarios = append(homeSkaenarios, HomeSkenario{
			SkenarioId: skenario.ID,
			Name:       skenario.Name.String,
		})
	}

	data := HomeOperasi{
		OperasiId: row.ID,
		Name:      row.Name.String,
		Skenario:  homeSkaenarios,
	}

	resp := homeOperasiSingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data:    data,
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) createOperasis(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req operasiRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("createOperasis")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	row, err := server.store.CreateOperasi(ctx, db.ToText(req.Name))

	if err != nil {
		log.Error().Err(err).Msg("createOperasis")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	resp := operasiSingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: Operasi{
			ID:        row.ID,
			Name:      row.Name.String,
			CreatedAt: utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt: utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusCreated, resp)

}

func (server *Server) updateOperasis(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req operasiRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("updateOperasis")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("updateOperasis")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	row, err := server.store.UpdateOperasi(ctx, db.UpdateOperasiParams{
		Name: db.ToText(req.Name),
		ID:   id,
	})

	if err != nil {
		log.Error().Err(err).Msg("updateOperasis")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	resp := operasiSingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: Operasi{
			ID:        row.ID,
			Name:      row.Name.String,
			CreatedAt: utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt: utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusOK, resp)

}
