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

type Category struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Icon      string    `json:"icon"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type categoryListResponse struct {
	Code    int        `json:"code"`
	Message string     `json:"message"`
	Data    []Category `json:"data"`
	Total   int        `json:"total"`
}

type categorySingleResponse struct {
	Code    int      `json:"code"`
	Message string   `json:"message"`
	Data    Category `json:"data"`
}

type categoryRequest struct {
	Name string `json:"name" binding:"required"`
	Icon string `json:"icon"`
}

func (server *Server) listPaginateCategories(ctx *gin.Context, pageSize, pageNumber int64, search string) ([]db.Category, int, error) {
	if search != "" {
		rows, err := server.store.PaginateSearchCategories(ctx, db.PaginateSearchCategoriesParams{
			Name:       search,
			PageSize:   pageSize,
			PageNumber: pageNumber,
		})

		if err != nil {
			return nil, 0, err
		}

		count, err := server.store.CountSearchCategories(ctx, search)

		if err != nil {
			return nil, 0, err
		}

		return rows, int(count), nil
	} else {
		rows, err := server.store.PaginateCategories(ctx, db.PaginateCategoriesParams{
			PageSize:   pageSize,
			PageNumber: pageNumber,
		})

		if err != nil {
			return nil, 0, err
		}

		count, err := server.store.CountCategories(ctx)

		if err != nil {
			return nil, 0, err
		}

		return rows, int(count), nil
	}
}

func (server *Server) paginateCategories(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	pageSize, pageNumber, err := server.getPageSizeAndNumber(ctx)

	if err != nil {
		log.Error().Err(err).Msg("paginateCategories")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	search := ctx.Query("search")

	categories, totalCategories, err := server.listPaginateCategories(ctx, int64(pageSize), int64(pageNumber), search)

	if err != nil {
		log.Error().Err(err).Msg("paginateCategories")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	var rows []Category

	for _, category := range categories {
		row := Category{
			ID:        category.ID,
			Name:      category.Name.String,
			Icon:      category.Icon.String,
			CreatedAt: utils.ToWitaTimezone(category.CreatedAt.Time),
			UpdatedAt: utils.ToWitaTimezone(category.UpdatedAt.Time),
		}

		rows = append(rows, row)
	}

	response := categoryListResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data:    rows,
		Total:   totalCategories,
	}

	ctx.JSON(http.StatusOK, response)

}

func (server *Server) deleteCategories(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("deleteCategories")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	err = server.store.DeleteCategories(ctx, id)

	if err != nil {
		log.Error().Err(err).Msg("deleteCategories")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, successResponse())

}

func (server *Server) getCategories(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("getCategories")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	row, err := server.store.GetCategories(ctx, id)

	if err != nil {
		log.Error().Err(err).Msg("getCategories")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	resp := categorySingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: Category{
			ID:        row.ID,
			Name:      row.Name.String,
			Icon:      row.Icon.String,
			CreatedAt: utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt: utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) allCategories(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	rows, err := server.store.ListCategories(ctx)

	if err != nil {
		log.Error().Err(err).Msg("allCategories")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	var datas []Category

	for _, row := range rows {
		datas = append(datas, Category{
			ID:        row.ID,
			Name:      row.Name.String,
			Icon:      row.Icon.String,
			CreatedAt: utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt: utils.ToWitaTimezone(row.UpdatedAt.Time),
		})
	}

	resp := categoryListResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data:    datas,
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) createCategories(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req categoryRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("createCategories")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	row, err := server.store.CreateCategory(ctx, db.CreateCategoryParams{
		Name: db.ToText(req.Name),
		Icon: db.ToText(req.Icon),
	})

	if err != nil {
		log.Error().Err(err).Msg("createCategories")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	resp := categorySingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: Category{
			ID:        row.ID,
			Name:      row.Name.String,
			Icon:      row.Icon.String,
			CreatedAt: utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt: utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusCreated, resp)

}

func (server *Server) updateCategories(ctx *gin.Context) {

	//authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req categoryRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("updateCategories")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	id, err := uuid.Parse(ctx.Param("id"))

	if err != nil {
		log.Error().Err(err).Msg("updateCategories")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	row, err := server.store.UpdateCategory(ctx, db.UpdateCategoryParams{
		Name: db.ToText(req.Name),
		Icon: db.ToText(req.Icon),
		ID:   id,
	})

	if err != nil {
		log.Error().Err(err).Msg("updateCategories")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	resp := categorySingleResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data: Category{
			ID:        row.ID,
			Name:      row.Name.String,
			Icon:      row.Icon.String,
			CreatedAt: utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt: utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusOK, resp)

}
