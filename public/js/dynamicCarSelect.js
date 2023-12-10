fetch('/data/carBrandsAndModels')
    .then(data => data.json())
    .then(data => listModels(data))
    .catch(err => console.log('Error', err))

const brandSelect = document.querySelector('#brand');
const modelSelect = document.querySelector('#model');

const listModels = data => {
    console.log(data)
    brandSelect.addEventListener('change', () => {
        modelSelect.innerHTML = "";
        const selectedBrand = brandSelect.value;

        data[selectedBrand].forEach(model => {
            const newOption = document.createElement('option')
            newOption.value = model;
            newOption.innerHTML = model;

            modelSelect.add(newOption)
        });
    });
}

