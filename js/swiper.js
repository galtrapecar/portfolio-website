window.onload = () => {

    const swiper_statues = new Swiper('.swiper-statues', {
        slidesPerView: 1,
        loop: true,
        debugger: true,
    });

    const swiper_prog = new Swiper('.swiper-prog', {
        slidesPerView: 1,
        loop: true,
        debugger: true,
    });

    const swiper_numbers = new Swiper('.swiper-numbers', {
        slidesPerView: 1,
        loop: true,
        debugger: true,
    });

    const swiper_design = new Swiper('.swiper-design', {
        slidesPerView: 1,
        loop: true,
        debugger: true,
    });

    setInterval(() => {
        document.querySelector('.swiper-numbers').swiper.slideNext();
        document.querySelector('.swiper-design').swiper.slideNext();
    }, 5000);

    function plugin({ swiper, on }) {

        on('init', () => {
            document.querySelector(".swiper-left").style.display = 'none';
        });

        on('slideChange', () => {

            console.log(swiper.activeIndex);
            swiper_statues.slideTo(swiper.activeIndex + 1);

            if (swiper.activeIndex == 0) {
                document.querySelector(".swiper-left").style.display = 'none';
            } else {
                document.querySelector(".swiper-left").style.display = 'initial';
            }

            if (swiper.activeIndex == 3) {
                document.querySelector(".swiper-right").style.display = 'none';
            } else {
                document.querySelector(".swiper-right").style.display = 'initial';
            }

        });
    }

    const swiper_main = new Swiper('.swiper-main', {
        modules: [plugin],
        slidesPerView: 1,
        navigation: {
            nextEl: ".swiper-right",
            prevEl: ".swiper-left",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        debugger: true,
    });
}

