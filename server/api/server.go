package api

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/centrifugal/gocent/v3"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	db "github.com/nuwiarul/twgdev/db/sqlc"
	"github.com/nuwiarul/twgdev/token"
	"github.com/nuwiarul/twgdev/utils"
	"github.com/rs/zerolog/log"
)

type Server struct {
	config     utils.Config
	store      db.Store
	router     *gin.Engine
	tokenMaker token.Maker
	socket     *gocent.Client
}

func NewServer(config utils.Config, store db.Store, socket *gocent.Client) (*Server, error) {
	tokenMaker, err := token.NewPasetoMaker(config.TokenSymmetricKey)
	if err != nil {
		return nil, fmt.Errorf("cannot create token maker: %w", err)
	}
	server := &Server{
		config:     config,
		store:      store,
		tokenMaker: tokenMaker,
		socket:     socket,
	}

	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		err := v.RegisterValidation("username", validateUsername)
		if err != nil {
			log.Fatal().Err(err).Msg("cannot register validator")
		}
	}

	server.setupRouter()

	return server, nil

}

func (server *Server) CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		allowOrigins := strings.Split(server.config.CorsDomain, ",")
		fmt.Println(allowOrigins)
		origin := c.Request.Header.Get("Origin")
		if utils.ArrayContain(allowOrigins, origin) {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		}

		//c.Writer.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_DOMAIN"))
		c.Writer.Header().Add("", "")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		c.Writer.Header().Set("Access-Control-Expose-Headers", "Content-Length")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
		} else {
			c.Next()
		}
	}
}

func (server *Server) setupRouter() {

	if server.config.Enviroment == "development" {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()
	router.Use(server.CORS())

	//router.POST("/users/login", server.loginUser)
	//router.GET("/users/refresh", server.renewAccessToken)
	authGroup := router.Group("/auth")
	authGroup.POST("/login", server.loginUser)

	publicGroup := router.Group("/public")
	publicGroup.POST("/socket", server.publishCommands)
	publicGroup.GET("/skenarios/:operasi_id", server.listSkenarios)
	publicGroup.GET("/skenarios/get/:id", server.getSkenarios)
	publicGroup.GET("/markers/list/:skenario_id", server.listMarkers)
	publicGroup.GET("/buildings/list/:skenario_id", server.listBuildings)
	publicGroup.GET("/alurs/list/:skenario_id", server.listAlurs)
	publicGroup.GET("/last_positions/:skenario_id", server.getLastPosition)
	publicGroup.GET("/list/operasis", server.homeOperasis)
	publicGroup.GET("/get/home/operasis/:id", server.getHomeOperasis)

	adminGroup := router.Group("/admin").Use(authMiddleware(server.tokenMaker), roleMiddleware([]string{"admin"}))

	adminGroup.GET("/categories", server.paginateCategories).Use(authMiddleware(server.tokenMaker))
	adminGroup.GET("/categories/:id", server.getCategories)
	adminGroup.POST("/categories", server.createCategories)
	adminGroup.PUT("/categories/:id", server.updateCategories)
	adminGroup.DELETE("/categories/:id", server.deleteCategories)

	//adminGroup.GET("/operasis", server.paginateOperasis).Use(authMiddleware(server.tokenMaker))
	//adminGroup.GET("/operasis/:id", server.getOperasis)
	adminGroup.POST("/operasis", server.createOperasis)
	adminGroup.PUT("/operasis/:id", server.updateOperasis)
	adminGroup.DELETE("/operasis/:id", server.deleteOperasis)

	adminGroup.POST("/skenarios", server.createSkenarios)
	adminGroup.PUT("/skenarios/:id", server.updateSkenarios)
	adminGroup.DELETE("/skenarios/:id", server.deleteSkenarios)

	//categoryGroup := router.Group("/")

	privateGroup := router.Group("/private").Use(authMiddleware(server.tokenMaker))

	privateGroup.GET("/operasis", server.paginateOperasis)
	privateGroup.GET("/operasis/:id", server.getOperasis)

	privateGroup.POST("/upload-image", server.uploadImage)
	privateGroup.GET("/identify", server.getIdentify)
	privateGroup.GET("/categories/all", server.allCategories)

	privateGroup.POST("/markers", server.createMarkers)
	privateGroup.PUT("/markers/geom/:id", server.updateMarkerGeom)
	privateGroup.PUT("/markers/name/:id", server.updateMarkerName)
	privateGroup.PUT("/markers/scale/:id", server.updateMarkerScale)
	privateGroup.PUT("/markers/rotasi/:id", server.updateMarkerRotasi)
	privateGroup.DELETE("/markers/:id", server.deleteMarkers)

	privateGroup.POST("/buildings", server.createBuildings)
	privateGroup.PUT("/buildings/:id", server.updateBuilding)
	privateGroup.DELETE("/buildings/:id", server.deleteBuildings)

	adminGroup.POST("/alurs", server.createAlurs)
	adminGroup.PUT("/alurs/:id", server.updateAlur)
	adminGroup.DELETE("/alurs/:id", server.deleteAlurs)

	adminGroup.GET("/users", server.listUsers)
	adminGroup.POST("/users", server.createUser)
	adminGroup.PUT("/users/:id", server.updateUser)
	adminGroup.DELETE("/users/:id", server.deleteUser)

	privateGroup.GET("/users/:id", server.getUser)

	//apiGroup.POST("/users", server.createUser)

	router.Static("/uploads", "./uploads")
	//router.GET("/api/auth/get", server.getUserIdentify)

	server.router = router
}

func (server *Server) Start(address string) error {
	return server.router.Run(address)
}

func errorResponse(code int, err error) gin.H {
	return gin.H{
		"code":    code,
		"message": err.Error(),
	}
}

func successResponse() gin.H {
	return gin.H{
		"code":    http.StatusOK,
		"message": "success",
	}
}

func createdResponse() gin.H {
	return gin.H{
		"code":    http.StatusCreated,
		"message": "success",
	}
}

func badRequestResponse(err error) gin.H {
	return errorResponse(http.StatusBadRequest, err)
}

func serverInternalResponse(err error) gin.H {
	return errorResponse(http.StatusInternalServerError, err)
}

func forbiddenResponse(err error) gin.H {
	return errorResponse(http.StatusForbidden, err)
}

func unauthorizedResponse(err error) gin.H {
	return errorResponse(http.StatusUnauthorized, err)
}
