package com.example.app

import org.eclipse.jetty.server.Server
import org.eclipse.jetty.servlet.{DefaultServlet, ServletContextHandler, ServletHolder}

object JettyLauncher {
  def main(args: Array[String]): Unit = {
    val port = if (System.getenv("PORT") != null) System.getenv("PORT").toInt else 8080
    val server = new Server(port)

    val context = new ServletContextHandler(ServletContextHandler.SESSIONS)
    context.setContextPath("/")
    server.setHandler(context)

    // Mount Scalatra servlets
    context.addServlet(new ServletHolder(new ProductController), "/*")


    // Default servlet for static content
    val defaultServlet = new ServletHolder("default", classOf[DefaultServlet])
    context.addServlet(defaultServlet, "/")

    server.start()
    server.join()
  }
}
