const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const User = require('./models/user.model')
const app = express()

// To accessing .env variables

require('dotenv').config()

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI


// MongoDB Session

// connect to mongoDB

mongoose.connect('mongodb://localhost/movieDB', () => {
	try {
		console.log("connected to MongoDB")
	} catch(err) {
		console.log("database error: "+err)
	}
})

// middlewares used in api

app.use('/', express.static(path.join(__dirname, "public")))

app.use(cors())

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
	extended: true
}))


app.post('/api/register', (req, res) => {
	res.send(req.body)
	res.json({
		status: "Ok"
	})
})

app.listen(PORT, ()=> {
    console.log(`Server is running at ${PORT}`)
})
