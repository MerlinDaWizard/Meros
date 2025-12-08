import {
  Discord,
  Slash,
  SlashOption,
  SimpleCommand,
  SimpleCommandMessage,
  Client,
} from 'discordx';
import { CommandInteraction, EmbedBuilder } from 'discord.js';

const items = [
  'https://external-preview.redd.it/1Ue9d7ASCGBH7RHliUxmiPCEezJyVR3FKAf1rvKnmxM.png?format=pjpg&auto=webp&s=df4ef27f4ff66e659a47e3c5758c749d3030e818',
  'https://cdn.discordapp.com/attachments/406114988504252419/1021553725715796028/Life_has_many_Doors_Boi.png',
  'https://c.tenor.com/tQxuGckzQXgAAAAM/funny-fish.gif',
  'https://c.tenor.com/CqVRl_cYdskAAAAM/puffer-pufferfish.gif',
  'https://cdna.artstation.com/p/assets/images/images/034/519/100/large/clark-smyths-eugh-by-clarksmyth-2.jpg?1612497899&dl=1',
  'https://m.media-amazon.com/images/I/41SpHh6mHYL._AC_SY580_.jpg',
  'https://i.imgflip.com/3vo2lr.jpg?a462096',
  'https://i.imgflip.com/2xater.jpg',
  'https://mystickermania.com/cdn/stickers/spongebob/fred-the-fish-mopping-meme-512x512.png',
  'https://c.tenor.com/DBNZ7PaDzPcAAAAM/you-what-what.gif',
  'https://c.tenor.com/ndyV5-3mkisAAAAM/kissing-kiss.gif',
  'https://c.tenor.com/DlyDKHa4qBYAAAAd/egirlpeaches-fish.gif',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Blobfish-vector.svg/1280px-Blobfish-vector.svg.png',
  'https://poketouch.files.wordpress.com/2017/12/wing_fish_pokemon_finneon.png?w=475',
  'https://sg.portal-pokemon.com/play/resources/pokedex/img/pm/c2dfb5de65a2006c86b077331e71ed15c7c57482.png',
  'https://pngarchive.com/public/uploads/preview/business-cat-png-1001570323952gufzlqid82.png',
  'https://w7.pngwing.com/pngs/592/773/png-transparent-magikarp-fan-art-pokemon-cartoon-pokemon-fictional-character-cartoon-pokemon.png',
  'https://cdn140.picsart.com/322779622266211.png',
  'https://i.kym-cdn.com/photos/images/facebook/002/018/144/1f8.png',
  'https://c.tenor.com/fRSgQqjsltwAAAAC/niko-oneshot.gif',
  'https://media.discordapp.net/attachments/842111076036509737/878454111081758730/image0.gif',
  'https://media.discordapp.net/attachments/530721442820521985/756559092402880612/EPT.gif',
  'https://media.discordapp.net/attachments/809973607245676555/810788415217336350/image0.gif',
  'https://c.tenor.com/otkcxxtw3vUAAAAd/dance-gecko.gif',
  'https://c.tenor.com/Mk4acoRU3isAAAAC/grooving-lizard.gif',
  'https://c.tenor.com/cwIcDsQlXRwAAAAd/jerma-discord.gif',
  'https://media.discordapp.net/attachments/421940818404835338/842392217183584256/SPOILER_walkyboi.gif',
  'https://media.discordapp.net/attachments/716587409332109322/950847995291787304/dclpthh-317e73b6-d935-491e-898d-fcf557520715.gif',
  'https://c.tenor.com/HaHE49a50HsAAAAC/teo-cat.gif',
  'https://media.discordapp.net/attachments/383121955651321866/894774722791890944/image0-1.gif',
  'https://acegif.com/wp-content/uploads/2022/4hv9xm/dancing-duck-acegifcom-37.gif',
  'https://tenor.com/view/duck-duck-dance-subaru-subaru-duck-dance-hey-ya-gif-21217404',
  'https://c.tenor.com/zxqImDlxDEUAAAAC/oneshot-oneshot-niko.gif',
  'https://c.tenor.com/ciLZXfcJfnkAAAAC/molotov-niko-niko.gif',
  'https://c.tenor.com/BDgYcG5-LLIAAAAC/niko-oneshot.gif',
];

@Discord()
export class HelpCommand {
  @Slash({ name: 'help', description: 'List all available commands' })
  async help(interaction: CommandInteraction, client: Client): Promise<void> {
    const embed = this.buildHelpEmbed(client);
    await interaction.reply({ embeds: [embed] });
  }

  private buildHelpEmbed(client: Client): EmbedBuilder {
    const slashCommands = client.applicationCommands;
    const simpleCommands = client.simpleCommands;

    const slashList = slashCommands
      .map(
        (cmd) => `• **/${cmd.name}** – ${cmd.description || 'No description'}`,
      )
      .join('\n');

    const simpleList = simpleCommands
      .map(
        (cmd) => `• **${cmd.name}** – ${cmd.description || 'No description'}`,
      )
      .join('\n');

    const image = items[Math.floor(Math.random() * items.length)];

    return new EmbedBuilder()
      .setColor('#3B82F6')
      .setTitle('Help Menu')
      .setDescription('Here are all available commands:')
      .addFields(
        {
          name: 'Slash Commands',
          value: slashList || 'None registered',
        },
        {
          name: 'Prefix Commands',
          value: simpleList || 'None registered',
        },
        {
          name: 'Prefix',
          value: '`!`',
          inline: true,
        },
      )
      .setTimestamp()
      .setThumbnail(image)
      .setFooter({
        text: 'Bot baddly done by Ekpy',
        iconURL:
          'https://cdn.discordapp.com/attachments/406114988504252419/1021536066878054420/Meros_Artistic.png',
      });
  }
}
