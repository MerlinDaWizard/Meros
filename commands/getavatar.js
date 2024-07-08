const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Get Avatar')
        .setType(ApplicationCommandType.User),
	async execute(interaction) {
        await interaction.reply({
            content: `${interaction.targetUser.displayAvatarURL()}`,
        });
	},
};