const db = require("./../models");
const axios = require("axios")
require("dotenv").config();



module.exports = {
  sync: async (req, res) => {
    try{
        const data = await axios.get("https://covid-193.p.rapidapi.com/statistics", {
            headers: {
                "x-rapidapi-key": process.env.RAPID_API_KEY,
                "x-rapidapi-host": "covid-193.p.rapidapi.com",
                "useQueryString": true
            }
        })
        let rawData = data.data.response.slice(0, 13)
        
        rawData.map(async (item, index) => {
            
            await db.Data.findOneAndUpdate(
                {country: item.country},
                {
                    population: item.population,
                    cases: item.cases,
                    deaths: item.deaths, 
                    tests: item.tests,
                    day: item.day,
                    time: item.time
                },
                async (error, result) => {
                    if (error) {
                        console.log("new")
                        const newData = new db.Data(item)
                        await newData.save()
                    }
                }
                
            )
            
        })
        res.send({"success": true })
    }catch(error){
        console.log(error)
        res.send({"success": false })
    }
  }
};
