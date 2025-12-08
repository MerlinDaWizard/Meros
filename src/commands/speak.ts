import gTTS from 'gtts';
import { Readable } from 'stream';
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import {
  ApplicationCommandOptionType,
  GuildMember,
  SlashCommandBuilder,
  type CommandInteraction,
} from 'discord.js';
import { Discord, Slash, SlashChoice, SlashOption } from 'discordx';
import { VoiceConnectionManager } from '../managers/voiceConnectionManager';
import { UserPreferences } from '../services/UserPreferences';

@Discord()
export class SpeakSlashCommand {
  @Slash({ description: 'Speak with GoogleTTs' })
  async speak(
    @SlashOption({
      description: 'text',
      name: 'text',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    text: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    const guild = interaction.guild;
    if (!guild) {
      await interaction.reply('This command can only be used in a server.');
      return;
    }

    await interaction.deferReply();

    const member = await guild.members.fetch(interaction.user.id);
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      await interaction.reply(
        'You need to be in a voice channel to use this command.',
      );
      return;
    }

    let connectionData;
    try {
      connectionData = await VoiceConnectionManager.joinChannel(voiceChannel);
    }
 catch (error) {
      await interaction.editReply('Failed to join your voice channel.');
      return;
    }

    const voice = UserPreferences.getVoice(interaction.user.id) ?? 'en';
    const gtts = new gTTS(text, voice);
    const resource = createAudioResource(gtts.stream() as Readable);

    connectionData.player.play(resource);

    await interaction.editReply(`${interaction.user.username}: \`${text}\``);
  }
}
