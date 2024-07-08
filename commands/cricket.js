/* eslint-disable no-inline-comments */
const { SlashCommandBuilder } = require('discord.js');
// eslint-disable-next-line no-unused-vars
const { createAudioPlayer, joinVoiceChannel, AudioPlayerStatus, NoSubscriberBehavior, createAudioResource, generateDependencyReport, getVoiceConnection } = require('@discordjs/voice');
const gTTS = require('gtts');
const path = require('path');
const fs = require('fs');
const {createReadStream } = require('fs')

const pathData = path.join(__dirname, '..', 'data', 'cricket.mp3');

let leaveTimer = null;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cricket')
		.setDescription('For when a joke does not land'),
	async execute(interaction) {
		// Get voice channel id and check if they are in one
		const voiceChannel = interaction.member.voice.channelId;
		if (!voiceChannel) {
			await interaction.reply('Please join a voice channel.'); 
			return;
		}

		// Create voiceConnection
		const VoiceConnection = joinVoiceChannel({
			channelId: voiceChannel, // the voice channel's id
			guildId: interaction.guildId, // the guild that the channel is in
			adapterCreator: interaction.guild.voiceAdapterCreator, // and setting the voice adapter creator
		});
		/* gtts.save(absolutePath, function (err, result){
			if(err) { throw new Error(err); }
			console.log("\""+speech+"\""+" Converted!");
		});*/

		const audioPlayer = createAudioPlayer();
		const resource = createAudioResource(createReadStream(pathData));

		audioPlayer.on(AudioPlayerStatus.Playing, () => {
			console.log('Cricket Cricket Cricket');
				// clear timer before set
				try {
					clearTimeout(leaveTimer);
				}
				catch (e) {
					console.log('Theres no leaveTimer');
				}
		});

		audioPlayer.on(AudioPlayerStatus.Idle, () => {
			leaveTimer = setTimeout(() => {
            interaction.channel.send('Idling too long bye. :wave: ');
			VoiceConnection.disconnect();
			},  5 * 1000);
		});

		audioPlayer.on('error', error => {
			console.error('Error:', error.message, 'with track', error.resource.metadata.title);
		});
        
		VoiceConnection.subscribe(audioPlayer);
		// play the song resource
		audioPlayer.play(resource);

		await interaction.reply(':cricket: :cricket: :cricket: ');
	},
};
