const { Gateway, FileSystemWallet } = require("fabric-network");
const { safeLoad } = require("js-yaml");
const { readFileSync } = require("fs");

async function connect() {
  try {
    const userName = "User1@bart.bartdigital.com.br";

    const wallet = new FileSystemWallet(
      `${__dirname}/identity/user/user1/wallet`
    );

    const connectionProfile = safeLoad(
      readFileSync("back/gateway/networkConnection.yaml", "utf8")
    );

    const gateway = new Gateway();
    const connectionOptions = {
        identity: userName,
        wallet: wallet,
        discovery: { enabled:false, asLocalhost: true }
    };

    await gateway.connect(connectionProfile, connectionOptions);
    const network = await gateway.getNetwork("channelall");
    const channel = network.getChannel();
    const peer = channel.getPeer('peer0.bart.bartdigital.com.br').getPeer();
    const eventHub = channel.newChannelEventHub(peer);

    eventHub.registerBlockEvent((block) => console.log("New block",JSON.stringify(block,null,2)),(err)=>console.error("Occorreu um erro",err));
    eventHub.registerTxEvent('all',(tx,status,block)=>console.log('Nova tx',JSON.stringify({tx,status,block},null,2)),(err)=>console.error('Ocorreu um erro',err));
    eventHub.connect();
  } catch (e) {
    console.error("Ocorreu um erro", e);
  }
}

connect().catch(e=>console.error(e));
