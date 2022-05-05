const express    = require('express')
const path       = require('path')
const bodyParser = require('body-parser')
const cookie     = require('cookie-parser')
const ejs        = require('ejs')
const db         = require('./db.js')

const app = express()
const port = 3000

app.use(express.static('html'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookie())
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    let uname = req.cookies.uname
    let password = req.cookies.password
    db.getUser(uname, password, (user) => {
        db.updateVisitDate(uname, "Visit main page")
        if (req.query.view == 1) {
            res.render(path.join(__dirname, 'html', 'register'),
                {
                })
        } else {
            let isAdmin = false
            if (user)
                isAdmin = user.isAdmin
            if (isAdmin) {
                let sort = req.query.sort
                db.getUsers(sort, (result) => {
                    res.render(path.join(__dirname, 'html', 'login'),
                        {
                            user: user,
                            users: result
                        })
                })
            } else {
                res.render(path.join(__dirname, 'html', 'login'),
                    {
                        user: user
                    })
            }
        }
    })
})

app.post('/register', (req, res) => {
    let uname = req.body.uname
    db.isExist(uname, (exist) => {
        if (exist) {
            var error = {
                title: "User exist",
                message: "This login is already exist!"
            }
            res.render(path.join(__dirname, 'html', 'error'),
                {
                    error: error
                })
        } else {
            let password = req.body.password
            let isAdmin = req.body.isAdmin
            let email = req.body.email
            let city = req.body.city
            let error = db.register(uname, password, isAdmin)
            if (error.title !== "") {
                res.render(path.join(__dirname, 'html', 'error'),
                    {
                        error: error
                    })
            } else {
                db.updateVisitDate(uname, "Registered")
                res.redirect('/')
            }
        }
    })
})

app.post('/login', (req, res) => {
    let uname = req.body.uname
    let password = req.body.password
    db.login(uname, password, (error) => {
        if (error.title !== "") {
            res.render(path.join(__dirname, 'html', 'error'),
                {
                    error: error
                })
        } else {
            db.updateVisitDate(uname, "Logined")
            res.cookie("uname", uname)
            res.cookie("password", password)
            res.redirect('/')
        }
    })
})

app.post('/delete', (req, res) => {
    let uname = req.body.uname
    db.deleteUser(uname, (result) =>
    {
        console.log(result)
        res.redirect('/')
    })
})

app.post('/change', (req, res) => {
    let uname = req.body.uname
    let unameNew = req.body.unameNew
    let password = req.body.password
    let isAdmin = false
    if (req.body.isAdmin == 'true')
        isAdmin = true
    let email = req.body.email
    let city = req.body.city
    db.changeUser(uname, unameNew, password, isAdmin, email, city)
    res.redirect('/')
})

app.listen(port, () =>
{
    console.log(port)
})