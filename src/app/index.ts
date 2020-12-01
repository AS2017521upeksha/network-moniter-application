import { MongoClient} from 'mongodb';
import * as si from 'systeminformation';
const uri = 'mongodb+srv://upeksha:qxUcHnRAvzV4jZIl@pcnetworkmonitor.bdsx2.mongodb.net/<monitor_data>?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function main(){
    try {
     await client.connect();
      
     await iteartion();
    
    } catch (Error) {
    
    } 

 }
 
 main().catch(console.error);

 async function iteartion() {
    await getIP((ip_address, iface)=>{
        getNetworkStat(iface,(tx_packets, rx_packets)=>{
           const item : Item ={
               ip_address : ip_address,
               network_interface : iface,
               tx_packets : tx_packets,
               rx_packets : rx_packets,
               status : 'CONNECTED',
               time : new Date(Date.now())
           }
           updateListingByIp(client , item);
           setInterval(iteartion, 5000) ;
        });

      }); 
      
    
     }
 async function getIP(callback: (ip_address: string, networkInterface : string)=> void){
    si.networkInterfaces()
        .then(data=>{
            for(let i = 0; i < data.length; i++){
                if(data[i].iface === 'WiFi' || data[i].iface === 'Ethernet'){
                    callback(data[i].ip4, data[i].iface);
                }
            }
           
        });
 }

 async function getNetworkStat(iface, callback:(tx_packets : number, rx_packets : number)=>void) {
     si.networkStats(iface)
        .then(data => {
           const tx_bytes = data[0].tx_sec;
           const rx_bytes = data[0].rx_sec;
           callback(tx_bytes, rx_bytes);
        });
     
 }


function updateListingByIp(client, updatedItem : Item) {
    const result = client.db("monitor_data").collection("dataSchema")
                        .updateOne({ ip_address: updatedItem.ip_address }, { $set: updatedItem },{ upsert: true });

}
 

export interface Item{
    ip_address : string,
    network_interface : string,
    tx_packets : number,
    rx_packets : number,
    time : Date,
    status : string
}