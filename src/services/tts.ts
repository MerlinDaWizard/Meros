import gTTS from 'gtts';
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { VoiceConnectionManager } from '../managers/voiceConnectionManager.js';
import { CacheType, CommandInteraction, Guild, GuildMember, Message, VoiceBasedChannel } from 'discord.js';
import { UserPreferences } from './UserPreferences.js';
import { Readable } from 'stream';
import { config } from '../config.js';

type ReplyTarget =
  | Message<boolean>
  | CommandInteraction<CacheType>;

export async function tts(text: string, user: GuildMember | null, voiceChannel: VoiceBasedChannel | null, guild: Guild | null, replyTarget: ReplyTarget) {
  if (!guild || !user) {
    await replyTarget.reply("This command can only be used in a guild.")
    return;
  }

  if (!voiceChannel) {
    await replyTarget.reply("You must be in a voice channel to use this command.")
    return;
  }

  const trimmed_text = text.trim();

  if (trimmed_text.length == 0) {
    await replyTarget.reply(`Provide text:\`${config.prefix} hello world\``)
  }

  let connectionData;
  try {
    connectionData = await VoiceConnectionManager.joinChannel(voiceChannel)
  } catch (e) {
    await replyTarget.reply("Failed to join your voice channel.")
    return;
  }

  const voice = await UserPreferences.getVoice(user.id);
  const gtts = new gTTS(trimmed_text, voice);
  const resource = createAudioResource(gtts.stream() as Readable);

  connectionData.player.play(resource);

  await replyTarget.reply(`${user.user.username}: \`${trimmed_text}\``)
}
