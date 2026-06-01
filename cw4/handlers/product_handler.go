package handlers

import (
	"net/http"
	"strconv"

	"echo-gorm-api/database"
	"echo-gorm-api/models"

	"github.com/labstack/echo/v4"
)

func CreateProduct(c echo.Context) error {
	product := new(models.Product)
	if err := c.Bind(product); err != nil {
		return err
	}

	database.DB.Create(product)
	return c.JSON(http.StatusCreated, product)
}

func ListProducts(c echo.Context) error {
	var products []models.Product

	database.DB.Find(&products)
	return c.JSON(http.StatusOK, products)
}

func GetProduct(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid id")
	}

	var product models.Product
	if err := database.DB.First(&product, id).Error; err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "product not found")
	}
	return c.JSON(http.StatusOK, product)
}

func UpdateProduct(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid id")
	}

	var product models.Product
	if err := database.DB.First(&product, id).Error; err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "product not found")
	}

	if err := c.Bind(&product); err != nil {
		return err
	}
	product.ID = uint(id)

	database.DB.Save(&product)
	return c.JSON(http.StatusOK, product)
}

func DeleteProduct(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid id")
	}

	result := database.DB.Delete(&models.Product{}, id)
	if result.Error != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, result.Error.Error())
	}
	if result.RowsAffected == 0 {
		return echo.NewHTTPError(http.StatusNotFound, "product not found")
	}
	return c.NoContent(http.StatusNoContent)
}
