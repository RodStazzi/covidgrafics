const {jwtSign} = require('./../utils/jwt')
const {UserService} = require('./../services/users')

const authApi = (app) => {
    const userService = new UserService    
    app.post('/api/login', (req,res) => {
        const {email, password} = req.body
        const user =  userService.find({email,password})
        if(user) {
            const token = jwtSign(user)
            console.log(token)
            res.status(200).json({
                token: token
            }).end()
        } else {
            res.status(422).json({ message: "Usuario o contraseña incorrectos"}).end()
        }
    })
}

module.exports = {
    authApi
}