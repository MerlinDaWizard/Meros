import { Discord, Slash } from 'discordx';
import { CommandInteraction } from 'discord.js';

@Discord()
export class PingCommand {
  @Slash({ description: 'Check bot latency' })
  async ping(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({ content: 'Pinging...', withResponse: true });
    const sent = await interaction.fetchReply();
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`Pong! Latency is ${latency}ms.`);
  }
}
