import { ArgsOf, Client, Discord, On } from 'discordx';
import { Events } from 'discord.js';
import { config } from '../config.js';
import { tts } from '../services/tts.js';

@Discord()
export class SpeakPrefixCommand {
  @On({ event: Events.MessageCreate })
  async speakPrefix(
    event: ArgsOf<Events.MessageCreate>,
    _client: Client,
    _guardPayload: any
  ): Promise<void> {
    const message = event[0];
    const msg = message.cleanContent.trim();

    if (!msg.startsWith(config.prefix) || message.guild == null) {
      return;
    }

    const text = msg.slice(config.prefix.length)

    await tts(text, message.member, message?.member?.voice.channel || null, message.guild, message)
  }
}
