import { tts } from '../services/tts.js'
import {
  ApplicationCommandOptionType,
  type CommandInteraction,
} from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

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

    // await interaction.deferReply();

    const member = await guild.members.fetch(interaction.user.id);
    const voiceChannel = member.voice.channel;

    await tts(text, member, voiceChannel, guild, interaction);
  }
}
