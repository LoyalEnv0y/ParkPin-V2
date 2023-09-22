const basicInfo = document.querySelector('.basic-info');
const floorInfo = document.querySelector('.floor-info');
const priceInfo = document.querySelector('.price-info');

const basicContButton = document.querySelector('#basic-cont-btn');
const floorContButton = document.querySelector('#floor-cont-btn');

basicContButton.addEventListener('click', () => {
	basicInfo.classList.add('hidden');
	floorInfo.classList.remove('hidden');
});

floorContButton.addEventListener('click', () => {
	floorInfo.classList.add('hidden');
	priceInfo.classList.remove('hidden');
});