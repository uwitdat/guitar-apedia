const mongoose = require('mongoose');
const path = require('path')

const guitarImageBasePath = 'uploads/guitarImages'

const guitarSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    year: {
        type: Number,

    },
    imageName: {
        type: String, 
        required: true
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Player'
    }
})

guitarSchema.virtual('imagePath').get(function(){
    if(this.imageName != null) {
        return path.join('/', guitarImageBasePath, this.imageName)
    }
})

module.exports = mongoose.model('Guitar', guitarSchema)
module.exports.guitarImageBasePath = guitarImageBasePath