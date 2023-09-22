(function(){
    var rating = document.querySelector('.rating');
    var handle = document.getElementById('toggle-rating');
    handle.onchange = function(event) {
        rating.classList.toggle('rating', handle.checked);
    };
}());
