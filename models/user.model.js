const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	mobile: {
		type: Number,
		required: true
	},
	password: {
		type: String,
		required: true
	}
})


module.exports = mongoose.model('UserSchema', UserSchema)