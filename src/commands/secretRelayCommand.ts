import { Client, Discord, SimpleCommand, SimpleCommandMessage } from 'discordx';
import { ChannelType, TextChannel } from 'discord.js';
import { config } from '../config.js'

@Discord()
export class SecretRelayCommand {
  @SimpleCommand({ directMessage: true })
  async sayToChannel(command: SimpleCommandMessage, client: Client) {
    if (
      command.message.channel.type !== ChannelType.DM ||
      command.message.author.id !== config.creatorId
    ) {
      return;
    }

    const commandNameLength = command.prefix.length + command.name.length;
    const rawArgs = command.message.content.slice(commandNameLength).trim();

    if (!rawArgs) {
      await command.message.channel.send(
        'Usage: !sayToChannel <channelId> <message>\nExample: !sayToChannel 123456789012345678 Hello!',
      );
      return;
    }

    const firstSpaceIndex = rawArgs.indexOf(' ');
    if (firstSpaceIndex === -1) {
      await command.message.channel.send(
        'Please provide a channel ID followed by a message.',
      );
      return;
    }

    const channelId = rawArgs.slice(0, firstSpaceIndex);
    const messageToSend = rawArgs.slice(firstSpaceIndex + 1).trim();

    if (!messageToSend) {
      await command.message.channel.send('Message cannot be empty.');
      return;
    }

    try {
      const channel = await client.channels.fetch(channelId);

      if (!channel || channel.type !== ChannelType.GuildText) {
        await command.message.channel.send(
          'Invalid channel ID or channel is not a text channel.',
        );
        return;
      }

      await (channel as TextChannel).send(messageToSend);

      await command.message.channel.send(
        `Message sent to <#${channelId}> successfully!`,
      );
    }
    catch (error) {
      console.error(error);
      await command.message.channel.send(
        'Failed to send message. Check channel ID and bot permissions.',
      );
    }
  }
}
