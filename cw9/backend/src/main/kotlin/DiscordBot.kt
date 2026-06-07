package org.example

import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.JDABuilder
import net.dv8tion.jda.api.requests.GatewayIntent
import net.dv8tion.jda.api.utils.cache.CacheFlag

class DiscordBot private constructor(
    private val jda: JDA,
    private val channelId: String?
) {
    fun sendMessage(content: String): Boolean {
        val channel = channelId?.let { jda.getTextChannelById(it) }
            ?: jda.guilds.firstOrNull()?.textChannels?.firstOrNull()

        return if (channel != null) {
            channel.sendMessage(content).queue()
            true
        } else {
            println("Nie znaleziono kanału Discord do wysłania wiadomości.")
            false
        }
    }

    companion object {
        fun start(token: String, channelId: String?): DiscordBot? {
            return try {
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

                jda.awaitReady()
                println("Bot Discord uruchomiony jako ${jda.selfUser.name}")
                DiscordBot(jda, channelId)
            } catch (e: Exception) {
                println("Nie udało się uruchomić bota Discord: ${e.message}")
                null
            }
        }
    }
}
