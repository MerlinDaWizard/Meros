import {
  AudioPlayer,
  createAudioPlayer,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
  entersState,
} from '@discordjs/voice';
import { Guild, VoiceBasedChannel } from 'discord.js';

interface ConnectionData {
  connection: VoiceConnection;
  player: AudioPlayer;
  channelId: string;
  disconnectTimeout?: NodeJS.Timeout;
}

export class VoiceConnectionManager {
  // previously a map of channelid -> conn data
  // now guild id -> conn data
  private static connections = new Map<string, ConnectionData>();

  static async joinChannel(channel: VoiceBasedChannel) {
    const existingData = this.connections.get(channel.guildId);

    if (existingData) {
      const status = existingData.connection.state.status;

      if (
        status != VoiceConnectionStatus.Destroyed &&
        status != VoiceConnectionStatus.Disconnected &&
        existingData.channelId == channel.id
      ) {
        return existingData;
      }

      try {
        existingData.connection.destroy();
      }
      catch (e) {
        console.warn('Error destroying old connection:', e);
      }
      this.connections.delete(channel.guildId);
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
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

    this.connections.set(channel.guildId, {
      connection,
      player,
      channelId: channel.id,
    });

    return this.connections.get(channel.guildId)!;
  }

  static async leaveChannel(guildId: string) {
    const data = this.connections.get(guildId);
    if (!data) return;

    if (data.disconnectTimeout) clearTimeout(data.disconnectTimeout);
    data.connection.destroy();
    this.connections.delete(guildId);
  }

  static scheduleDisconnect(channel: VoiceBasedChannel) {
    const data = this.connections.get(channel.guildId);
    if (!data || data.channelId != channel.id) {
      return;
    }

    if (!data.disconnectTimeout) {
      data.disconnectTimeout = setTimeout(() => {
        this.leaveChannel(channel.guildId);
      }, 60_000);
    }
    else if (data.disconnectTimeout) {
      clearTimeout(data.disconnectTimeout);
      data.disconnectTimeout = undefined;
    }
  }
}
