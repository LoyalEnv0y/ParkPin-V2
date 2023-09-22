const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carsSchema = new Schema({
    brand: {
        type: String,
        required: true,
    },

    model: {
        type: String,
        required: true,
    },

    hasLPG: {
        type: Boolean,
        required: true
    },

    description: {
        type: String,
    },

    listedAt: {
        type: Date,
        default: Date.now(),
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    parkedIn: {
        type: Schema.Types.ObjectId,
        ref: 'ParkingLot',
    },

    parkedAt: {
        type: Date,
    },
});

carsSchema.virtual('listDate').get(function () {
    const listDate = new Date(this.listedAt);
    return `${listDate.getFullYear()}-${listDate.getMonth()}-${listDate.getDay()}`;
});

module.exports = mongoose.model('Car', carsSchema);