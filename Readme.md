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

```
./tools/cryptogen generate --config=./crypto-config.yaml
```

1.3 Create a directory called channel-artifacts

```
mkdir channel-artifacts
```

1.4 Edit and verify the configtx.yaml


1.5 Generate Genesys Block

```
./tools/configtxgen -profile OrdererGenesis -outputBlock ./channel-artifacts/genesis.block
```

1.6 Generate Channel configs

```
./tools/configtxgen -profile ChannelAll -outputCreateChannelTx ./channel-artifacts/channelall.tx -channelID channelall
```

1.7 Deploy services 

```
docker-compose up -d
```

Extra: Start the cli service (this service is off periodically)

```
docker start cli
```

**2. Network setup**

2.1 Connection to the node

```
Bart peer0

docker exec -e "CORE_PEER_LOCALMSPID=BartMSP"      -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/smart-contract/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/bart.bartdigital.com.br/users/Admin@bart.bartdigital.com.br/msp" -e "CORE_PEER_ADDRESS=peer0.bart.bartdigital.com.br:7051" -e "CORE_PEER_CHAINCODELISTENADDRESS=peer0.bart.bartdigital.com.br:7053" -it cli bash


Creditors peer0

docker exec -e "CORE_PEER_LOCALMSPID=CreditorsMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/smart-contract/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/creditors.bartdigital.com.br/users/Admin@creditors.bartdigital.com.br/msp" -e "CORE_PEER_ADDRESS=peer0.creditors.bartdigital.com.br:7051" -e "CORE_PEER_CHAINCODELISTENADDRESS=peer0.creditors.bartdigital.com.br:7053" -it cli bash


Auditors peer0

docker exec -e "CORE_PEER_LOCALMSPID=AuditorsMSP"   -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/smart-contract/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/auditors.bartdigital.com.br/users/Admin@auditors.bartdigital.com.br/msp" -e "CORE_PEER_ADDRESS=peer0.auditors.bartdigital.com.br:7051" -e "CORE_PEER_CHAINCODELISTENADDRESS=peer0.auditors.bartdigital.com.br:7053" -it cli bash
```

2.2 Create the channel only on Bart Node

```
peer channel create -o orderer.bartdigital.com.br:7050 -c channelall -f /opt/gopath/smart-contract/github.com/hyperledger/fabric/peer/channel-artifacts/channelall.tx
```

2.3 Join to the channel on all nodes

```
peer channel join -b channelall.block
```

2.4 Register anchor peer (optional)

```
peer channel update -o orderer.bartdigital.com.br:7050 -c channelall -f /opt/gopath/smart-contract/github.com/hyperledger/fabric/peer/channel-artifacts/BartMSP_anchors_channelall.tx
```

**3. Build and deploy the Smart Contracts**

It's necessary to build and deploy the smart contracts on the network created on step 2, for this we executed the following steps:

3.1 Change directory to smart-contract

`
cd smart-contract
`

3.2 Edit the contracts and states

3.3 Build de project

`
npm run build
`

3.4 Install the smart contract on all nodes

`
peer chaincode install -n bartcontract -p /opt/gopath/smart-contract/github.com/chaincode -l node -v 1.0
`

3.5 Instantiate the smart contract

`
peer chaincode instantiate -o orderer.bartdigital.com.br:7050 -C channelall -c '{"Args":[]}' -n bartcontract -P "AND ('BartMSP.peer', 'AuditorsMSP.peer')" -v 1.0
`

Extra:

To update the smart contract you should assign a new version and execute the following code in each node

`
peer chaincode upgrade -o orderer.bartdigital.com.br:7050 -C channelall -c '{"Args":[]}' -n bartcontract -P "OR (AND ('BartMSP.peer', 'AuditorsMSP.peer'), AND ('CreditorsMSP.peer', 'AuditorsMSP.peer'))" -v *
`

To inform the channel of the anchor peer you should execute the following command

`
peer channel update -o orderer.bartdigital.com.br:7050 -c channelall -f /opt/gopath/smart-contract/github.com/hyperledger/fabric/peer/channel-artifacts/BartMSP_anchors_channelall.tx 
`

**4. Consume the Blockchain data**

Create Credit Guarantee

```
peer chaincode invoke -o orderer.bartdigital.com.br:7050 -C channelall -c '{"Args":["createCreditGuarantee","1","cpr", "cpr fisica", "https://", "2020-10-10", "1000", "kg", "john"]}' -n bartcontract --peerAddresses peer0.bart.bartdigital.com.br:7051 --peerAddresses peer0.auditors.bartdigital.com.br:7051
```

Issue cb2

```
peer chaincode invoke -o orderer.bartdigital.com.br:7050 -C channelall -c '{"Args":["issue","cdb2","glauber","500","2020-10-10"]}' -n bartcontract --peerAddresses peer0.creditors.bartdigital.com.br:7051 --peerAddresses peer0.auditors.bartdigital.com.br:7051
```

buy cb1

```
peer chaincode invoke -o orderer.bartdigital.com.br:7050 -C channelall -c '{"Args":["buy","cdb1","fulano"]}' -n bartcontract  --peerAddresses peer0.bart.bartdigital.com.br:7051 --peerAddresses peer0.auditors.bartdigital.com.br:7051  
```

delete cb2

```
peer chaincode invoke -o orderer.bartdigital.com.br:7050 -C channelall -c '{"Args":["delete","cdb1"]}' -n bartcontract --peerAddresses peer0.bart.bartdigital.com.br:7051 -peerAddresses peer0.creditors.bartdigital.com.br:7051
```

query the last state

```
peer chaincode query -n bartcontract -C channelall -c '{"Args":["findCreditGuarantee","1"]}'
```

query all states

```
peer chaincode query -n bartcontract -C channelall -c '{"Args":["findAllTxsForKey","1"]}'
```

**5. Monitoring the Blockchain networks**

```
./network/tools/monitordocker.sh
```

