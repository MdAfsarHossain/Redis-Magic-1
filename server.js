const redis = require('redis');
const express = require('express');
const app = express();

// Create redis client to connect to redis server
let redisClient;
(async () => {
    redisClient = redis.createClient();
    redisClient.on('error', (error) => {
        console.log(error);
    })
    await redisClient.connect();
})()

app.get('/', (req, res) => {
    res.send("Hello World")
})



// Without redis
// app.get('/calculate-data', (req, res) => {
//     // heavy calculation
//     let calculatedData = 0;
//    try {
//      for(let i=0; i< 100000000000; i++) {
//         calculatedData += i
//     }

//     return res.json({data: calculatedData})
//    } catch( error) {
//     console.log(error)
//     // return res.status(500).json({error: "Internal Server Error"})
//     return res.json({error: error.message})
//    } 
// })


// With Redis
app.get('/calculate-data', async (req, res) => {
    try {
        const cachedData = await redisClient.get('calculatedData');
        if(cachedData) {
            return res.json({data: cachedData})
        }

        // heavy calculation
        let calculatedData = 0;
        for(let i=0; i< 100000000000; i++) {
            calculatedData += i
        }

        await redisClient.set('calculatedData', calculatedData);
        return res.json({data: calculatedData})
        
    } catch (error) {
        console.log(error);
        return res.json({error: error.message})
    }
})


app.listen(5000, () => {
    console.log(`Server is running on port 5000`);
})