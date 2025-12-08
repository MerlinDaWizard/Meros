import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx';
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} from '@discordjs/voice';
import gTTS from 'gtts';
import { UserPreferences } from '../services/UserPreferences';
import { Readable } from 'stream';

@Discord()
export class SpeakWildcardCommand {
  @SimpleCommand({
    description: 'The speak command, but not a slash command',
    aliases: ['*'],
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

    const preferredVoice = UserPreferences.getVoice(message.author.id) ?? 'en';

    const gtts = new gTTS(text, preferredVoice);

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    const audioPlayer = createAudioPlayer();
    const resource = createAudioResource(gtts.stream() as Readable);

    audioPlayer.on(AudioPlayerStatus.Playing, () => {
      console.log('Speaking:', text);
    });

    audioPlayer.on('error', (e) => console.error(e));

    connection.subscribe(audioPlayer);
    audioPlayer.play(resource);

    await message.reply(`Speaking using voice \`${preferredVoice}\`: ${text}`);
  }
}
