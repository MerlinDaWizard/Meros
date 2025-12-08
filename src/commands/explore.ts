import { Discord, Slash } from 'discordx';
import {
  Collection,
  CommandInteraction,
  EmbedBuilder,
  Message,
  PermissionFlagsBits,
  TextChannel,
} from 'discord.js';

@Discord()
export class DeepExploreCommand {
  private async fetchDeepMessages(
    channel: TextChannel,
    maxMessages = 200,
  ): Promise<Message[]> {
    const messages: Message[] = [];
    let lastId: string | undefined = undefined;

    while (messages.length < maxMessages) {
      const options: { limit: number; before?: string } = { limit: 100 };
      if (lastId) options.before = lastId;

      try {
        const fetched: Collection<string, Message> =
          await channel.messages.fetch(options);
        if (fetched.size === 0) break;

        messages.push(...fetched.values());
        lastId = fetched.last()?.id;
      }
 catch {
        break;
      }
    }

    return messages.slice(0, maxMessages);
  }

  @Slash({ description: 'Explore deep into the ocean of messages' })
  async explore(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    const guild = interaction.guild;
    if (!guild) {
      await interaction.editReply('This command only works in servers.');
      return;
    }

    const me = guild.members.me;
    if (!me) {
      await interaction.editReply('Bot member not found in guild.');
      return;
    }

    // Filter text channels where bot has permissions to read history
    const textChannels = guild.channels.cache.filter(
      (ch) =>
        ch.isTextBased() &&
        !ch.isThread() &&
        ch.viewable &&
        ch
          .permissionsFor(me)
          .has([
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.ViewChannel,
          ]) &&
        ch.type === 0, // text channel only
    ) as Map<string, TextChannel>;

    if (textChannels.size === 0) {
      await interaction.editReply('No accessible text channels found.');
      return;
    }

    const channelsArray = [...textChannels.values()];
    const randomChannel =
      channelsArray[Math.floor(Math.random() * channelsArray.length)];
    const randomDepth = Math.floor(Math.random() * (1000 - 50 + 1)) + 50;

    const messages = await this.fetchDeepMessages(randomChannel, randomDepth);

    if (messages.length === 0) {
      await interaction.editReply('No messages found in deep exploration.');
      return;
    }

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const messageLink = `https://discord.com/channels/${guild.id}/${randomMessage.channelId}/${randomMessage.id}`;

    function isImageUrl(url: string): boolean {
      return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
    }

    const embed = new EmbedBuilder()
      .setTitle('Server Ocean Exploration')
      .setDescription(
        `I dived into the ocean and found this message [View it here](${messageLink})\n\n` +
          `**Author:** [${randomMessage.author.tag}](https://discord.com/users/${randomMessage.author.id})`,
      )
      .setThumbnail(randomMessage.author.displayAvatarURL({ size: 64 }))
      .addFields(
        {
          name: 'Channel',
          value: `<#${randomMessage.channelId}>`,
          inline: true,
        },
        {
          name: 'Message Excerpt',
          value: randomMessage.content
            ? randomMessage.content.length > 1024
              ? randomMessage.content.slice(0, 1021) + '...'
              : randomMessage.content
            : '*No text content*',
        },
      )
      .setColor('#0077cc')
      .setTimestamp(randomMessage.createdAt);

    if (randomMessage.attachments.size > 0) {
      const firstAttachment = randomMessage.attachments.first();
      if (firstAttachment && firstAttachment.contentType?.startsWith('image')) {
        embed.setImage(firstAttachment.url);
      }
    }
 else if (randomMessage.content) {
      const urls = randomMessage.content.match(/(https?:\/\/[^\s]+)/g);
      if (urls && urls.length === 1 && isImageUrl(urls[0])) {
        embed.setImage(urls[0]);
      }
    }
    await interaction.editReply({ embeds: [embed] });
  }
}
