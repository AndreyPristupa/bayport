/**
 * Created by Andrey on 09.06.2015.
 */
$(document).on('ready', function() {
    $('.bg').vegas({
        //All images preloaded to browser cache before slideshow is started
        preload: true,
        // DELAY MUST BE ALWAYS LOWER THEN aminationDuration ON ONE SECOND!!!
        // It means, if you change delay to 6000ms, animationDuration must be 7000ms
        animationDuration:12500,
        delay: 11000,
        //animationDuration:1250,
        //delay: 1100,
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
        ],
        walk: function(slide_num) {

            function raiseTitle(slide_num) {
                var slide = slide_num + 1
                var title = document.querySelector('.slideTitle_'+slide)
                setTimeout(function() {title.querySelector('h2').classList.remove('hidden')}, 1000)
                setTimeout(function() {title.querySelector('h3').classList.remove('hidden')}, 3000)
            }

            function clearTitles(slide_num) {
                var title = document.querySelector('.slideTitle_'+slide_num)

                if(title) {
                    title.querySelector('h3').classList.add('hidden')
                    title.querySelector('h2').classList.add('hidden')
                }
            }

            switch(slide_num) {
                case 0:
                    raiseTitle(slide_num)
                    break;
                case 4:
                    raiseTitle(slide_num)
                    break;
                case 8:
                    raiseTitle(slide_num)
                    break;
                default :
                    clearTitles(slide_num)
                    break;
            }
        }
    });
})