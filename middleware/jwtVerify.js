const express = require('express')
const { jwtVerify } = require('../utils/jwt')

const jwtAuth = express.Router()

jwtAuth.use((req, res, next) => {
	const jwtToken = req.headers['authorization'] || ''
	token = jwtToken.replace('Bearer ', '')
	if (token) {
		jwtVerify(token, (err, decoded) => {
			if (err) {
				return res.status(401).json({ message: err.message }).end()    
			} else {
				req.jwtUser = decoded;    
				next();
			}
		})
	} else {
		res.send({ 
			message: 'Token no proveída.' 
		});
	}
})

module.exports = {jwtAuth}