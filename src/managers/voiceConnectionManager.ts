import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
  entersState,
} from '@discordjs/voice';
import { VoiceBasedChannel, Guild, GuildMember } from 'discord.js';

interface ConnectionData {
  connection: VoiceConnection;
  player: AudioPlayer;
  channelId: string;
  disconnectTimeout?: NodeJS.Timeout;
}

export class VoiceConnectionManager {
  private static connections = new Map<string, ConnectionData>();

  static async joinChannel(channel: VoiceBasedChannel) {
    const channelId = channel.id;

    const existingData = this.connections.get(channelId);

    if (existingData) {
      const status = existingData.connection.state.status;

      if (
        status != VoiceConnectionStatus.Destroyed &&
        status != VoiceConnectionStatus.Disconnected
      ) {
        return existingData;
      }

      try {
        await existingData.connection.destroy();
      }
 catch (e) {
        console.warn('Error destroying old connection:', e);
      }
      this.connections.delete(channelId);
    }

    const connection = joinVoiceChannel({
      channelId: channelId,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 10_000);
    }
 catch {
      connection.destroy();
      throw new Error('Failed to connect to the voice channel.');
    }

    const player = createAudioPlayer();

    connection.subscribe(player);

    this.connections.set(channelId, {
      connection,
      player,
      channelId: channel.id,
    });

    return this.connections.get(channelId)!;
  }

  static async leaveChannel(channelId: string) {
    const data = this.connections.get(channelId);
    if (!data) return;

    if (data.disconnectTimeout) clearTimeout(data.disconnectTimeout);
    data.connection.destroy();
    this.connections.delete(channelId);
  }

  static scheduleDisconnect(channel: VoiceBasedChannel) {
    const data = this.connections.get(channel.id);
    if (!data) {
      return;
    }

    if (!data.disconnectTimeout) {
      data.disconnectTimeout = setTimeout(() => {
        this.leaveChannel(channel.id);
      }, 60_000);
    }
 else if (data.disconnectTimeout) {
      clearTimeout(data.disconnectTimeout);
      data.disconnectTimeout = undefined;
    }
  }
}
