const { FileSystemWallet, X509WalletMixin } = require("fabric-network");
const { readFileSync } = require("fs");
const {join} = require('path');

async function main() {

    try {
        const wallet = new FileSystemWallet(`${__dirname}/identity/user/user1/wallet`);

        const credPath = '../network/crypto-config/peerOrganizations/bart.bartdigital.com.br/users/User1@bart.bartdigital.com.br';
        const cert = readFileSync(join(credPath, '/msp/signcerts/User1@bart.bartdigital.com.br-cert.pem')).toString();
        const key = readFileSync(join(credPath, '/msp/keystore/84e3a422a92f7bcc7d68c227e60636920062b7ab1a71f5ad47efc8ed15df2265_sk')).toString();

        const identityLabel = 'User1@bart.bartdigital.com.br';
        const identity = X509WalletMixin.createIdentity('BartMSP', cert, key);

        await wallet.import(identityLabel, identity);

    } catch (error) {
        console.log("Occoreu um erro",error);
        console.log(error.stack);
    }
}

main().then(() => {
    console.log('done');
}).catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});
