const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require('mongoose');

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URL)
       console.log("connected to db")
    }catch(err){
        console.log(err)
        console.log("error to connect with db")
    }
}
module.exports=connectDB


