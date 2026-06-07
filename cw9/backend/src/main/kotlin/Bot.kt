package org.example

import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter

class Bot : ListenerAdapter() {

    override fun onMessageReceived(event: MessageReceivedEvent) {
        if (event.author.isBot) return

        val message = event.message.contentRaw
        println("Discord: odebrano '$message'")

        val response = CommandHandler.handle(message) ?: return
        event.channel.sendMessage(response).queue()
    }
}
