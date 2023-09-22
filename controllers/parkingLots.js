// Models
const ParkingLot = require('../models/parkingLot');
const HourPricePair = require('../models/hourPricePair');
const Floor = require('../models/floor');
const Slot = require('../models/slot');

// Util
const AppError = require('../utils/AppError');
const floorsAndSlots = require('../utils/floorsAndSlots');
const hourPricePairs = require('../utils/hourPricePairs');

// Cloudinary
const { cloudinary } = require('../cloudinary/parkingLotStorage');

// MapBox
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// Data
const CitiesAndProvinces = require('../seeds/CitiesAndProvinces.json');

const defaultImgURL = "https://res.cloudinary.com/dlie9x7yk/image/upload/v1684585107/ParkPin/Defaults/DefaultParkingLotImage.png"
const defaultImgFilename = "ParkPin/Defaults/DefaultParkingLotImage"

module.exports.renderIndex = async (req, res) => {
	const { city, province } = req.query;
	let foundParkingLots;

	if (city && province) {
		foundParkingLots = await ParkingLot.find({
			location: `${city} - ${province}`
		}).populate('owner');

		req.flash('success', `${foundParkingLots.length} number of parking lots have been found in that area!`)
	} else {
		foundParkingLots = await ParkingLot.find({}).populate('owner');
		req.flash('warning', 'No parking lots in that area have been found!');
	}

	res.render('Ay/otoparklar', {
		title: 'ParkPin | All',
		parkingLots: foundParkingLots
	});
};

module.exports.renderNew = (req, res) => {
	res.render('Ay/add/addparkinglots', {
		title: 'ParkPin | New',
		cities: CitiesAndProvinces
	});
}

module.exports.renderShow = async (req, res) => {
	const { id } = req.params;

	const foundParkingLot = await ParkingLot.findById(id)
		.populate('owner')
		.populate({ path: 'floors', populate: { path: 'slots', populate: { path: 'locatedAt' } } })
		.populate('priceTable')
		.populate({ path: 'reviews', populate: { path: 'author' } });

	res.render('Ay/singlePage', {
		title: `ParkPin | ${foundParkingLot.location}`,
		parkingLot: foundParkingLot
	});
}

module.exports.renderEdit = async (req, res) => {
	const foundParkingLot = await ParkingLot.findById(req.params.id)
		.populate('floors')
		.populate('priceTable');
	const [oldCity, oldProvince] = foundParkingLot.location.split(' - ');

	res.render('Ay/add/editparkinglots', {
		title: 'ParkPin | New',
		parkingLot: foundParkingLot,
		cities: CitiesAndProvinces,
		oldCity,
		oldProvince
	});
}

module.exports.createParkingLot = async (req, res) => {
	const parkingLot = req.body.parkingLot;
	if (!parkingLot) throw new AppError('Invalid form data', 400);

	const location = parkingLot.city + ' - ' + parkingLot.province;

	const geoData = await geocoder.forwardGeocode({
		query: location,
		limit: 1
	}).send();

	const newLot = new ParkingLot({
		name: (parkingLot.name) ? parkingLot.name : location + ' Parking Lot',
		location: location,
		geometry: geoData.body.features[0].geometry,
		owner: req.user._id
	});

	if (req.files.length > 0) {
		newLot.images = req.files
			.map(i => ({ url: i.path, filename: i.filename }))
	} else {
		newLot.images[0] = { url: defaultImgURL, filename: defaultImgFilename };
	}

	newLot.floors = await floorsAndSlots
		.createFloors(parkingLot.floors, newLot);
	newLot.priceTable = await hourPricePairs
		.createPrices(parkingLot.startHours, parkingLot.endHours, parkingLot.prices)

	await newLot.save();

	req.flash('success', 'Successfully made a new parking lot!');
	res.redirect(`/parkingLots/${newLot._id}`);
}

module.exports.updateParkingLot = async (req, res) => {
	const { id } = req.params;
	const updatedLot = req.body.parkingLot;

	const foundParkingLot = await ParkingLot.findByIdAndUpdate(
		id,
		{
			name: updatedLot.name,
			location: updatedLot.city + ' - ' + updatedLot.province,
		},
		{ new: true } // Returns the modified document
	);

	foundParkingLot.priceTable.forEach(async price => {
		await HourPricePair.findByIdAndDelete(price._id);
	});
	foundParkingLot.floors.forEach(async floor => {
		await Floor.findByIdAndDelete(floor._id);
	});
	foundParkingLot.priceTable = [];
	foundParkingLot.floors = [];

	foundParkingLot.floors = await floorsAndSlots
		.createFloors(updatedLot.floors, foundParkingLot);
	foundParkingLot.priceTable = await hourPricePairs
		.createPrices(updatedLot.startHours, updatedLot.endHours, updatedLot.prices)

	const newImages = req.files
		.map(i => ({ url: i.path, filename: i.filename }))

	foundParkingLot.images.push(...newImages);

	if (req.body.deleteImages) {
		// Delete images from cloudinary except for default
		req.body.deleteImages.forEach(async filename => {
			if (filename == defaultImgFilename) return;

			await cloudinary.uploader.destroy(filename);
		})

		// Delete the images from lot object
		foundParkingLot.images = foundParkingLot.images.filter(
			img => !req.body.deleteImages.includes(img.filename)
		);
	}

	if (foundParkingLot.images.length < 1) {
		foundParkingLot.images
			.push({ url: defaultImgURL, filename: defaultImgFilename })
	} else if (foundParkingLot.images.length > 1) {
		foundParkingLot.images = foundParkingLot.images.filter(
			img => img.filename != defaultImgFilename
		);
	}

	await foundParkingLot.save();

	req.flash('success', 'Successfully updated the parking lot!');
	res.redirect(`/parkingLots/${id}`);
}

module.exports.deleteParkingLot = async (req, res) => {
	const { id } = req.params;
	const foundParkingLot = await ParkingLot.findById(id);

	foundParkingLot.images.forEach(async img => {
		if (img.url == defaultImgURL) return;

		await cloudinary.uploader.destroy(img.filename);
	});

	await ParkingLot.findByIdAndDelete(id);

	req.flash('success', 'Successfully deleted the parking lot!');
	res.redirect('/parkingLots');
}