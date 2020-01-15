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
    }
    
}