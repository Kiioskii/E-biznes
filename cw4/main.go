package main

import (
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

	e.POST("/products", handlers.CreateProduct)
	e.GET("/products", handlers.ListProducts)
	e.GET("/products/:id", handlers.GetProduct)
	e.PUT("/products/:id", handlers.UpdateProduct)
	e.DELETE("/products/:id", handlers.DeleteProduct)

	e.Logger.Fatal(e.Start(":8080"))
}