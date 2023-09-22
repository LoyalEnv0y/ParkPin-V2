const slotNumbers = document.querySelectorAll('small');

const getAvailableSlotNumber = async (id) => {
	const url = `http://localhost:3000/data/getAvailableSlotNum?id=${id}`

	try {
		const resp = await fetch(url);
		const availableSlotNum = await resp.json();

		if (!resp.ok) {
			console.log('Error catching slot availability data');
			return;
		}

		return availableSlotNum.availableSlotNum;
	} catch (err) {
		console.log(err);
	}
} 

slotNumbers.forEach(async slotNumber => {
	const id = slotNumber.getAttribute('data-park-id');
	const availableSlotNum = await getAvailableSlotNumber(id);

	slotNumber.innerText = `${availableSlotNum} park yeri mevcut`;

	if (availableSlotNum >= 10) {
		slotNumber.style.setProperty("color", "green", "important");
	} else {
		slotNumber.style.setProperty("color", "red", "important");
	}
});

