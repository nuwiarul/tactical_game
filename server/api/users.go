package api

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	db "github.com/nuwiarul/twgdev/db/sqlc"
	"github.com/nuwiarul/twgdev/token"
	"github.com/nuwiarul/twgdev/utils"
	"github.com/rs/zerolog/log"
)

type User struct {
	ID         uuid.UUID `json:"id"`
	Name       string    `json:"name"`
	Username   string    `json:"username"`
	Role       string    `json:"role"`
	ProfileImg string    `json:"profile_img"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type userListResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    []User `json:"data"`
	Total   int    `json:"total"`
}

type userSingleResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    User   `json:"data"`
}

type Login struct {
	User                  User      `json:"user"`
	AccessToken           string    `json:"access_token"`
	RefreshToken          string    `json:"refresh_token"`
	AccessTokenExpiresAt  time.Time `json:"access_token_expires_at"`
	RefreshTokenExpiresAt time.Time `json:"refresh_token_expires_at"`
}

type userLoginResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    Login  `json:"data"`
}

type userCreateRequest struct {
	Name       string `json:"name" binding:"required"`
	Username   string `json:"username" binding:"required,alphanum,min=4,username"`
	Password   string `json:"password" binding:"required,min=8"`
	Role       string `json:"role" binding:"required"`
	ProfileImg string `json:"profile_img"`
}

type userLoginRequest struct {
	Username string `json:"username" binding:"required,alphanum,min=4,username"`
	Password string `json:"password" binding:"required,min=8"`
}

func convertToUser(user db.SelectUsersRow) db.User {
	return db.User{
		ID:         user.ID,
		Name:       user.Name,
		Username:   user.Username,
		Role:       user.Role,
		ProfileImg: user.ProfileImg,
		CreatedAt:  user.CreatedAt,
		UpdatedAt:  user.UpdatedAt,
	}
}

func getLoginResponse(user db.User, accessToken, refreshToken string, accessTokenExp, refreshTokenExp time.Time) Login {
	return Login{
		User: User{
			ID:         user.ID,
			Name:       user.Name.String,
			Username:   user.Username.String,
			Role:       user.Role.String,
			ProfileImg: user.ProfileImg.String,
			CreatedAt:  utils.ToWitaTimezone(user.CreatedAt.Time),
			UpdatedAt:  utils.ToWitaTimezone(user.UpdatedAt.Time),
		},
		AccessToken:           accessToken,
		RefreshToken:          refreshToken,
		AccessTokenExpiresAt:  accessTokenExp,
		RefreshTokenExpiresAt: refreshTokenExp,
	}

}

func (server *Server) getIdentify(ctx *gin.Context) {

	authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	selectUserRow, err := server.store.SelectUsers(ctx, db.ToText(authPayload.Username))

	if err != nil {
		log.Error().Err(err).Msg("getIdentify")
		ctx.JSON(http.StatusBadRequest, serverInternalResponse(err))
		return
	}

	accessToken, accessPayload, err := server.tokenMaker.CreateToken(selectUserRow.ID, selectUserRow.Username.String, selectUserRow.Role.String, server.config.AccessTokenDuration)
	if err != nil {
		log.Error().Err(err).Msg("getIdentify")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	refreshToken, refreshPayload, err := server.tokenMaker.CreateToken(selectUserRow.ID, selectUserRow.Username.String, selectUserRow.Role.String, server.config.RefreshTokenDuration)
	if err != nil {
		log.Error().Err(err).Msg("getIdentify")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	user := convertToUser(selectUserRow)

	resp := userLoginResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data:    getLoginResponse(user, accessToken, refreshToken, accessPayload.ExpiresAt.Time, refreshPayload.ExpiresAt.Time),
	}

	ctx.JSON(http.StatusOK, resp)

}

func (server *Server) createUser(ctx *gin.Context) {

	//uthPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req userCreateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("createUser")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	hashPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		log.Error().Err(err).Msg("createUser")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	row, err := server.store.CreateUser(ctx, db.CreateUserParams{
		Name:       db.ToText(req.Name),
		Username:   db.ToText(req.Username),
		Password:   db.ToText(hashPassword),
		Role:       db.ToText(req.Role),
		ProfileImg: db.ToText(req.ProfileImg),
	})

	if err != nil {
		log.Error().Err(err).Msg("createUser")
		if errors.Is(err, db.ErrUniqueViolation) {
			ctx.JSON(http.StatusBadRequest, badRequestResponse(fmt.Errorf("username already exists")))
			return
		}
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	resp := userSingleResponse{
		Code:    http.StatusCreated,
		Message: "success",
		Data: User{
			ID:         row.ID,
			Name:       row.Name.String,
			Username:   row.Username.String,
			Role:       row.Role.String,
			ProfileImg: row.ProfileImg.String,
			CreatedAt:  utils.ToWitaTimezone(row.CreatedAt.Time),
			UpdatedAt:  utils.ToWitaTimezone(row.UpdatedAt.Time),
		},
	}

	ctx.JSON(http.StatusCreated, resp)

}

func (server *Server) loginUser(ctx *gin.Context) {

	//uthPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	var req userLoginRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Error().Err(err).Msg("loginUser")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	selectUserRow, err := server.store.SelectUsers(ctx, db.ToText(req.Username))
	if err != nil {
		log.Error().Err(err).Msg("loginUser")
		ctx.JSON(http.StatusBadRequest, unauthorizedResponse(fmt.Errorf("invalid username")))
		return
	}

	err = utils.CheckPassword(req.Password, selectUserRow.Password.String)
	if err != nil {
		log.Error().Err(err).Msg("loginUser")
		ctx.JSON(http.StatusBadRequest, unauthorizedResponse(fmt.Errorf("invalid password")))
		return
	}

	accessToken, accessPayload, err := server.tokenMaker.CreateToken(selectUserRow.ID, selectUserRow.Username.String, selectUserRow.Role.String, server.config.AccessTokenDuration)
	if err != nil {
		log.Error().Err(err).Msg("loginUser")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	refreshToken, refreshPayload, err := server.tokenMaker.CreateToken(selectUserRow.ID, selectUserRow.Username.String, selectUserRow.Role.String, server.config.RefreshTokenDuration)
	if err != nil {
		log.Error().Err(err).Msg("loginUser")
		ctx.JSON(http.StatusBadRequest, badRequestResponse(err))
		return
	}

	user := convertToUser(selectUserRow)

	resp := userLoginResponse{
		Code:    http.StatusOK,
		Message: "success",
		Data:    getLoginResponse(user, accessToken, refreshToken, accessPayload.ExpiresAt.Time, refreshPayload.ExpiresAt.Time),
	}

	ctx.JSON(http.StatusCreated, resp)

}
