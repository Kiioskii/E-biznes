package models

import (
	"errors"

	"gorm.io/gorm"
)

type Cart struct {
	ID     uint       `json:"id" gorm:"primaryKey"`
	UserID uint       `json:"user_id" gorm:"uniqueIndex;not null"`
	User   User       `json:"-" gorm:"foreignKey:UserID"`
	Items  []CartItem `json:"items" gorm:"foreignKey:CartID"`
}

type CartItem struct {
	ID        uint    `json:"id" gorm:"primaryKey"`
	CartID    uint    `json:"cart_id" gorm:"not null;uniqueIndex:idx_cart_product"`
	ProductID uint    `json:"product_id" gorm:"not null;uniqueIndex:idx_cart_product"`
	Quantity  int     `json:"quantity" gorm:"not null;default:1"`
	Product   Product `json:"product" gorm:"foreignKey:ProductID"`
}

func GetOrCreateCart(db *gorm.DB, userID uint) (*Cart, error) {
	if err := db.First(&User{}, userID).Error; err != nil {
		return nil, err
	}

	var cart Cart
	err := db.Where("user_id = ?", userID).First(&cart).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		cart = Cart{UserID: userID}
		if err := db.Create(&cart).Error; err != nil {
			return nil, err
		}
		return &cart, nil
	}
	if err != nil {
		return nil, err
	}
	return &cart, nil
}

func GetCartByUserID(db *gorm.DB, userID uint) (*Cart, error) {
	if err := db.First(&User{}, userID).Error; err != nil {
		return nil, err
	}

	var cart Cart
	if err := db.Where("user_id = ?", userID).Preload("Items.Product").First(&cart).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &Cart{UserID: userID, Items: []CartItem{}}, nil
		}
		return nil, err
	}
	return &cart, nil
}

func AddProductToCart(db *gorm.DB, userID, productID uint, quantity int) (*Cart, error) {
	if quantity < 1 {
		quantity = 1
	}

	if _, err := GetProduct(db, productID); err != nil {
		return nil, err
	}

	cart, err := GetOrCreateCart(db, userID)
	if err != nil {
		return nil, err
	}

	var item CartItem
	err = db.Where("cart_id = ? AND product_id = ?", cart.ID, productID).First(&item).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		item = CartItem{CartID: cart.ID, ProductID: productID, Quantity: quantity}
		if err := db.Create(&item).Error; err != nil {
			return nil, err
		}
	} else if err != nil {
		return nil, err
	} else {
		item.Quantity += quantity
		if err := db.Save(&item).Error; err != nil {
			return nil, err
		}
	}

	return loadCartWithItems(db, cart.ID)
}

func RemoveProductFromCart(db *gorm.DB, userID, productID uint) (*Cart, error) {
	if err := db.First(&User{}, userID).Error; err != nil {
		return nil, err
	}

	var cart Cart
	if err := db.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		return nil, err
	}

	result := db.Where("cart_id = ? AND product_id = ?", cart.ID, productID).Delete(&CartItem{})
	if result.Error != nil {
		return nil, result.Error
	}
	if result.RowsAffected == 0 {
		return nil, gorm.ErrRecordNotFound
	}

	return loadCartWithItems(db, cart.ID)
}

func loadCartWithItems(db *gorm.DB, cartID uint) (*Cart, error) {
	var cart Cart
	if err := db.Preload("Items.Product").First(&cart, cartID).Error; err != nil {
		return nil, err
	}
	return &cart, nil
}
