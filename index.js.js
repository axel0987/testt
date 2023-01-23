/*MADE BY AXVEEZ*/
const {Discord, Guild, Client, Channel, GuildMemberManager, MessageEmbed} = require('discord.js');
const client = new Client();
const {Account, Connection, PublicKey} = require('@solana/web3.js');
const {Market} = require('@project-serum/serum');

// Discord bot ID
client.login(process.env.BOTID); // change here 
let channelid = "1066928922136150046";

let arr_donepost = Array();

let connection = new Connection('https://api.mainnet.rpcpool.com/');
let programId = new PublicKey('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'); // Serum program v3
// Serum Market ID
let marketAddress = new PublicKey('F9CpWoyeBJfoRB8f2pBe2ZNPbPsEE76mWZWme3StsvHK'); // MARKET

let treshold = "5"; //TRESHOLD
let token_name = "$test"; //TOKENNAME

client.on('ready', async () => {
  

  setInterval(async function () {
    const tes = await getTrade() 
        // console.log(val)
        const newEmbed = new MessageEmbed()
        .setThumbnail('https://pbs.twimg.com/profile_images/1438995159929298944/f24DDc5g_400x400.jpg')
        .setColor('#00FF00')
        .addField('Trade Alert',`${tes}`)
        .setTimestamp()
        .setFooter('made by axellab', 'https://pbs.twimg.com/profile_images/1438995159929298944/f24DDc5g_400x400.jpg');
        client.channels.cache.get(`${channelid}`).send(newEmbed)
  }, 5000);



})

async function getTrade() {
    let market = await Market.load(connection, marketAddress, {}, programId);
    let fills = await market.loadFills(connection);
    let bigorder = Array();
    let last_release = 0;

    var count = 1;
    for (let fill of fills) {
      if (fill.eventFlags.bid==true) {
        if (fill.eventFlags.maker==false) {
          text_side ="Bought"
          side = "buy"
        }else{
          text_side ="Sell"
          side = "sell"
        }
        if(side=='buy'){ //buy only
          if(fill.size>=treshold){ 
            if(arr_donepost.includes(`${fill.orderId}`)){
              // NOthing here
            }else{
              
              bigorder.push(`💰someone ${text_side} ${parseFloat(fill.size)} ${token_name} @$${fill.price.toFixed(3)} ||`); 
              arr_donepost.push(`${fill.orderId}`)
              console.log(fill.feeCost) 
            }
          }
        }
      }
    }
    console.log(bigorder)
    return bigorder
}
