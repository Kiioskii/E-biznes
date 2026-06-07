package org.example

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation as ClientContentNegotiation
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation as ServerContentNegotiation
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

@Serializable
data class ChatRequest(val message: String)

@Serializable
data class ChatResponse(val reply: String)

@Serializable
data class DiscordPayload(val content: String)

fun main() {
    val servicesUrl = System.getenv("SERVICES_URL") ?: "http://services:8000"
    val discordToken = System.getenv("DISCORD_TOKEN")
    val discordChannelId = System.getenv("DISCORD_CHANNEL_ID")
    val webhookUrl = System.getenv("DISCORD_WEBHOOK_URL")

    val discordBot = if (!discordToken.isNullOrBlank()) {
        DiscordBot.start(discordToken, discordChannelId)
    } else {
        println("DISCORD_TOKEN nie ustawiony — bot Discord nie zostanie uruchomiony.")
        null
    }

    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        install(ServerContentNegotiation) {
            json()
        }
        install(CORS) {
            allowHost("localhost:5173")
            allowHost("127.0.0.1:5173")
            allowHost("localhost:5174")
            allowHost("127.0.0.1:5174")
            allowHeader(HttpHeaders.ContentType)
            allowMethod(HttpMethod.Options)
            allowMethod(HttpMethod.Post)
            allowMethod(HttpMethod.Get)
        }

        val client = HttpClient(CIO) {
            install(ClientContentNegotiation) {
                json()
            }
        }

        routing {
            get("/health") {
                call.respond(
                    mapOf(
                        "status" to "ok",
                        "discordBot" to (discordBot != null)
                    )
                )
            }

            post("/api/chat") {
                val request = call.receive<ChatRequest>()

                if (request.message.isBlank()) {
                    call.respond(
                        HttpStatusCode.BadRequest,
                        ChatResponse("Wiadomość nie może być pusta.")
                    )
                    return@post
                }

                try {
                    val response = client.post("$servicesUrl/chat") {
                        contentType(ContentType.Application.Json)
                        setBody(request)
                    }

                    if (!response.status.isSuccess()) {
                        call.respond(
                            HttpStatusCode.BadGateway,
                            ChatResponse("Serwis AI zwrócił błąd: ${response.status}")
                        )
                        return@post
                    }

                    call.respond(response.body<ChatResponse>())
                } catch (e: Exception) {
                    call.respond(
                        HttpStatusCode.BadGateway,
                        ChatResponse("Nie udało się połączyć z serwisem AI: ${e.message}")
                    )
                }
            }

            post("/api/discord") {
                val request = call.receive<ChatRequest>()

                if (request.message.isBlank()) {
                    call.respond(
                        HttpStatusCode.BadRequest,
                        ChatResponse("Wiadomość nie może być pusta.")
                    )
                    return@post
                }

                val botReply = CommandHandler.handle(request.message)
                val reply = botReply ?: "Wiadomość wysłana na Discord."

                val sentViaBot = discordBot?.let { bot ->
                    bot.sendMessage("📩 Z frontu: ${request.message}")
                    botReply?.let { bot.sendMessage("🤖 Bot: $it") }
                    true
                } ?: false

                if (!sentViaBot) {
                    if (webhookUrl.isNullOrBlank()) {
                        call.respond(
                            HttpStatusCode.InternalServerError,
                            ChatResponse(
                                if (botReply != null) {
                                    botReply
                                } else {
                                    "Skonfiguruj DISCORD_TOKEN lub DISCORD_WEBHOOK_URL."
                                }
                            )
                        )
                        return@post
                    }

                    try {
                        val response = client.post(webhookUrl) {
                            contentType(ContentType.Application.Json)
                            setBody(DiscordPayload("📩 Z frontu: ${request.message}"))
                        }

                        if (!response.status.isSuccess()) {
                            call.respond(
                                HttpStatusCode.BadGateway,
                                ChatResponse("Discord zwrócił błąd: ${response.status}")
                            )
                            return@post
                        }

                        botReply?.let {
                            client.post(webhookUrl) {
                                contentType(ContentType.Application.Json)
                                setBody(DiscordPayload("🤖 Bot: $it"))
                            }
                        }
                    } catch (e: Exception) {
                        call.respond(
                            HttpStatusCode.BadGateway,
                            ChatResponse("Nie udało się wysłać wiadomości na Discord: ${e.message}")
                        )
                        return@post
                    }
                }

                call.respond(ChatResponse(reply))
            }
        }
    }.start(wait = true)
}
