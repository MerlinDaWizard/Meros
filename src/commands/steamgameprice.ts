import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  type CommandInteraction,
} from 'discord.js';
import { Discord, Slash, SlashChoice, SlashOption } from 'discordx';

@Discord()
export class SteamGamePriceCommand {
  @Slash({ description: 'Check the Steam game price of a game' })
  async whatisgamecost(
    @SlashChoice({ name: 'Oneshot', value: '420530' })
    @SlashChoice({ name: 'Celeste', value: '504230' })
    @SlashChoice({ name: 'Hollow Knight', value: '367520' })
    @SlashChoice({ name: 'Hollow Knight: Silksong', value: '1030300' })
    @SlashChoice({ name: 'Half-Life 2', value: '220' })
    @SlashOption({
      description: 'Select a game',
      name: 'game',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    gameId: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.deferReply();

    const res = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${gameId}`,
    );
    const json = await res.json();

    const game = json[gameId].data;
    const price = game.price_overview;

    const isDiscounted = price.discount_percent > 0;

    const embed = new EmbedBuilder()
      .setTitle(game.name)
      .setThumbnail(
        `https://cdn.cloudflare.steamstatic.com/steam/apps/${gameId}/capsule_231x87.jpg`,
      )
      .setURL(`https://store.steampowered.com/app/${gameId}`)
      .addFields(
        {
          name: 'Price',
          value: isDiscounted
            ? `**${price.final_formatted}** *(~~${price.initial_formatted}~~)*`
            : `**${price.final_formatted}**`,
          inline: true,
        },
        {
          name: 'Discount',
          value: isDiscounted
            ? `**${price.discount_percent}% OFF**`
            : 'No discount',
          inline: true,
        },
      )
      .setColor(isDiscounted ? 0x33cc33 : 0x5865f2)
      .setFooter({
        text: 'Steam Store • Live Price Info',
      });

    await interaction.editReply({ embeds: [embed] });
  }
}
