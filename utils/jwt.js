const jwt = require('jsonwebtoken')
const { KEY } = require('./../config')

const jwtVerify = (token,cb) => {
    jwt.verify(token, KEY,(err,decoded) => {
        cb(err,decoded)
    })
    
}

const jwtSign = ({id,name,username}) => {
    const payload = {
       id,
       name,
       username,
    }
    return jwt.sign(payload, KEY)
}

module.exports = {
    jwtVerify,
    jwtSign
}