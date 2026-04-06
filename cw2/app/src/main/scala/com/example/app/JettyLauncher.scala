package com.example.app

import org.eclipse.jetty.server.Server
import org.eclipse.jetty.servlet.{DefaultServlet, ServletContextHandler, ServletHolder}
import org.scalatra.CorsSupport

object JettyLauncher {
  def main(args: Array[String]): Unit = {
    val port = if (System.getenv("PORT") != null) System.getenv("PORT").toInt else 8080
    val server = new Server(port)

    val context = new ServletContextHandler(ServletContextHandler.SESSIONS)
    context.setContextPath("/")
    server.setHandler(context)

    val origin1 =
      Option(System.getenv("CORS_ALLOWED_ORIGIN_1")).getOrElse("http://localhost:3000")
    val origin2 =
      Option(System.getenv("CORS_ALLOWED_ORIGIN_2")).getOrElse("http://localhost:5173")
    context.setInitParameter(CorsSupport.AllowedOriginsKey, s"$origin1,$origin2")
    context.setInitParameter(
      CorsSupport.AllowedMethodsKey,
      "GET,POST,PUT,DELETE,OPTIONS,HEAD,PATCH"
    )

    // Mount Scalatra servlets
    context.addServlet(new ServletHolder(new ProductController), "/*")


    // Default servlet for static content
    val defaultServlet = new ServletHolder("default", classOf[DefaultServlet])
    context.addServlet(defaultServlet, "/")

    server.start()
    server.join()
  }
}
