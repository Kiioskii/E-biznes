package controllers

import (
	"net/http"
	"strconv"

	"echo-gorm-api/database"
	"echo-gorm-api/models"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type CartController struct{}

func NewCartController() *CartController {
	return &CartController{}
}

func (cc *CartController) RegisterRoutes(e *echo.Echo) {
	e.GET("/users/:user_id/cart", cc.Show)
	e.POST("/users/:user_id/cart/items", cc.AddItem)
	e.DELETE("/users/:user_id/cart/items/:product_id", cc.RemoveItem)
}

func (cc *CartController) Show(c echo.Context) error {
	userID, err := parseUserID(c)
	if err != nil {
		return err
	}

	cart, err := models.GetCartByUserID(database.DB, userID)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return echo.NewHTTPError(http.StatusNotFound, "user not found")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, cart)
}

type addCartItemRequest struct {
	ProductID uint `json:"product_id"`
	Quantity  int  `json:"quantity"`
}

func (cc *CartController) AddItem(c echo.Context) error {
	userID, err := parseUserID(c)
	if err != nil {
		return err
	}

	var req addCartItemRequest
	if err := c.Bind(&req); err != nil {
		return err
	}
	if req.ProductID == 0 {
		return echo.NewHTTPError(http.StatusBadRequest, "product_id is required")
	}

	cart, err := models.AddProductToCart(database.DB, userID, req.ProductID, req.Quantity)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return echo.NewHTTPError(http.StatusNotFound, "user or product not found")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, cart)
}

func (cc *CartController) RemoveItem(c echo.Context) error {
	userID, err := parseUserID(c)
	if err != nil {
		return err
	}

	productID, err := strconv.ParseUint(c.Param("product_id"), 10, 64)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid product id")
	}

	cart, err := models.RemoveProductFromCart(database.DB, userID, uint(productID))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return echo.NewHTTPError(http.StatusNotFound, "user, cart or product not found in cart")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, cart)
}

func parseUserID(c echo.Context) (uint, error) {
	id, err := strconv.ParseUint(c.Param("user_id"), 10, 64)
	if err != nil {
		return 0, echo.NewHTTPError(http.StatusBadRequest, "invalid user id")
	}
	return uint(id), nil
}
