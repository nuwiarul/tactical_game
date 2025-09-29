DB_URL=postgresql://twg_user:twg_12345678_*polda_BaLi_!_987654321@jagradewata.vinrul.id:5432/twg_db?sslmode=disable

migrateup:
	migrate -path db/migration -database "$(DB_URL)" -verbose up
migrateup1:
	migrate -path db/migration -database "$(DB_URL)" -verbose up 1
migratedown:
	migrate -path db/migration -database "$(DB_URL)" -verbose down
migratedown1:
	migrate -path db/migration -database "$(DB_URL)" -verbose down 1
sqlc:
	sqlc generate
server:
	go run server.go
new_migration:
	migrate create -ext sql -dir db/migration -seq $(name)