const {jwtAuth} = require('./../middleware/jwtVerify')
const {LoremPicsumServices} = require('../services/loremPicsum')

const photosApi = (app) => {
    const loremPicsumServices = new LoremPicsumServices    
    app.get('/api/photos', jwtAuth,  async (req,res) => {
        try {
            const posts = await loremPicsumServices.photos(req.query.page || 1) 
            res.status(200).json({ data: posts })
        } catch (error) {
            
        }
    })
}

module.exports = {
   photosApi 
}
