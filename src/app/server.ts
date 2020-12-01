import { MongoClient} from 'mongodb';
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
    getAll((all_working_pcs, all_connected_pcs, all_disconnected_pcs )=>{
        console.log(all_working_pcs);
        console.log(all_connected_pcs);
        console.log(all_disconnected_pcs);
        setInterval(iteartion, 30000);
    });
  

 }
 async function getAll(callback:(all_working_pcs : Item[], all_connected_pcs : Item[], all_disconnected_pcs : Item[])=>void) {
    const t = new Date();
    t.setSeconds(t.getSeconds() - 30);
    const now_t = new Date(Date.now());
    const cursor = client.db("monitor_data").collection("dataSchema").find({ status : 'CONNECTED'}).sort({time : -1});
    const cursor_1 = client.db("monitor_data").collection("dataSchema").find({ status : 'CONNECTED',
    time : {$gte : t, $lte : now_t}}).sort({time : -1});
    const disconnected = [];
    const results = await cursor.toArray();
    const results_1 = await cursor_1.toArray();
    if(results.length !== results_1.length){
        results.forEach(result_1 =>{
           if(!(results_1.some(result=> result.ip_address === result_1.ip_address))){
            disconnected.push(result_1);
           }
        });
    }
    callback(results, results_1, disconnected);
   
 }
 export interface Item{
    ip_address : string,
    network_interface : string,
    tx_packets : number,
    rx_packets : number,
    time : Date,
    status : string
}