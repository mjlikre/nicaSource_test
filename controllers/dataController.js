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
        let rawData = data.data.response
        const dbData = await db.Data.find()
        if (dbData.length === 0){
            await db.Data.insertMany(rawData)
        }else{
            await rawData.map(async (item, index) => {
            
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
                           throw error
                        }
                    }
                )
            })
        }
        
        res.send({"success": true})
    }catch(error){
        console.log(error)
        res.send({"success": false })
    }
  },
  getStatistics: async(req, res) => {
      try{
          const data = await db.Data.find()
          return res.send({"data": data})
      }catch(error) {
          console.log(error)
          return res.send({"data": "failed to get data"})
      }
  },
  getSpecificStatistics: async(req, res) => {
      try{

          data = await db.Data.findOne({country: req.params.country_id})
          return res.send({"data": data})

      }catch(error) {
        return res.send({"data": "failed to get update"})
      }
  },
  postSpecificStatistics: async(req, res) => {
    try{
        await db.Data.updateOne({country: req.params.country_id}, {$set: req.body})
        return res.send({"data": "this is the post specific data"})
    }catch(error) {
      return res.send({"data": "failed to get update"})
    }
    },

  
};
