### Bart Network

Blockchain based project to support the process of agricultural credit in Brazil, the blockchain's participants are 
the creditors, debtors and auditors.

This network is based on Hyperledger fabric 1.4 and it's focused on assets dematerialization of agricultural titles and smart contracts.

The project's structure has the following directories:

**network**: contains the files to set up and deploy the blockchain's network

**1. Creation of Services**

The process to set up and deploy new network are (commands executed in the network directory):

1.1 Edit and verify the crypto-config.yaml file

1.2 Generate the crypto files for the participants through the command below:

`
./tools/cryptogen generate --config=./crypto-config.yaml
`

1.3 Create a directory called channel-artifacts

`
mkdir channel-artifacts
`

1.4 Edit and verify the configtx.yaml


1.5 Generate Genesys Block

`
./tools/configtxgen -profile OrdererGenesis -outputBlock ./channel-artifacts/genesis.block
`

1.6 Generate Channel configs

`
./tools/configtxgen -profile ChannelAll -outputCreateChannelTx ./channel-artifacts/channelall.tx -channelID channelall
`

1.7 Deploy services 

`
docker-compose up -d
`

Extra: Start the cli service (this service is off periodically)

`
docker start cli
`

**2. Network setup**

2.1 Connection to the node

```
Bart peer0

docker exec -e "CORE_PEER_LOCALMSPID=BartMSP"      -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/bart.bartdigital.com.br/users/Admin@bart.bartdigital.com.br/msp" -e "CORE_PEER_ADDRESS=peer0.bart.bartdigital.com.br:7051" -e "CORE_PEER_CHAINCODELISTENADDRESS=peer0.bart.bartdigital.com.br:7053" -it cli bash


Creditors peer0

docker exec -e "CORE_PEER_LOCALMSPID=CreditorsMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/creditors.bartdigital.com.br/users/Admin@creditors.bartdigital.com.br/msp" -e "CORE_PEER_ADDRESS=peer0.creditors.bartdigital.com.br:7051" -e "CORE_PEER_CHAINCODELISTENADDRESS=peer0.creditors.bartdigital.com.br:7053" -it cli bash


Auditors peer0

docker exec -e "CORE_PEER_LOCALMSPID=AuditorsMSP"   -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/auditors.bartdigital.com.br/users/Admin@auditors.bartdigital.com.br/msp" -e "CORE_PEER_ADDRESS=peer0.auditors.bartdigital.com.br:7051" -e "CORE_PEER_CHAINCODELISTENADDRESS=peer0.auditors.bartdigital.com.br:7053" -it cli bash
```

2.2 Create the channel only on Bart Node

`
peer channel create -o orderer.bartdigital.com.br:7050 -c channelall -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/channelall.tx
`

2.3 Join to the channel on all nodes

`
peer channel join -b channelall.block
`

2.4 Register anchor peer (optional)

`
peer channel update -o orderer.finchain.com:7050 -c channelall -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/BartMSP_anchors_channelall.tx
`

**3. Build and deploy the Smart Contracts**





**4. Monitoring the Blockchain networks**



