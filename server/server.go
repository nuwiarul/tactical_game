package main

import (
	"context"
	"time"

	"github.com/centrifugal/gocent/v3"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/nuwiarul/twgdev/api"
	db "github.com/nuwiarul/twgdev/db/sqlc"
	"github.com/nuwiarul/twgdev/rotatelogger"
	"github.com/nuwiarul/twgdev/utils"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {

	zerolog.TimestampFunc = func() time.Time {
		loc, err := time.LoadLocation("Asia/Makassar")
		if err != nil {
			panic(err)
		}
		return time.Now().In(loc)
	}

	logger := rotatelogger.NewLogger(rotatelogger.Config{
		Filename:              "app.log",
		Directory:             "./",
		MaxSize:               100,
		MaxBackups:            20,
		MaxAge:                28,
		ConsoleLoggingEnabled: false,
		FileLoggingEnabled:    true,
	})

	log.Logger = zerolog.New(logger).With().Timestamp().Logger()

	config, err := utils.LoadConfig(".")
	if err != nil {
		logger.Fatal().Err(err).Msg("Error loading config")
	}

	connPool, err := pgxpool.New(context.Background(), config.DBSource)
	if err != nil {
		logger.Fatal().Err(err).Msg("cannot connect to database:")
	}

	store := db.NewStore(connPool)
	runGinServer(config, store)
}

func runGinServer(config utils.Config, store db.Store) {

	/*
		socket := gocent.New(gocent.Config{
			Addr: "https://centrifugo.jagradewata.id/api",
			Key:  "4d5f4a6c-d6a6-42b1-8d1c-d9a25d2f9a62",
		})

	*/

	socket := gocent.New(gocent.Config{
		Addr: "http://localhost:8000/api",
		Key:  "4d5f4a6c-d6a6-42b1-8d1c-d9a25d2f9a62",
	})

	server, err := api.NewServer(config, store, socket)
	if err != nil {
		log.Fatal().Err(err).Msg("cannot create server:")
	}

	err = server.Start(config.HTTPServerAddress)
	if err != nil {
		log.Fatal().Err(err).Msg("cannot start server:")
	}
}
