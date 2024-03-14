const url = require('url')
const express = require('express')
const router =express.Router()
const needle = require('needle')
const apicache = require('apicache')

// ENV 
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY_VALUE = process.env.API_KEY_VALUE

// cache
let cache = apicache.middleware

// SERVER SIDE
router.get('/',cache('2 minutes'),async  (req,res)=>{
    try {
        const params = new URLSearchParams({
            [API_KEY_NAME]: API_KEY_VALUE,
            ...url.parse(req.url, true).query,
        });
    
        const apiRes = await needle('get', `${API_BASE_URL}?${params}`);
        const data = apiRes.body;
        // log the request 
        if (process.env.NODE_ENV !== 'production') {
            console.log(`REQUEST: ${API_BASE_URL}?${params}`);
        } 

        // Check if latitude and longitude are available
        if (data[0].lat && data[0].lon) {
            const wturl = `https://api.openweathermap.org/data/2.5/weather?appid=4e1f34b66ddac692d07e0cf34b3e2f1a&lat=${data[0].lat}&lon=${data[0].lon}`;
            const wtres = await needle('get', wturl);
            const wtdata = wtres.body;

            // Add weather data to the response
            data[0].weather = {
                city: data[0].name,
                temp: wtdata.main.temp,
            };
        }
        // console.log(data);
        // console.log("checked");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
    
   
})

module.exports = router