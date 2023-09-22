var password = document.getElementById("password")
, confirm_password = document.getElementById("confirm_password");

function validatePassword(){
if(password.value != confirm_password.value) {
  confirm_password.setCustomValidity("Şifreler Eşleşmiyor!");
} else {
  confirm_password.setCustomValidity('');
}
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;

function tckimlikkontorolu(tcno) {
  var tckontrol,toplam; tckontrol = tcno; tcno = tcno.value; toplam = Number(tcno.substring(0,1)) + Number(tcno.substring(1,2)) +
  Number(tcno.substring(2,3)) + Number(tcno.substring(3,4)) +
  Number(tcno.substring(4,5)) + Number(tcno.substring(5,6)) +
  Number(tcno.substring(6,7)) + Number(tcno.substring(7,8)) +
  Number(tcno.substring(8,9)) + Number(tcno.substring(9,10));
  strtoplam = String(toplam); onunbirlerbas = strtoplam.substring(strtoplam.length,strtoplam.length-1);

  if(onunbirlerbas == tcno.substring(10,11)) {
  tckimlikno.setCustomValidity("");
  tckimlikno.style.border = "";
  } else{
      tckimlikno.setCustomValidity("TC Kimlik Doğrulanamadı.");
  tckimlikno.style.border = "1px solid red";
  }
}
const phoneInput = document.getElementById('phone');

function formatPhoneNumber(e) {
let input = e.target.value;

// Tüm olası karakterleri kaldırıyoruz
input = input.replace(/[^\d]/g, '');

// Maksimum 11 karakter kabul edilecektir
input = input.substring(0, 11);

// Numarayı belirli bir formata dönüştürüyoruz
let formattedInput = input.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "+90 $2 $3 $4 $5");

// Formatlanmış numarayı input alanına yazıyoruz
e.target.value = formattedInput;
}

phoneInput.addEventListener('input', formatPhoneNumber);

const cityInput = document.getElementById('city');

cityInput.addEventListener('change', function() {
const selectedCity = this.value;
const citiesList = document.getElementById('cities').options;
let isValid = false;

// Check if selected city is in the list of cities
for (let i = 0; i < citiesList.length; i++) {
  if (citiesList[i].value === selectedCity) {
    isValid = true;
    break;
  }
}

// Set custom validity message if selected city is not valid
if (!isValid) {
  cityInput.setCustomValidity('Lütfen listeden şehrinizi seçiniz.');
} else {
  cityInput.setCustomValidity('');
}
});

var passField = document.querySelector("#password");
var btn = document.querySelector(".faeye");
    btn.onclick = function(){
      if(passField.type === "password"){
        passField.type = "text";
        btn.classList.add("hide-btn");
      }else{
        passField.type = "password";
        btn.classList.remove("hide-btn");
      }
    };