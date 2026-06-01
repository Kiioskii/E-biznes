package controllers

import (
	"net/http"
	"strconv"

	"echo-gorm-api/database"
	"echo-gorm-api/models"

	"github.com/labstack/echo/v4"
)

type ProductController struct{}

func NewProductController() *ProductController {
	return &ProductController{}
}

func (pc *ProductController) RegisterRoutes(e *echo.Echo) {
	e.POST("/products", pc.Create)
	e.GET("/products", pc.Index)
	e.GET("/products/:id", pc.Show)
	e.PUT("/products/:id", pc.Update)
	e.DELETE("/products/:id", pc.Delete)
}

func (pc *ProductController) Create(c echo.Context) error {
	product := new(models.Product)
	if err := c.Bind(product); err != nil {
		return err
	}

	if err := product.Create(database.DB); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusCreated, product)
}

func (pc *ProductController) Index(c echo.Context) error {
	products, err := models.GetAllProducts(database.DB)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, products)
}

func (pc *ProductController) Show(c echo.Context) error {
	id, err := parseProductID(c)
	if err != nil {
		return err
	}

	product, err := models.GetProduct(database.DB, id)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "product not found")
	}
	return c.JSON(http.StatusOK, product)
}

func (pc *ProductController) Update(c echo.Context) error {
	id, err := parseProductID(c)
	if err != nil {
		return err
	}

	product, err := models.GetProduct(database.DB, id)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "product not found")
	}

	if err := c.Bind(product); err != nil {
		return err
	}
	product.ID = id

	if err := product.Update(database.DB); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, product)
}

func (pc *ProductController) Delete(c echo.Context) error {
	id, err := parseProductID(c)
	if err != nil {
		return err
	}

	rows, err := models.DeleteProduct(database.DB, id)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	if rows == 0 {
		return echo.NewHTTPError(http.StatusNotFound, "product not found")
	}
	return c.NoContent(http.StatusNoContent)
}

func parseProductID(c echo.Context) (uint, error) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		return 0, echo.NewHTTPError(http.StatusBadRequest, "invalid id")
	}
	return uint(id), nil
}
