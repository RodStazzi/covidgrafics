const usersDB = require('./../db/users.json')

class UserService {
    find({email,password}) {
        const user = usersDB.filter(user => user.email == email && password == 'secret')
       return  user[0] || null
    }
}

module.exports = {
    UserService
}