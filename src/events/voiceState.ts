import {
  AudioPlayer,
  getVoiceConnections,
  VoiceConnection,
} from '@discordjs/voice';
import {
  Client,
  Events,
  VoiceState,
  GuildMember,
  VoiceChannel,
} from 'discord.js';
import { ArgsOf, Discord, On } from 'discordx';
import { VoiceConnectionManager } from '../managers/voiceConnectionManager';

@Discord()
export class VoiceStateHandler {
  @On({ event: Events.VoiceStateUpdate })
  async voiceStateUpdate(
    [oldstate, newState]: ArgsOf<Events.VoiceStateUpdate>,
    client: Client,
  ) {
    const channel = oldstate.channel ?? newState.channel;
    if (!channel) {
      return;
    }

    if (
      channel.members.filter((m) => !m.user.bot).size == 0 &&
      channel.members.some((m) => m.id == client.user?.id)
    ) {
      VoiceConnectionManager.scheduleDisconnect(channel);
    }
  }
}
