const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://hplrn69:Harikesh121@landsetreflectiondata.6bpxt.mongodb.net/");

const userSchema = new mongoose.Schema({
    username : String,
    password : String,
    firstName : String,
    lastName : String,
})
// const locationSchema = new mongoose.Schema({
//     name : String,
//     latitude : String,
//     longitude : String,
// })

// const satelliteLocationSchema = new mongoose.Schema({
//     name: String,
//     latitude: Number,
//     longitude: Number,
//     altitude: Number,
//     type: String,
//     userId: mongoose.Schema.Types.ObjectId
// }) 

const satelliteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assuming you have a User model
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    satelliteName: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    notificationLeadTime: {
        type: Number, // Time in minutes
        default: 30 // Default lead time for notifications
    },
    notificationMethod: {
        type: String,
        enum: ['email', 'sms', 'push'],
        default: 'email' // Default notification method
    }
});

const landsatDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assuming you have a User model
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    data: {
        type: Object, // This can hold the actual Landsat data object
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});


const Location = mongoose.model("Location", locationSchema);
const SatLoc = mongoose.model("SatLoc", satelliteLocationSchema);
const User = mongoose.model("User", userSchema);
const Satellite = mongoose.model('Satellite', satelliteSchema);
const LandsatData = mongoose.model('LandsatData', landsatDataSchema);

module.exports ={
    Location,
    SatLoc,
    User,
    Satellite,
    LandsatData,

}