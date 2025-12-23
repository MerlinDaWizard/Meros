import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  type CommandInteraction,
  type MessageActionRowComponentBuilder,
  type StringSelectMenuInteraction,
} from 'discord.js';
import { Discord, SelectMenuComponent, Slash } from 'discordx';
import { UserPreferences } from '../services/UserPreferences.js';

export const VOICE_CHOICES = [
  { label: 'Afrikaans', value: 'af' },
  { label: 'Albanian', value: 'sq' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Catalan', value: 'ca' },
  { label: 'Chinese', value: 'zh' },
  { label: 'Chinese (Mandarin/China)', value: 'zh-cn' },
  { label: 'Chinese (Mandarin/Taiwan)', value: 'zh-tw' },
  { label: 'Chinese (Cantonese)', value: 'zh-yue' },
  { label: 'Croatian', value: 'hr' },
  { label: 'Czech', value: 'cs' },
  { label: 'Danish', value: 'da' },
  { label: 'Dutch', value: 'nl' },
  { label: 'English', value: 'en' },
  { label: 'English (Australia)', value: 'en-au' },
  { label: 'English (United Kingdom)', value: 'en-uk' },
  { label: 'English (United States)', value: 'en-us' },
  { label: 'Esperanto', value: 'eo' },
  { label: 'Finnish', value: 'fi' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Greek', value: 'el' },
  { label: 'Haitian Creole', value: 'ht' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Hungarian', value: 'hu' },
  { label: 'Icelandic', value: 'is' },
  { label: 'Indonesian', value: 'id' },
  { label: 'Italian', value: 'it' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Latin', value: 'la' },
  { label: 'Latvian', value: 'lv' },
  { label: 'Macedonian', value: 'mk' },
  { label: 'Norwegian', value: 'no' },
  { label: 'Polish', value: 'pl' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Portuguese (Brazil)', value: 'pt-br' },
  { label: 'Romanian', value: 'ro' },
  { label: 'Russian', value: 'ru' },
  { label: 'Serbian', value: 'sr' },
  { label: 'Slovak', value: 'sk' },
  { label: 'Spanish', value: 'es' },
  { label: 'Spanish (Spain)', value: 'es-es' },
  { label: 'Spanish (United States)', value: 'es-us' },
  { label: 'Swahili', value: 'sw' },
  { label: 'Swedish', value: 'sv' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Thai', value: 'th' },
  { label: 'Turkish', value: 'tr' },
  { label: 'Vietnamese', value: 'vi' },
  { label: 'Welsh', value: 'cy' },
];
@Discord()
export class SetVoiceCommand {
  @SelectMenuComponent({ id: /^voices-menu-\d+$/ })
  async handle(interaction: StringSelectMenuInteraction): Promise<void> {
    const voiceValue = interaction.values[0];
    const match = VOICE_CHOICES.find((v) => v.value === voiceValue);

    if (!match) {
      await interaction.reply('Invalid selection. Somehow. Blame my creator');
      return;
    }

    await UserPreferences.setVoice(interaction.user.id, voiceValue);

    await interaction.message.edit({
      content: `You have selected voice: \`${match.label}\``,
      components: [],
    });
  }

  @Slash({
    description: 'Lists of voices to be used in Speak commands',
    name: 'setvoice',
  })
  async setvoice(interaction: CommandInteraction): Promise<void> {
    // chunk into groups of 25
    const chunk = <T>(arr: T[], size: number): T[][] =>
      Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size),
      );

    const pages = chunk(VOICE_CHOICES, 25);

    const rows = pages.map((page, index) =>
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .addOptions(page)
          .setCustomId(`voices-menu-${index}`)
          .setPlaceholder(`Select voice (page ${index + 1})`),
      ),
    );

    await interaction.reply({
      content: 'Select your voice:',
      components: rows,
    });
  }
}
