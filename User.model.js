const mongoose = require('mongoose')

var userSchema = new mongoose.Schema
({
    uname:
        {
            type: String,
            required: 'This field is required'
        },

    password:
        {
            type: String,
            required: 'This field is required'
        },

    isAdmin:
        {
            type: Boolean,
            required: 'This field is required'
        },

    lastVisit:
        {
            type: String
        },

    email:
        {
            type: String
        },

    city:
        {
            type: String
        }
})

mongoose.model("User", userSchema)