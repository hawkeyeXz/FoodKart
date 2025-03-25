const { type } = require("@testing-library/user-event/dist/type");
const mongoose = require("mongoose");

const {Schema} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    location:{
        type: String,
        required: true,
    }, 
    Date: {
        type: Date,
        default: Date.now,
    },
    profilePic: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      },
      phone: {
        type: String,
        default: "",
      },
});


module.exports = mongoose.model("user", userSchema);