package org.example

object CommandHandler {

    private val categories = listOf("Sport", "Technologia", "Muzyka", "Gry")

    private val productsByCategory = mapOf(
        "Sport" to listOf("Piłka nożna", "Rakieta tenisowa", "Hantle"),
        "Technologia" to listOf("Laptop", "Smartfon", "Smartwatch"),
        "Muzyka" to listOf("Gitara", "Słuchawki", "Keyboard"),
        "Gry" to listOf("Gra planszowa", "Konsola", "PC Game")
    )

    fun isBotCommand(message: String): Boolean {
        val trimmed = message.trim()
        return trimmed.equals("!ping", ignoreCase = true) ||
            trimmed.equals("!kategorie", ignoreCase = true) ||
            trimmed.lowercase().startsWith("!produkty")
    }

    fun handle(message: String): String? {
        val trimmed = message.trim()

        return when {
            trimmed.equals("!ping", ignoreCase = true) -> "pong 🏓"

            trimmed.equals("!kategorie", ignoreCase = true) -> buildString {
                append("📂 Dostępne kategorie:\n")
                categories.forEach { append("- $it\n") }
            }.trimEnd()

            trimmed.lowercase().startsWith("!produkty") -> {
                val parts = trimmed.split(" ", limit = 2)
                if (parts.size < 2) {
                    "❌ Podaj kategorię np. `!produkty Sport`"
                } else {
                    val category = parts[1].trim().replaceFirstChar { it.uppercaseChar() }
                    val products = productsByCategory[category]
                    if (products == null) {
                        "❌ Nie znaleziono kategorii: $category"
                    } else {
                        buildString {
                            append("📦 Produkty w kategorii **$category**:\n")
                            products.forEach { append("- $it\n") }
                        }.trimEnd()
                    }
                }
            }

            else -> null
        }
    }
}
