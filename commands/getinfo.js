const roblox = require("noblox.js");
require('dotenv').config();

exports.run = async (client, message, args) => {

  let givenUsername = args[0];
  if (!givenUsername) 
  return message.channel.send({
     embed: {
       color: 13632027,
       description:
          `**You did not provide the \`username\` argument.**\n` +
          `\n` +
          `**Usage:** \`${process.env.prefix}getinfo <username>\``,
        author: {
          name: message.author.tag,
          icon_url: message.author.displayAvatarURL()
        },
        footer: {
          text: "Created by Danial#0001"
        }
      }
   });
  
   roblox.getIdFromUsername(givenUsername).then(function(id) {
     roblox.getUsernameFromId(id).then(function(completeUsername) {
       roblox.getRankInGroup(Number(process.env.groupId), id).then(function(rankSet) {
        roblox.getRankNameInGroup(Number(process.env.groupId), id).then(function(rankName) {
    
        message.channel.send({
           content: `Username: ${completeUsername}, UserID:${id}`,
           embed: {
             title: `User Information`,
             color: 8311585,              
           author: {
             name: message.author.tag,
             icon_url: message.author.displayAvatarURL()
              },
              fields: [
                {
                  name: `Username`,
                  value: `[${completeUsername}](https://www.roblox.com/users/${id}/profile)`,
                  inline: false
                },
                {
                  name: `ID`,
                  value: id,
                  inline: false
                },
                {
                  name: `Group Rank`,
                  value: `${rankName} **(${rankSet})**`,
                  inline: false
                }
              ],
              thumbnail: {
                url: `https://assetgame.roblox.com/Thumbs/Avatar.ashx?userid=${id}`
              },              
          footer: {
          text: "Created by Danial#0001 | Moderna Hotels"
              }
             }
           });
          })
        })
      })
    }).catch(function(err) {
      return message.channel.send({
        embed: {
          title: `User Invalid`,
          color: 13632027,
          description: `I couldn't find that user, perhaps you gave the wrong username?` + `\n` + `You provided: \`${givenUsername}\``,
        author: {
          name: message.author.tag,
          icon_url: message.author.displayAvatarURL()
        },
        footer: {
          text: "Created by Danial#0001"
        }
      }
    });
   })
};
