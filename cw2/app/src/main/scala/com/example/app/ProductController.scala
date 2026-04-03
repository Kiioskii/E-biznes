package com.example.app

import org.scalatra._
import org.json4s.{DefaultFormats, Formats}
import org.scalatra.json._

case class Product(id: Int, name: String, price: Double)

class ProductController extends ScalatraServlet with JacksonJsonSupport {

  protected implicit lazy val jsonFormats: Formats = DefaultFormats

  var products = List(
    Product(1, "Diuna", 10.0),
    Product(2, "Weapons", 8.0),
    Product(3, "Shrek", 8.0),
    Product(4, "Shrek", 7.5),
    Product(5, "LOTR", 7.0)
  )

  get("/products") {
      products
  }

  get("/products/:id") {
    val id = params("id").toInt
    products.find(_.id == id) match {
      case Some(product) => product
      case None => NotFound("Produkt nie znaleziony")
    }
  }

  post("/products") {
    val product = parsedBody.extract[Product]
    products = products :+ product
    Created(product)
  }

  put("/products/:id") {
    val id = params("id").toInt
    val updated = parsedBody.extract[Product]
    products = products.map(p => if (p.id == id) updated else p)
    updated
  }

  delete("/products/:id") {
    val id = params("id").toInt
    products = products.filterNot(_.id == id)
    NoContent()
  }

}
