const roblox = require('noblox.js');
const chalk = require('chalk');
require('dotenv').config();

async function getRankName(func_group, func_user){
    let rolename = await roblox.getRankNameInGroup(func_group, func_user);
    return rolename;
}

async function getRankID(func_group, func_user){
    let role = await roblox.getRankInGroup(func_group, func_user);
    return role;
}

async function getRankFromName(func_rankname, func_group){
    let roles = await roblox.getRoles(func_group);
    let role = await roles.find(rank => rank.name == func_rankname);
    if(!role){
        return 'NOT_FOUND';
    }
    return role.rank;
}

exports.run = async (client, message, args) => {
    if(!message.member.roles.cache.some(role =>["Ranking Permissions"].includes(role.name))){
        return message.channel.send({embed: {
            color: 16733013,
            description: "You need to have the `Ranking Permissions` role to run this command.",
            author: {
          name: message.author.tag,
          icon_url: message.author.displayAvatarURL()
        },
        footer: {
          text: "Created by Danial#0001"
        }
      }
   });
    }
    let username = args[0];
    if(!username){
        return message.channel.send({embed: {
            color: 16733013,
            description: "The username argument is required.",
            author: {
          name: message.author.tag,
          icon_url: message.author.displayAvatarURL()
        },
        footer: {
          text: "Created by Danial#0001"
        }
      }
   });
    }
   let reason = args.slice(1).join(" ");
    if(!reason){
        return message.channel.send({embed: {
            color: 16733013,
            description: "The reason argument is required.",
            author: {
          name: message.author.tag,
          icon_url: message.author.displayAvatarURL()
        },
        footer: {
          text: "Created by Danial#0001"
        }
      }
   });
    }
    let id;
    try {
        id = await roblox.getIdFromUsername(username);
    } catch {
        return message.channel.send({embed: {
            color: 16733013,
            description: `Oops! ${username} is not a Roblox user. Perhaps you misspelled?`,
            author: {
          name: message.author.tag,
          icon_url: message.author.displayAvatarURL()
        },
        footer: {
          text: "Created by Danial#0001"
        }
      }
   });
    }
    let rankInGroup = await getRankID(Number(process.env.groupId), id);
    let rankNameInGroup = await getRankName(Number(process.env.groupId), id);
    if(Number(process.env.maximumRank) <= rankInGroup || Number(process.env.maximumRank) <= rankInGroup + 1){
        return message.channel.send({embed: {
            color: 16733013,
            description: "This rank cannot be ranked by this bot.",
            author: {
          name: message.author.tag,
          icon_url: message.author.displayAvatarURL()
        },
        footer: {
          text: "Created by Danial#0001"
        }
      }
   });
    }
    let promoteResponse;
    try {
        promoteResponse = await roblox.promote(Number(process.env.groupId), id);
    } catch (err) {
        console.log(chalk.red('An error occured when running the promote command: ' + err));
        return message.channel.send({embed: {
            color: 16733013,
            description: `Oops! An unexpected error has occured. It has been logged to the bot console.`,
            author: {
          name: message.author.tag,
          icon_url: message.author.displayAvatarURL()
        },
        footer: {
          text: "Created by Danial#0001"
        }
      }
   });
    }
    let newRankName = await getRankName(Number(process.env.groupId), id);
    let newRank = await getRankID(Number(process.env.groupId), id);
    message.channel.send(`**Success :tada:!** ${username} has been promoted from ${rankNameInGroup} (${rankInGroup}) to ${promoteResponse.newRole.name} (${promoteResponse.newRole.rank})`);

    if(process.env.rankingchannelid === 'false') return;
    let logchannel = await message.guild.channels.cache.get(process.env.rankingchannelid);
    logchannel.send({embed: {
        color: 2127726,
        description: `${username} has been promoted to ${promoteResponse.newRole.name}.
        
        Logging info:
        Old Rank: ${rankNameInGroup} (${rankInGroup})
        New Rank: ${promoteResponse.newRole.name} (${promoteResponse.newRole.rank})
        Reason: ${reason}
        
        Ranker Info:
        Username: ${message.author.username}
        Discord ID: ${message.author.id}
        Tag: <@${message.author.id}>`,
          author: {
          name: "Ranking Logs",
        },
        footer: {
          text: "Created by Danial#0001"
        }
    }});
}
