package main

import (
	"echo-gorm-api/controllers"
	"echo-gorm-api/database"
	"echo-gorm-api/handlers"

	"github.com/labstack/echo/v4"
)

func main() {
	database.Connect()

	e := echo.New()

	e.POST("/users", handlers.CreateUser)
	e.GET("/users", handlers.GetUsers)

	e.POST("/posts", handlers.CreatePost)
	e.GET("/posts", handlers.GetPosts)

	productController := controllers.NewProductController()
	productController.RegisterRoutes(e)

	e.Logger.Fatal(e.Start(":8080"))
}