package models

import "gorm.io/gorm"

type Product struct {
	ID         uint     `json:"id" gorm:"primaryKey"`
	Name       string   `json:"name" gorm:"not null"`
	Price      int      `json:"price" gorm:"not null"`
	CategoryID uint     `json:"category_id"`
	Category   Category `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
}

func (p *Product) Create(db *gorm.DB) error {
	return db.Create(p).Error
}

func (p *Product) Update(db *gorm.DB) error {
	return db.Save(p).Error
}

func GetProduct(db *gorm.DB, id uint) (*Product, error) {
	var product Product
	if err := db.Preload("Category").First(&product, id).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func GetAllProducts(db *gorm.DB) ([]Product, error) {
	var products []Product
	if err := db.Model(&Product{}).Preload("Category").Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func DeleteProduct(db *gorm.DB, id uint) (int64, error) {
	result := db.Delete(&Product{}, id)
	return result.RowsAffected, result.Error
}
