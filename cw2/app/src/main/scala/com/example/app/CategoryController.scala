package com.example.app

import org.scalatra._
import org.json4s.{DefaultFormats, Formats}
import org.scalatra.json._

case class Category(id: Int, name: String)

class CategoryController extends ScalatraServlet with JacksonJsonSupport {

  protected implicit lazy val jsonFormats: Formats = DefaultFormats

  private var categories = List(
    Category(1, "Fantasy"),
    Category(2, "SF"),
    Category(3, "Criminal")
  )

  // READ 
  get("/categories") = categories

  get("/categories/:id") {
    val id = params("id").toInt
    categories.find(_.id == id) match {
      case Some(cat) => cat
      case None => NotFound(s"Category with id $id not found")
    }
  }

  // CREATE 
  post("/categories") {
    val category = parsedBody.extract[Category]
    categories = categories :+ category
    Created(category)
  }

  // UPDATE 
  put("/categories/:id") {
    val id = params("id").toInt
    val updatedCategory = parsedBody.extract[Category]
    categories.find(_.id == id) match {
      case Some(_) =>
        categories = categories.map(c => if (c.id == id) updatedCategory else c)
        Ok(updatedCategory)
      case None => NotFound(s"Category with id $id not found")
    }
  }

  // DELETE 
  delete("/categories/:id") {
    val id = params("id").toInt
    categories.find(_.id == id) match {
      case Some(_) =>
        categories = categories.filterNot(_.id == id)
        NoContent()
      case None => NotFound(s"Category with id $id not found")
    }
  }
}
