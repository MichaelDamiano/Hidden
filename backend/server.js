require('dotenv').config({path:__dirname+'/./../.env'})
var express = require('express');
var app = express();
const {MongoClient} = require('mongodb');
app.get('/search/:country/:city', async function (req, res) {
    const uri = process.env.REACT_APP_MONGODB_CONNECT;
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
 
    try {
        var query = {location : ""};
        if(req.params.city != "_"){query.location = toTitleCase(req.params.city) +", "+ toTitleCase(req.params.country);}
        else{query.location = {$regex : toTitleCase(req.params.country)}}
        // Connect to the MongoDB cluster
        await client.connect();
        const result = await client.db("Hidden").collection("Attractions").find(query).toArray();
        console.log(result.length + " entries found for " + (req.params.city != "_" ? req.params.city + ", ": "") + req.params.country);
        res.send( result );
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}