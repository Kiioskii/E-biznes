package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"echo-gorm-api/database"
	"echo-gorm-api/models"
)

func CreateUser(c echo.Context) error {
	user := new(models.User)
	if err := c.Bind(user); err != nil {
		return err
	}

	database.DB.Create(user)
	return c.JSON(http.StatusCreated, user)
}

func GetUsers(c echo.Context) error {
	var users []models.User

	database.DB.Preload("Posts").Find(&users)
	return c.JSON(http.StatusOK, users)
}