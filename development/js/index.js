document.addEventListener("DOMContentLoaded",function(){
  console.log("Hello from console :)");

    var nextBtn = document.querySelector('#nextPicture');
    var prevBtn = document.querySelector('#prevPicture');
    var images = document.querySelectorAll('.slider li');
    var currentIndex = 0;

    images[currentIndex].classList.add('visible');


    function changeNextPicture (event) {
        event.preventDefault();

        images[currentIndex].classList.remove('visible');

        if (currentIndex === images.length - 1) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }

        images[currentIndex].classList.add('visible');
    };

    function changePrevPicture (event) {
        event.preventDefault();

        images[currentIndex].classList.remove('visible');

        if (currentIndex === 0) {
            currentIndex = images.length - 1;

        } else {
            currentIndex--;
        }

        images[currentIndex].classList.add('visible');
    };

    images[currentIndex].classList.add('visible');
    nextBtn.addEventListener('click', changeNextPicture);
    prevBtn.addEventListener('click', changePrevPicture);
});
