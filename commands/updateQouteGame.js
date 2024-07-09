const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

const fs = require('fs');
const path = require('path');

const pathToQouteData = path.join(process.env.DATA_DIRECTORY, 'qouteData.json');
const rawdata = fs.readFileSync(pathToQouteData);
const dataJson = JSON.parse(rawdata);

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Update Qoute Game')
        .setType(ApplicationCommandType.User),
	async execute(interaction) {
      await interaction.deferReply();

    // console.log(interaction.guild.channels.fetch('948672366580494418'));
    /* interaction.guild.channels.fetch('948672366580494418').then(channel => { 
        channel.messages.fetch({ }).then(messages => {
            console.log(`Received ${messages.size} messages`);

            const channel = client.channels.cache.get("<my-channel-id>");
            let messages = [];
          
            // Create message pointer
            let message = await channel.messages
              .fetch({ limit: 1 })
              .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));
          
            while (message) {
              await channel.messages
                .fetch({ limit: 100, before: message.id })
                .then(messagePage => {
                  messagePage.forEach(msg => messages.push(msg));
          
                  // Update our message pointer to be last message in page of messages
                  message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
                }
            }
            // Iterate through the messages here with the variable "messages".
            messages.forEach(message => {
                // let qoute, sayer, isSplit = splitFirst(message.content, '-');
                const isQoute = message.content.includes('-');

                // console.log(first, remainder);
                if (isQoute) {
                    dataJson[message.id] = {
                        message:  message.content,
                    };
                }
            });

            fs.writeFile(pathData, JSON.stringify (dataJson, null, 2), err => {
                if (err) throw err;
                console.log('Sucesfully updated ');
            });

            });
    });*/
    const channel = interaction.client.channels.cache.get('948672366580494418');
    const messages = [];
  
    // Create message pointer
    let message = await channel.messages
      .fetch({ limit: 1 })
      .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));
  
    while (message) {
      await channel.messages
        .fetch({ limit: 100, before: message.id })
        .then(messagePage => {
          messagePage.forEach(msg => {if (msg.content.includes('-') && !msg.content.includes('http')) messages.push(msg);});
  
          // Update our message pointer to be last message in page of messages
          message = messagePage.size > 0 ? messagePage.at(messagePage.size - 1) : null;
        });
    }

    messages.forEach(element => {
        //console.log(element.content);
        const [first, ...rest] = element.content.split('-');
        const remainder = rest.join('-');
        dataJson[element.id] = {
            message:  first,
            qoute: remainder,
        };
    });

    fs.writeFile(pathToQouteData, JSON.stringify (dataJson, null, 2), err => {
        if (err) throw err;
        console.log('Sucesfully updated ');
    });


    interaction.editReply(`I've updated the qoute file with ${messages.length} pottentially qoutes`);
	},
};

function splitFirst(str, symbol) {
    // console.log(str);
    const wasSplit = str.includes(symbol);
    const [first, ...rest] = str.split(symbol);

    const remainder = rest.join(symbol);
    console.log(first, remainder); 
    return first, remainder, wasSplit;
}