const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const handleBars = require('express-handlebars')
const User = require('./models/user.model')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const LocalStrategy = require('passport-local')
const app = express()

// To accessing .env variables

require('dotenv').config()

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI


// MongoDB Session

// connect to mongoDB

mongoose.connect('mongodb://localhost/movieDB')

let db = mongoose.connection

db.on('open', () => {
	console.log('connected to MongoDB')
})

db.on('error', (err) => {
	console.log('Database Error: '+err)
})

// express session


app.use(require('express-session')({
	secret: 'Any Normal Word',  // decode or encode session
	resave: false,
	saveUninitialized: false
}))


// passport session

passport.serializeUser(User.serializeUser()) // for encoding session
passport.deserializeUser(User.deserializeUser()) // for decoding session
passport.use(new LocalStrategy(User.authenticate())) // user authentication using local strategy


// setting up the ejs files accessing

app.set('view engine', 'ejs')

// middlewares used in api

app.use(cors())

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
	extended: true
}))


app.use(passport.initialize())
app.use(passport.session())

// accessing the public folder which is having the static html, css and js files
app.use(express.static('public'))


// ejs files rendering

app.get('/', (req, res) => {
	res.render('landingPage')
})

// login post request

app.post('/login', passport.authenticate('local', {
	successRedirect: '/user-page',
	failureRedirect: '/'
}), (req, res) => {

})

app.get('/user-page', (req, res) => {
	res.render('userPage')
})

app.get('/register', (req, res) => {
	res.render('signupPage')
})

// post request for signup

app.post('/register', (req, res) => {
	const username = req.body.username
	const password = req.body.password
	User.register(new User({
		username: req.body.username,
		mobile: req.body.mobile
	}), 
		password, (err, user) => {
			if(err) {
				console.log(err)
				return res.render('signupPage')
			}
			passport.authenticate('local')(req, res, () => {
				res.redirect('secret')
			})
		})
})


app.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/')
})

const isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()) {
		return next()
	}
	res.redirect('/')
}


app.listen(process.env.PORT, ()=> {
    console.log(`Server is running at ${process.env.PORT}`)
})
