const Review = require('../models/review')
const User = require('../models/user');
const Floor = require('../models/floor');

const CitiesAndProvinces = require('../seeds/CitiesAndProvinces.json');
const CarBrandsAndModels = require('../seeds/CarBrandsAndModels.json');
const ParkingLot = require('../models/parkingLot');

module.exports.getCityData = (req, res) => {
	res.json(CitiesAndProvinces);
};

module.exports.getCarData = (req, res) => {
	res.json(CarBrandsAndModels);
};

module.exports.reviewIsLikedBy = async (req, res) => {
	const { userId, reviewId } = req.body;

	const foundReview = await Review.findById(reviewId);
	const foundUser = await User.findById(userId);

	const liked = foundUser.likedReviews.includes(foundReview._id);

	res.json({ liked });
}

module.exports.getFloorById = async (req, res) => {
	const { id } = req.params;
	const foundFloor = await Floor.findById(id).populate('slots');

	res.json(foundFloor);
}

module.exports.getSlotNum = async (req, res) => {
	const { id } = req.query;
	const foundParkingLot = await ParkingLot.findById(id)
		.populate({
			path: 'floors',
			populate: {
				path: 'slots',
				populate: { path: 'locatedAt' }
			}
		});

	let i = 0;

	for (let floor of foundParkingLot.floors) {
		for (let slot of floor.slots) {
			if (!slot.isFull) i++;
		}
	}
	
	res.json({'availableSlotNum': i});
}