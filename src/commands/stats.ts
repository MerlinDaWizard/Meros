import { Discord, Slash } from 'discordx';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import os from 'os';

@Discord()
export class StatsCommand {
  @Slash({ description: 'Show bot stats' })
  async stats(interaction: CommandInteraction): Promise<void> {
    const uptimeSeconds = process.uptime();
    const uptime = this.formatUptime(uptimeSeconds);

    const memoryUsage = process.memoryUsage();
    const rss = (memoryUsage.rss / 1024 / 1024).toFixed(2); // MB
    const heapUsed = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);

    const cpuModel = os.cpus()[0].model;
    const cpuCores = os.cpus().length;

    const totalMemMB = (os.totalmem() / 1024 / 1024).toFixed(0);
    const freeMemMB = (os.freemem() / 1024 / 1024).toFixed(0);

    // Discord client from interaction
    const client = interaction.client;

    // Count total users across all guilds
    const totalUsers = client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0,
    );

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle(' Bot Stats ')
      .setDescription('```ansi\n' + this.getAnsiArt() + '```')
      .addFields(
        { name: 'Bot', value: `${client.user?.tag}`, inline: true },
        { name: 'Uptime', value: uptime, inline: true },
        { name: 'Guilds', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Users', value: `${totalUsers}`, inline: true },
        { name: 'Node.js', value: process.version, inline: true },
        {
          name: 'CPU',
          value: `${cpuModel} (${cpuCores} cores)`,
          inline: false,
        },
        {
          name: 'Memory',
          value: `RSS: ${rss} MB\nHeap Used: ${heapUsed} MB\nSystem Mem: ${freeMemMB}/${totalMemMB} MB Free`,
          inline: false,
        },
      )
      .setFooter({ text: 'ChatGPT go brrrrrrrrrrrrr • Powered by discordx' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  private formatUptime(seconds: number): string {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
  }

  private getAnsiArt(): string {
    return `
 ███████████                       █████      ███
░░███░░░░░███                     ░░███      ░███
 ░███    ░███ ████████  █████ ████ ░███████  ░███
 ░██████████ ░░███░░███░░███ ░███  ░███░░███ ░███
 ░███░░░░░███ ░███ ░░░  ░███ ░███  ░███ ░███ ░███
 ░███    ░███ ░███      ░███ ░███  ░███ ░███ ░░░ 
 ███████████  █████     ░░████████ ████ █████ ███
░░░░░░░░░░░  ░░░░░       ░░░░░░░░ ░░░░ ░░░░░ ░░░                                            
`;
  }
}
