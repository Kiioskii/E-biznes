package org.example

import net.dv8tion.jda.api.JDABuilder
import net.dv8tion.jda.api.hooks.ListenerAdapter
import net.dv8tion.jda.api.events.message.MessageReceivedEvent

class Bot : ListenerAdapter() {

    private val categories = listOf(
        "Sport",
        "Technologia",
        "Muzyka",
        "Gry"
    )
    private val productsByCategory = mapOf(
        "Sport" to listOf("Piłka nożna", "Rakieta tenisowa", "Hantle"),
        "Technologia" to listOf("Laptop", "Smartfon", "Smartwatch"),
        "Muzyka" to listOf("Gitara", "Słuchawki", "Keyboard"),
        "Gry" to listOf("Gra planszowa", "Konsola", "PC Game")
    )

    override fun onMessageReceived(event: MessageReceivedEvent) {
        if (event.author.isBot) return

        val message = event.message.contentRaw
        println("Odebrano: $message")

        when {
            message.equals("!ping", ignoreCase = true) -> {
                event.channel.sendMessage("pong 🏓").queue()
            }

            message.equals("!kategorie", ignoreCase = true) -> {
                val response = buildString {
                    append("📂 Dostępne kategorie:\n")
                    categories.forEach { append("- $it\n") }
                }
                event.channel.sendMessage(response).queue()
            }

            message.lowercase().startsWith("!produkty") -> {
                val parts = message.split(" ", limit = 2)
                if (parts.size < 2) {
                    event.channel.sendMessage("❌ Podaj kategorię np. `!produkty Sport`").queue()
                    return
                }

                val category = parts[1].trim().capitalize()
                val products = productsByCategory[category]

                if (products == null) {
                    event.channel.sendMessage("❌ Nie znaleziono kategorii: $category").queue()
                } else {
                    val response = buildString {
                        append("📦 Produkty w kategorii **$category**:\n")
                        products.forEach { append("- $it\n") }
                    }
                    event.channel.sendMessage(response).queue()
                }
            }
        }
    }
}
