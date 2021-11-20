require('dotenv').config({path:__dirname+'/./../.env'})
const {MongoClient} = require('mongodb');

async function search({country, city=null}){
    const uri = process.env.REACT_APP_MONGODB_CONNECT;
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
 
    try {
        var query = {location : ""};
        if(city){query.location = toTitleCase(city) +", "+ toTitleCase(country);}
        else{query.location = {$regex : toTitleCase(country)}}
        // Connect to the MongoDB cluster
        await client.connect();
        const result = await client.db("Hidden").collection("Attractions").find(query).toArray();
        console.log(result);
        return result;
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}



function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

module.exports = search;