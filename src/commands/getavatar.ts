import {
  ApplicationCommandType,
  type MessageContextMenuCommandInteraction,
  type UserContextMenuCommandInteraction,
} from 'discord.js';
import { ContextMenu, Discord } from 'discordx';

@Discord()
export class GetAvatarContext {
  @ContextMenu({ name: 'user avatar', type: ApplicationCommandType.User })
  async useravatar(
    interaction: UserContextMenuCommandInteraction,
  ): Promise<void> {
    await interaction.reply({
      content: `${interaction.targetUser.displayAvatarURL()}`,
    });
  }
}
