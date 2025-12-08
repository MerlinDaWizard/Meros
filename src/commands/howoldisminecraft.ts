import {
  ApplicationCommandOptionType,
  CommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export class MinecraftAgeCommand {
  @Slash({ description: 'Check how old a Minecraft version is' })
  async howoldisminecraft(
    @SlashOption({
      name: 'version',
      description: 'Minecraft version (e.g., 1.20.1, 1.8.9, 23w31a)',
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    versionInput: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.deferReply();

    const manifestUrl =
      'https://launchermeta.mojang.com/mc/game/version_manifest.json';

    const manifestReq = await fetch(manifestUrl);

    if (!manifestReq.ok) {
      await interaction.editReply('Failed to fetch Mojang version manifest.');
      return;
    }

    const manifest = await manifestReq.json();

    const version = manifest.versions.find(
      (v: any) => v.id.toLowerCase() === versionInput.toLowerCase(),
    );

    if (!version) {
      await interaction.editReply(
        `No version found named **${versionInput}**.`,
      );
      return;
    }

    if (!version.releaseTime) {
      await interaction.editReply(
        `Version **${versionInput}** does not have release time.`,
      );
      return;
    }

    const releaseDate = new Date(version.releaseTime);
    const now = new Date();
    const diff = now.getTime() - releaseDate.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);

    const ageText =
      years > 0
        ? `${years} years, ${months} months (${days} days)`
        : `${months} months (${days} days)`;

    const embed = new EmbedBuilder()
      .setColor('#3C8527')
      .setTitle(`Minecraft Version: ${version.id}`)
      .addFields(
        {
          name: 'Release Date',
          value: releaseDate.toDateString(),
          inline: true,
        },
        { name: 'Age', value: ageText, inline: true },
        { name: 'Type', value: version.type, inline: true },
      )
      .setThumbnail(
        'https://static.wikia.nocookie.net/minecraft_gamepedia/images/5/5f/Grass_Block_JE3_BE3.png',
      ) // nice Minecraft block art
      .setFooter({ text: 'Data from Mojang Launcher Manifest' });

    await interaction.editReply({ embeds: [embed] });
  }
}
