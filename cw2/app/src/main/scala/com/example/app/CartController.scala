package com.example.app

import org.scalatra._
import org.json4s.{DefaultFormats, Formats}
import org.scalatra.json._

case class CartItem(productId: Int, quantity: Int)

class CartController extends ScalatraServlet with JacksonJsonSupport {

  protected implicit lazy val jsonFormats: Formats = DefaultFormats

  private var cartItems = List.empty[CartItem]

  // READ 
  get("/cart") = cartItems

  get("/cart/:productId") {
    val productId = params("productId").toInt
    cartItems.find(_.productId == productId) match {
      case Some(item) => item
      case None => NotFound(s"Product $productId not in cart")
    }
  }

  // ---------- CREATE ----------
  post("/cart") {
    val item = parsedBody.extract[CartItem]
    cartItems = cartItems :+ item
    Created(item)
  }

  // UPDATE 
  put("/cart/:productId") {
    val productId = params("productId").toInt
    val updatedItem = parsedBody.extract[CartItem]
    cartItems.find(_.productId == productId) match {
      case Some(_) =>
        cartItems = cartItems.map(i => if (i.productId == productId) updatedItem else i)
        Ok(updatedItem)
      case None => NotFound(s"Product $productId not in cart")
    }
  }

  // DELETE 
  delete("/cart/:productId") {
    val productId = params("productId").toInt
    cartItems.find(_.productId == productId) match {
      case Some(_) =>
        cartItems = cartItems.filterNot(_.productId == productId)
        NoContent()
      case None => NotFound(s"Product $productId not in cart")
    }
  }
}
