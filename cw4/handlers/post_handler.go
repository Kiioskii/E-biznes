package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"echo-gorm-api/database"
	"echo-gorm-api/models"
)

func CreatePost(c echo.Context) error {
	post := new(models.Post)
	if err := c.Bind(post); err != nil {
		return err
	}

	database.DB.Create(post)
	return c.JSON(http.StatusCreated, post)
}

func GetPosts(c echo.Context) error {
	var posts []models.Post

	database.DB.Find(&posts)
	return c.JSON(http.StatusOK, posts)
}