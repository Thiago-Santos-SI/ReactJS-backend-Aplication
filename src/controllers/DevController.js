const Dev = require('../models/dev')
const axios = require('axios')
const parseStringAsArray = require('../util/parseStringAsArray')

module.exports = {

    async index(req, res){
        const devs = await Dev.find()

        return res.json(devs)
    },

    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body

        let dev = await Dev.findOne({github_username})
        
        if (!dev) {    
            const apires = await axios.get(`https://api.github.com/users/${github_username}`)
        
            const { name = login, avatar_url, bio } = apires.data
            
            const techsArray = parseStringAsArray(techs)
        
            const location ={
                type: 'Point',
                coordinates: [longitude, latitude] 
            }
            
            const dev = await Dev.create({
                github_username: github_username,
                name: name,
                avatar_url: avatar_url,
                bio: bio,
                techs: techsArray,
                location
            })

        }
    
        return res.json(dev)
    },

    async destroy(req, res){
        const { github_username} = req.params

        let dev = await Dev.findOne({github_username})

        if (dev != null) {
            return res.status(400).json({message: "Usuario não encontrado"})
        }
        await Dev.findByIdAndDelete(github_username)
    },

    async update(req, res){
        // Get github username
        const {github_username} = req.params;
    
        // Check if user exists in database
        let dev = await Dev.findOne({github_username});
    
        // If username do not exists
        if(!dev){
          return res.status(400).json({message: "Usuário não encontrado!"});
        }
        
        // If exists, update it
        // If update just for some fields, it will use old dev info to complete
        const {
            name = dev.name,
            bio = dev.bio,
            longitude = dev.location.coordinates[0],
            latitude = dev.location.coordinates[1], 
            avatar_url = dev.avatar_url } = req.body;
    
        // Check if techs were updated to transform text in Array for each tech
        const techs = req.body.techs ? parseStringAsArray(req.body.techs) : dev.techs;
        
         // Create geolocation for lat & long (based on PointSchema)
        const location = {
          type: 'Point',
          coordinates: [longitude, latitude],
        }
    
        // Update Dev and return the "updated" Dev
        let updatedDev = await Dev.findOneAndUpdate(github_username, {name, techs, bio, avatar_url, location}, {
          new: true
        });  
    
        return res.json(updatedDev);
      },
    
}