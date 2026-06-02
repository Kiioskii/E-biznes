package models

type Category struct {
	ID       uint      `json:"id" gorm:"primaryKey"`
	Name     string    `json:"name" gorm:"not null;unique"`
	Products []Product `json:"products,omitempty" gorm:"foreignKey:CategoryID"`
}
