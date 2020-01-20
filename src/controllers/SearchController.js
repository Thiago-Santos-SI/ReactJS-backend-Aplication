const Dev = require('../models/dev')
const parseStringAsArray = require('../util/parseStringAsArray')

module.exports = {
    async index(req, res){
        
        const { latitude, longitude, techs } = req.query

        const techsArray = parseStringAsArray(techs)

        const devs = await Dev.find({
            // Filter by any techs
            techs: {
              $in: techsArray,
            },
            // Find by location
            location: {
              $near: {
                $geometry: {
                  type: 'Point',
                  coordinates: [longitude, latitude]
                },
                // Distance in meters
                $maxDistance: 10000
              }
            }
          });
      
          return res.json({ devs });
        }

}