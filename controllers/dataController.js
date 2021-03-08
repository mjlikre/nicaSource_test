const db = require("./../models");
const axios = require("axios")
require("dotenv").config();



module.exports = {
    //sync method, fetches the data from rapid api and populates the local catabase. If data already exist, proceeds to update the database
  sync: async (req, res) => {
    try{
        //queryng that data, the api key has been set to an environment variable so if you're running this locally, you need to get 
        //your own api key and add it to the .env file. 
        const data = await axios.get("https://covid-193.p.rapidapi.com/statistics", {
            headers: {
                "x-rapidapi-key": process.env.RAPID_API_KEY,
                "x-rapidapi-host": "covid-193.p.rapidapi.com",
                "useQueryString": true
            }
        })
        //saves the response to the data variable
        let rawData = data.data.response
        //query's the database to see if database has alpready been populated. 
        const dbData = await db.Data.find()
        if (dbData.length === 0){
            // if database is empty then just populate it with data fetched from database
            await db.Data.insertMany(rawData)
        }else{
            //else updates the record one by one. base on this usecase, because the dataset is small, i decided to just do an update no matter what. 
            // if it were a bigger dataset, i would convert the dataset into objects to have faster lookup time, and run a for look that checks for 
            // difference then updates the databse only on records that are different, the whole process should take only O(n) time
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

  // gets the data from our databse and then sorts the countries according to their continents, then also provide a country list 
  // in order to facilitate the search component in the front end. 
  getStatistics: async(req, res) => {
      try{
          const data = await db.Data.find()
          let cleanedDataByCont = {
              "Asia": [],
              "Europe": [],
              "North-America": [],
              "South-America": [],
              "Africa": [],
              "Oceania": [],
              "Others": [],
              "country_list": []
          }

          await data.map((item) => {
              cleanedDataByCont.country_list.push(item.country)
              if (item.continent == "North-America"){
                  cleanedDataByCont["North-America"].push(item)
              }else if (item.continent == "South-America"){
                cleanedDataByCont["South-America"].push(item)
              }else if (item.continent == "Oceania"){
                cleanedDataByCont["Oceania"].push(item)
              }else if (item.continent == "Europe"){
                cleanedDataByCont["Europe"].push(item)
            }else if (item.continent == "Africa"){
                cleanedDataByCont["Africa"].push(item)
            }else if (item.continent == "Asia"){
                cleanedDataByCont["Asia"].push(item)
            }else{
                cleanedDataByCont["Others"].push(item)
            }
          })
          return res.send({"data": cleanedDataByCont})
      }catch(error) {
          console.log(error)
          return res.send({"data": "failed to get data"})
      }
  },

  // gets the specific country's data, takes in a variabe appened to the end of the url (in req.params)
  getSpecificStatistics: async(req, res) => {
      try{

          data = await db.Data.findOne({country: req.params.country_id})
          return res.send({"data": data})

      }catch(error) {
        return res.send({"data": "failed to get update"})
      }
  },
  //updates specific country's statistics. becaues there are also records that shows the total sum covid of each continent and then a 
  //total sum covid data of the whole world, each update update the individual country's data, the continent in which the country is located in's data, 
  //and also the world's data. In order to facilitate the process and since the frontend has the data readyly available. this function 
  // takes in a data variable from req.body that has 2 keys: update and difference, where update is the country data to be updated, and difference
  // is the difference after the changes were made to the data, calculated in the frontend and sent to the back to reduce amount of lookups 
  // in the databse. 
  postSpecificStatistics: async(req, res) => {
    try{
        // updates specific country
        await db.Data.updateOne({country: req.params.country_id}, {$set: req.body.update})
        // updates the continent data
        await db.Data.find({country: req.body.difference.continent}, async (err, response) => {
            if (err) throw err
            else{
                let data = response[0]
                data.cases.total += req.body.difference.cases 
                data.cases.active += req.body.difference.active 
                data.cases.recovered += req.body.difference.recovered
                data.deaths.total += req.body.difference.deaths
                await db.Data.updateOne({country: req.body.difference.continent}, {$set: {"cases": data.cases, "deaths": data.deaths}}, (error, res2) => {
                    if (error) console.log(error)
                    else console.log(res2, "success")
                })
                
            }

        })

        // updating the world's data
        await db.Data.find({country: "All"}, async (err, response) => {
            if (err) throw err
            else{
                let data = response[0]
                data.cases.total += req.body.difference.cases 
                data.cases.active += req.body.difference.active 
                data.cases.recovered += req.body.difference.recovered
                data.deaths.total += req.body.difference.deaths

                await db.Data.updateOne({country: "All"}, {$set: {"cases": data.cases, "deaths": data.deaths}}, {}, (error, res2) => {
                    if (error) console.log(error)
                    else console.log(res2, "success")
                })
                
            }
        })
        await db.Data.updateOne({country: req.body.difference.continent}, {$set: {continent}})
        
        return res.send({"data": "success"})
    }catch(error) {
      return res.send({"data": "failed to update"})
    }
    },

  
};
