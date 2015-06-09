/**
 * Created by Andrey on 09.06.2015.
 */
$(document).on('ready', function() {
    $('.bg').vegas({
        //All images preloaded to browser cache before slideshow is started
        preload: true,
        // DELAY MUST BE ALWAYS LOWER THEN aminationDuration ON ONE SECOND!!!
        // It means, if you change delay to 6000ms, animationDuration must be 7000ms
        animationDuration:6500,
        delay: 5000,
        cover:false,
        slides: [
            { src: 'images/bg_slides_new/1.jpg', animation: 'slide1' },
            { src: 'images/bg_slides_new/2.jpg', animation: 'slide2' },
            { src: 'images/bg_slides_new/3.jpg', animation: 'slide3' },
            { src: 'images/bg_slides_new/4.jpg', animation: 'slide4' },
            { src: 'images/bg_slides_new/5.jpg', animation: 'slide5' },
            { src: 'images/bg_slides_new/6.jpg', animation: 'slide6' },
            { src: 'images/bg_slides_new/7.jpg', animation: 'slide7' },
            { src: 'images/bg_slides_new/8.jpg', animation: 'slide8' },
            { src: 'images/bg_slides_new/9.jpg', animation: 'slide9' },
            { src: 'images/bg_slides_new/10.jpg', animation: 'slide10' },
            { src: 'images/bg_slides_new/11.jpg', animation: 'slide11' }
        ],
        // Animation (transition) methods. You can change this methods in main.css (main.styl, if Development is active)
        animationRegister: [
            'slide1','slide2','slide3',
            'slide4','slide5','slide6',
            'slide7','slide8','slide9',
            'slide10','slide11'
        ]
    });
})