const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType, inlineCode, codeBlock } = require('discord.js');

const fs = require('fs');
const path = require('path');
const { pathToQouteData } = require('../config.json');
const stringSimilarity = require('string-similarity');
const pathData = path.join(__dirname, '..', pathToQouteData);
const rawdata = fs.readFileSync(pathData);
const dataJson = JSON.parse(rawdata);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('qoute')
    .setDescription('Play the qoute game'),
  async execute(interaction) {

     //console.log(dataJson);

    const keys = Object.keys(dataJson);
    let threeKeys = keys.sort(() => 0.5 - Math.random()).slice(0, 3);
    let threeMessages = [];
    threeKeys.forEach(element => {
      threeMessages.push(dataJson[element]);
    });
    let notUnique = true;
    // Check if the qoutee part has any same names, if so, then get a new one
    while (notUnique) {
      notUnique = false;
      threeMessages.forEach(element => {
        threeMessages.forEach(el => {
          if (el == element) {
            return;
          }
          //console.log(element.qoute + ' | ' + el.qoute + ' = ' + stringSimilarity.compareTwoStrings(element.qoute, el.qoute));
          if (stringSimilarity.compareTwoStrings(element.qoute, el.qoute) >= 0.5) {
            notUnique = true;
          }

        });
      });
      if (notUnique) {
        threeKeys = keys.sort(() => 0.5 - Math.random()).slice(0, 3);
        threeMessages = [];
        threeKeys.forEach(element => {
          threeMessages.push(dataJson[element]);
        });
      }
    }

    const rightQoute = getRandomInt(0, 3);
    //console.log('Right number' + rightQoute);


    // const randomProperty = keys[Math.floor(keys.length * Math.random())];

    //console.log(threeMessages);


    const optionRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('0')
          .setLabel(threeMessages[0].qoute)
          .setStyle(ButtonStyle.Primary),
      ).addComponents(
        new ButtonBuilder()
          .setCustomId('1')
          .setLabel(threeMessages[1].qoute)
          .setStyle(ButtonStyle.Primary),
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('2')
          .setLabel(threeMessages[2].qoute)
          .setStyle(ButtonStyle.Primary),
      )
      ;

    const stop = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('stop')
          .setLabel('Stop.')
          .setStyle(ButtonStyle.Danger),
      );
    const embed = new EmbedBuilder()
      .setColor(0xFF9900)
      .setTitle('Welcome to the qoute guessing gmae')
      .addFields(
        { name: 'Who said this qoute?', value: inlineCode(threeMessages[rightQoute].message) });

    await interaction.reply({ embeds: [embed], components: [optionRow, stop] });
    //const message = await interaction.fetchReply();

    // console.log(message);

    const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button });

    /* collector.on('collect', i => {
     if (i.user.id === interaction.user.id) {
       i.reply(`${i.user.id} clicked on the ${i.customId} button.`);
     }
      else {
       i.reply({ content: 'These buttons aren\'t for you!', ephemeral: true });
     }
   }); */

    collector.on('collect', i => {

      const endEmbed = new EmbedBuilder()
        .setColor(0xFF9900)
        .addFields(
          { name: 'The correct qoute', value: inlineCode(threeMessages[rightQoute].message) + ' ' + inlineCode(threeMessages[rightQoute].qoute) });

      if (i.customId == 'stop') {
        i.update({ content: 'Bye :space_invader: ', embeds: [], components: [] });
        collector.stop();

        setTimeout(() => {
          i.message.delete();

        }, 5 * 1000);
      }
      else {
        if (i.customId == rightQoute) {

          endEmbed.addFields(
            { name: 'You are', value: codeBlock('ansi', '[0;36m' + 'Correct!') });

          i.update({ content: '', embeds: [endEmbed], components: [] });
        }
        else {
          endEmbed.addFields(
            { name: 'You are', value: codeBlock('ansi', '[0;31m' + 'Wrong!') });

          i.update({ content: '', embeds: [endEmbed], components: [] });
        }
        //Stop collector
        collector.stop();
        setTimeout(() => {
          i.message.delete();
        }, 15 * 1000);

      }
    });
    /*  collector.on('end', collection => {
      console.log(collection[0].message);
      collection.message.delete();
      interaction.deleteReply();
      //i.update({ content: 'Time ran out', embeds : [], components:[] });
    });*/
  },
};


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
