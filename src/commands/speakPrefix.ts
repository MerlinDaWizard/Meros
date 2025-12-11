import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx';
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} from '@discordjs/voice';
import gTTS from 'gtts';
import { Readable } from 'stream';
import { UserPreferences } from '../services/UserPreferences.js';
import { VoiceConnectionManager } from '../managers/voiceConnectionManager.js';

@Discord()
export class SpeakPrefixCommand {
  @SimpleCommand({
    description: 'The speak command, but not a slash command',
    aliases: ['s'],
  })
  async speakPrefix(command: SimpleCommandMessage): Promise<void> {
    const { message, argString } = command;

    const text = argString.trim();
    if (!text) {
      await message.reply('Provide text: `! hello world`');
      return;
    }

    const member = message.member;
    if (!member || !member.voice.channel) {
      await message.reply('Join a voice channel first.');
      return;
    }
    const voiceChannel = member.voice.channel;

    let connectionData;
    try {
      connectionData = await VoiceConnectionManager.joinChannel(voiceChannel);
    }
 catch (error) {
      await message.reply('Failed to join your voice channel.');
      return;
    }

    const voice = UserPreferences.getVoice(member.user.id) ?? 'en';
    const gtts = new gTTS(text, voice);
    const resource = createAudioResource(gtts.stream() as Readable);

    connectionData.player.play(resource);

    await message.reply(`${member.user.username}: \`${text}\``);
  }
}
