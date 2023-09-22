const User = require('../models/user');

module.exports.renderLogin = (req, res) => {
	res.render('Ay/giris-yap', { title: 'ParkPin | Login' });
}

module.exports.login = (req, res) => {
	req.flash('success', 'Welcome back!');
	res.redirect('/parkingLots');
}

module.exports.renderRegister = (req, res) => {
	res.render('Ay/kaydol', { title: 'ParkPin | Register' });
}

const defaultUserImgURL = "https://res.cloudinary.com/dlie9x7yk/image/upload/v1684584394/ParkPin/Defaults/DefaultUserImage.jpg"
const defaultUserImgFilename = "ParkPin/Defaults/DefaultUserImage"

module.exports.register = async (req, res) => {
	try {
		const user = req.body.user

		const newUser = User({
			username, email, birthDate,
			phoneNumber, citizenID
		} = user);

		if (req.file) {
			newUser.image = { url: req.file.path, filename: req.file.filename };
		} else {
			newUser.image = { url: defaultUserImgURL, filename: defaultUserImgFilename }
		}

		const registeredUser = await User.register(newUser, user.password);
		req.login(registeredUser, (err) => {
			if (err) {
				return next(err)
			}

			req.flash('success', 'Welcome to ParkPin!')
			res.redirect('/');
		});

	} catch (err) {
		req.flash('error', err.message)
		res.redirect('/register');
	}
}

module.exports.renderMe = async (req, res) => {
	const user = await User.findById(req.user._id)
		.populate({
			path: 'stays',
			populate: [
				{ path: 'place' },
				{ path: 'car' },
			]
		})
		.populate('cars');

	res.render('Ay/hesabim', {
		title: 'ParkPin | Profile',
		user
	});
}

module.exports.logout = (req, res) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
	});
	req.flash('success', 'Goodbye!');
	res.redirect('/');
}