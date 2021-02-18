const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 7000;
const BodyParser = require("body-parser");
const Cors = require("cors");
const Pusher = require("pusher")
const messagecontent = require("./models/message")



const {MONGOURI} = require("./keys"); // Mongo url..connection String


const pusher = new Pusher({
    appId: "1106057",
    key: "d83b001a08c61c3fe157",
    secret: "dbbc0061c1e2b9eee989",
    cluster: "ap2",
    useTLS: true
  });


mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

db=mongoose.connection;
db.once("open",()=>{
    console.log("DB Connected")

    const msgCollection = db.collection("messagecontents");
    const changeStrem = msgCollection.watch();

    changeStrem.on("change",(change)=>{
        console.log("Change Occure",change);

        if(change.operationType === "insert")
        {
            const messageDetails = change.fullDocument;
            pusher.trigger("messages","inserted",{
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp:messageDetails.timestamp,
                recieved: messageDetails.recieved  
            });
        }
        else{
            console.log("Error triggering Pusher")
        }

    });
});

mongoose.connection.on("error",(err)=>{
    console.log("Connection Error...!:)",err);
})





app.use(Cors());

require("./models/user"); // UserSchema
require("./models/post"); //PostSchema
require("./models/message");

app.use(BodyParser.json())  //Parse incoming request bodies in a middleware before your handlers, available under the req.body property.

app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));
app.use(require("./routes/message"));



app.listen(PORT,()=>{
    console.warn("server is running on",PORT);
})

//Schema is basically a blueprint.. which tell th mongodb..hey mongodb we are going to store these kind of data