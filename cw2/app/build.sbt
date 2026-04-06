val ScalatraVersion = "2.8.2"

ThisBuild / scalaVersion := "2.13.12"
ThisBuild / organization := "com.example"

lazy val hello = (project in file("."))
  .settings(
    name := "app",
    version := "0.1.0-SNAPSHOT",
    assembly / assemblyJarName := "app.jar",
    assembly / mainClass := Some("com.example.app.JettyLauncher"),
    assembly / assemblyMergeStrategy := {
      case PathList("META-INF", "services", _*) => MergeStrategy.concat
      case PathList("META-INF", _*)              => MergeStrategy.discard
      case "module-info.class"                  => MergeStrategy.discard
      case _                                    => MergeStrategy.first
    },
    libraryDependencies ++= Seq(
      "org.scalatra" %% "scalatra" % ScalatraVersion,
      "org.scalatra" %% "scalatra-json" % ScalatraVersion,
      "org.scalatra" %% "scalatra-scalatest" % ScalatraVersion % "test",
      "org.json4s" %% "json4s-jackson" % "4.0.6",
      "org.eclipse.jetty" % "jetty-server" % "9.4.51.v20230217",
      "org.eclipse.jetty" % "jetty-servlet" % "9.4.51.v20230217",
      "ch.qos.logback" % "logback-classic" % "1.5.19" % "runtime"
    )
  )
