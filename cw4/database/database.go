package database

import (
	"os"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"echo-gorm-api/models"
)

var DB *gorm.DB

func Connect() {
	dbPath := os.Getenv("DB_PATH")

	if dbPath == "" {
		dbPath = "app.db"
	}

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	db.AutoMigrate(
		&models.User{},
		&models.Post{},
		&models.Product{},
	)

	DB = db
}