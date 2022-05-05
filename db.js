const mongoose = require('mongoose')
const check = require('./check.js')

mongoose.connect('mongodb://127.0.0.1:27017/Assignment5', {
        useNewUrlParser: true
    },
    err => {
        if (!err) {
            console.log("Connection succeeded")
        }
        else
            console.log("Error in connection " + err)
    })

require('./User.model')
const User = mongoose.model('User')

function isExist(uname, callback) {
    User.findOne({uname: uname}, (err, result) => {
        return callback(result)
    })
}

function updateVisitDate(uname, message) {
    let date = new Date()
    User.updateOne({uname: uname}, {
        $set: {
            lastVisit: (date + ' ' + message)
        }
    })
}

function register(uname, password, isAdmin) {
    let error = {
        title: "",
        message: ""
    }

    let passwordParams = check.checkPassword(password)

    if (!passwordParams.lower) {
        error.title = "Wrong password field"
        error.message = "Password doesn't contains lower case characters!"
        return error
    }
    if (!passwordParams.upper) {
        error.title = "Wrong password field"
        error.message = "Password doesn't contains upper case characters!"
        return error
    }
    if (!passwordParams.special) {
        error.title = "Wrong password field"
        error.message = "Password doesn't contains special characters!"
        return error
    }
    if (!passwordParams.toolong) {
        error.title = "Wrong password field"
        error.message = "Password is too small"
        return error
    }

    let date = new Date()
    let user = new User()
    user.uname = uname
    user.password = password
    user.isAdmin = isAdmin
    user.lastVisit = date + " Created"
    user.save((err, doc) =>
    {
        if (!err)
            console.log("User created! " + uname)
    })
    return error
}

function login(uname, password, callback) {
    var error = {
        title: "",
        message: ""
    }

    User.find({uname: uname}, (err, login) =>
    {
        User.find({password: password}, (err, pass) =>
        {
            if (!login.length) {
                error.title = "User not found!"
                error.message = "Try to input another login"
            } else if (!pass.length) {
                error.title = "Password is wrong!"
                error.message = "Try to another password!"
            }
            return callback(error, pass)
        })
    })
}

function getUser(uname, password, callback) {
    User.findOne({$and: [{uname: uname}, {password: password}]}, (err, result) =>
    {
      return callback(result)
    })
}

function getUsers(sort, callback) {
    switch (sort) {
        case "uname":
            User.
            find( (err, result) => {
                return callback(result)
            }).sort({uname: -1})
            break

        case "password":
            User.
            find( (err, result) => {
                return callback(result)
            }).sort({password: -1})
            break

        case "isAdmin":
            User.
            find( (err, result) => {
                return callback(result)
            }).sort({isAdmin: -1})
            break

        case "email":
            User.
            find((err, result) => {
                return callback(result)
            }).sort({email: -1})
            break

        case "city":
            User.
            find( (err, result) => {
                return callback(result)
            }).sort({city: -1})
            break

        default:
            User.
            find({}, (err, result) => {
                return callback(result)
            })
    }
}

function deleteUser(uname, callback) {
    User.deleteOne({uname: uname}, (err, result) =>
    {
        return callback(result)
    })
}

function changeUser(uname, unameNew, password, isAdmin, email, city) {
    User.updateOne({uname: uname}, {
        $set: {
            "uname": unameNew,
            "password": password,
            "isAdmin": isAdmin,
            "email": email,
            "city": city
        }
    }).then()
}

module.exports = {
    updateVisitDate: updateVisitDate,
    register: register,
    login: login,
    isExist: isExist,
    getUser: getUser,
    getUsers: getUsers,
    deleteUser: deleteUser,
    changeUser: changeUser
}