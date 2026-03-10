import java.sql.DriverManager

fun main() {

    println("Hello World from Kotlin + Java 8 + Gradle")

    val url = "jdbc:sqlite:test.db"

    DriverManager.getConnection(url).use { conn ->

        val stmt = conn.createStatement()

        stmt.execute(
            "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT)"
        )

        stmt.execute("INSERT INTO users(name) VALUES('Kotlin User')")

        val rs = stmt.executeQuery("SELECT * FROM users")

        while (rs.next()) {
            println("User: " + rs.getString("name"))
        }
    }
}
