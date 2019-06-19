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
      readFileSync("api/gateway/networkConnection.yaml", "utf8")
    );


    const gateway = new Gateway();
    const connectionOptions = {
      identity: userName,
      wallet: wallet,
      discovery: { enabled:false, asLocalhost: true }
    };
    await gateway.connect(connectionProfile, connectionOptions);
    const network = await gateway.getNetwork("channelall");
    const contract = await network.getContract("bartcontract");
    const res = await contract.submitTransaction(
      "issue",
      "cdb2",
      "bart",
      "1000",
      "2020-10-10"
    );

    console.log(res);
    gateway.disconnect();
  } catch (e) {
    console.error("Ocorreu um erro", e);
  }
}

connect().catch(e=>console.error(e));
