export const Carousel = {};

Carousel.interval = null;
Carousel.frame = 1;

Carousel.init = () => {
    clearInterval(Carousel.interval);
    Carousel.frame = 1;
    document.querySelectorAll(".carousel-progress")[0].classList.add("startprogress");
    Carousel.interval = setInterval(() => { Carousel.intervalfun(false, false, true) }, 3000);
}

Carousel.pause = () => {
    clearInterval(Carousel.interval);
    document.querySelectorAll(".carousel-progress")[0].classList.add("pause");
    document.querySelectorAll(".carousel-progress")[0].classList.remove("startprogress");
}

Carousel.play = () => {
    clearInterval(Carousel.interval);
    Carousel.interval = setInterval(() => { Carousel.intervalfun(false, false, true) }, 3000);
    document.querySelectorAll(".carousel-progress")[0].classList.remove("pause");
    document.querySelectorAll(".carousel-progress")[0].classList.add("startprogress");
}

let preframe = 1;
Carousel.intervalfun = (back = false, customframe = false, startprogress = false) => {
    if (startprogress) {
        document.querySelectorAll(".carousel-progress")[0].classList.remove("startprogress");
        let blank = document.querySelectorAll(".carousel-progress")[0].offsetHeight; // refresh animation
        document.querySelectorAll(".carousel-progress")[0].classList.add("startprogress");
    }
    if (back) {
        document.querySelectorAll(".row .stock-widget")[0].classList.remove("frame2");
        document.querySelectorAll(".row .stock-widget")[0].classList.remove("frame3");
        document.querySelectorAll(".row .stock-widget")[0].classList.remove("frame4");
        if (!customframe) Carousel.frame--;
        removeActive();
        if (Carousel.frame < 1) {
            Carousel.frame = 4;
            document.querySelectorAll(".row .stock-widget")[0].classList.add("frame2");
            document.querySelectorAll(".row .stock-widget")[0].classList.add("frame3");
            document.querySelectorAll(".row .stock-widget")[0].classList.add("frame4");
        }
        document.querySelectorAll(".row .stock-widget")[0].classList.add("frame" + Carousel.frame);
        document.querySelectorAll(".carousel-nav li")[Carousel.frame - 1].classList.add("active");
    } else {
        if (!customframe) Carousel.frame++;
        removeActive();
        if (Carousel.frame > 4) {
            document.querySelectorAll(".row .stock-widget")[0].className = "stock-widget";
            document.querySelectorAll(".row .stock-widget")[0].classList.add("col-xl-6");
            Carousel.frame = 1;
        }
        document.querySelectorAll(".carousel-nav li")[Carousel.frame - 1].classList.add("active");
        document.querySelectorAll(".row .stock-widget")[0].classList.add("frame" + Carousel.frame);
    }
}

const removeActive = () => {
    let dots = document.querySelectorAll(".carousel-nav li");
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
}

Carousel.navClick = (index) => {
    preframe = Carousel.frame;
    Carousel.frame = index;
    Carousel.intervalfun((preframe > index), true);
}