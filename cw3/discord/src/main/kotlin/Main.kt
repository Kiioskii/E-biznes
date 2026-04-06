package org.example

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.http.*
import kotlinx.serialization.Serializable
import kotlinx.coroutines.runBlocking
import net.dv8tion.jda.api.JDABuilder
import net.dv8tion.jda.api.requests.GatewayIntent
import net.dv8tion.jda.api.utils.cache.CacheFlag


@Serializable
data class DiscordMessage(
    val content: String
)

fun main() = runBlocking {

    val webhookUrl = "https://discord.com/api/webhooks/1490426069839380551/rEFR2iADaRWC1FNtn1uljjJMMJ6q3e5tVMGhwgU_cswD2irGRo0wcDpDFRc-ba7RVKIJ"

    val client = HttpClient(CIO) {
        install(ContentNegotiation) {
            json()
        }
    }

    try {
        client.post(webhookUrl) {
            contentType(ContentType.Application.Json)
            setBody(DiscordMessage("Hej 👋 wiadomość z Ktor!"))
        }

        println("Wiadomość wysłana na Discord!")

        val token = System.getenv("DISCORD_TOKEN")

        val jda = JDABuilder.createDefault(
            token,
            GatewayIntent.GUILD_MESSAGES,
            GatewayIntent.MESSAGE_CONTENT
        ).disableCache(
            CacheFlag.VOICE_STATE,
            CacheFlag.EMOJI,
            CacheFlag.STICKER,
            CacheFlag.SCHEDULED_EVENTS
        ).addEventListeners(Bot())
            .build()

        println("Bot uruchomiony!")

    } catch (e: Exception) {
        println("Błąd: ${e.message}")
    } finally {
        client.close()
    }
}
