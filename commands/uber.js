/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-inline-comments */
const { SlashCommandBuilder } = require('discord.js');
// eslint-disable-next-line no-unused-vars
const { createAudioPlayer, joinVoiceChannel, AudioPlayerStatus, NoSubscriberBehavior, createAudioResource, generateDependencyReport } = require('@discordjs/voice');
// const path = require('path');
// const fs = require('fs');
const axios = require('axios');
const { uberDuckAPIPublic, uberDuckAPISecret } = require('../config.json');

let leaveTimer = null;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uber')
		.setDescription('Get Uberduck DeepFake TTS to say what you want')
		.addStringOption(option =>
			option.setName('text')
				.setDescription('Here is what to say!')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('voice')
				.setDescription('Whos voice to copy')
				.setRequired(true)
				.addChoices(
					{ name: 'Eminem', value: 'eminem' },
					{ name: '3 Kliks Philip', value: '3kliksphilip' },
					{ name: 'Albert Einstein', value: 'albert-einstein' },
					{ name: 'Duke Nukem', value: 'duke-nukem' },
					{ name: 'Kanye', value: 'kanye-west-rap' },
				)),	
			
	async execute(interaction) {
		await interaction.deferReply();

		const text = interaction.options.getString('text');
		const voice = interaction.options.getString('voice');

		// =========Uber API stuff
		let uberId;
		await axios
		.post('https://api.uberduck.ai/speak', {
			speech: text,
			voice: voice,
		}, {
			auth: {
			  username: uberDuckAPIPublic,
			  password: uberDuckAPISecret,
			} })
		.then(res => {
		  console.log(res.data);
		  uberId = res.data.uuid;
		})
		.catch(error => {
		  console.error(error);
		});
		
		// console.log(uberId);
		const linkUber = 'https://api.uberduck.ai/speak-status?uuid=' + uberId;
		let poll = true;
		let link;
		while (poll) {
			let hadErr = false;
			console.log('requesting...');
			await axios.get(linkUber, { timeout: 5000 })
				.then(function(response) {
					// console.log(response.data); // This will sometime be empty
					if (response.data.finished_at != null) {
						console.log(response.data);
						poll = false;
						link = response.data.path;
					}
				})
				.catch(function(error) {
					console.log('People we have an error!', error);
					hadErr = true;
				});
			if (hadErr) {
				// break out of the loop in case of error
				// maybe in a real live situation we could do something here*
				break;
			}
		}
		if (link == null) {
			await interaction.editReply('Error in creating UberDuck sound. Try again later');
			return; 
		}
		// console.log(generateDependencyReport());

		// Get voice channel id and check if they are in one
		const voiceChannel = interaction.member.voice.channelId;
		if (!voiceChannel) {
			await interaction.editReply('Please join a voice channel.'); 
			return;
		}

		// ========= Discord Voice Parts
		// Create voiceConnection
		const VoiceConnection = joinVoiceChannel({
			channelId: voiceChannel, // the voice channel's id
			guildId: interaction.guildId, // the guild that the channel is in
			adapterCreator: interaction.guild.voiceAdapterCreator, // and setting the voice adapter creator
		});

		const audioPlayer = createAudioPlayer();
		const resource = createAudioResource(link);


		// ==========Events
		audioPlayer.on(AudioPlayerStatus.Playing, () => {
			console.log('The audio player is playing uber : ', voice, 'is saying', text);
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
			}, 2 * 60 * 1000);
		});

		audioPlayer.on('error', error => {
			console.error('Error:', error.message, 'with track', error.resource.metadata.title);
		});


		VoiceConnection.subscribe(audioPlayer);
		// play the song resource
		audioPlayer.play(resource);

		await interaction.editReply(voice + ': `' + text + '`');
	},
};
