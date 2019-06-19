const { Gateway, FileSystemWallet } = require('fabric-network')
const { safeLoad } = require("js-yaml");
const { readFileSync } = require("fs");

if(!process.argv[2]){
  console.error("Por favor passe o id da transação");
}

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
    const tx = await channel.queryTransaction(process.argv[2]);
    console.log('Tx ==>', JSON.stringify(tx,null,2));
    gateway.disconnect();
  } catch (e) {
    console.error("Ocorreu um erro", e);
  }
}

connect().catch(e=>console.error(e));
