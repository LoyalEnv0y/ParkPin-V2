const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../models/user');
const ParkingLot = require('../models/parkingLot');
const Car = require('../models/car');
const Slot = require('../models/slot');

const staySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    place: {
        type: Schema.Types.ObjectId,
        ref: 'ParkingLot',
    },

    car: {
        type: Schema.Types.ObjectId,
        ref: 'Car',
    },

    slot: {
        type: Schema.Types.ObjectId,
        ref: 'Slot'
    },

    status: {
        type: String,
        enum: ['Inactive', 'Active', 'Expired'],
        default: 'Inactive',
    },

    fee: {
        type: Number,
		required: true
    },

    bookedAt: {
        type: Date,
		default: Date.now(),
    },

	reservedFor: {
		type: Date,
	},

    activatedAt: {
        type: Date,
    },

    deactivatedAt: {
        type: Date,
    },
});

staySchema.virtual('getBookedDayDiff').get(function () {
    const bookDate = new Date(this.bookedAt.toISOString());
    const currentDate = new Date();

    const timeDiffMs = currentDate - bookDate;
    
    const days = Math.floor(timeDiffMs / (1000 * 60 * 60 * 24));
    if (days > 1) return `${days} gün önce`;

    const hours = Math.floor(timeDiffMs / (1000 * 60 * 60));
    if (hours > 1) return `${hours} saat önce`;
    
    const minutes = Math.floor(timeDiffMs / (1000 * 60));
    if (minutes > 1) return `${minutes} dakikadan önce`;

    return 'Az Önce';
    
});

module.exports = mongoose.model('Stay', staySchema);