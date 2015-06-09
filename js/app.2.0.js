/**
 * Created by Andrey on 03.06.2015.
 */

var action = 'click' // for testing on pc

window.onload = function() {

    var current_slide = false,
        slides = [
            'slide2', 'slide3', 'slide4', 'slide5'
        ],
        fade_process = 0,
        stop_bg_slide_interval;

    var swiper_default_options = {
        pagination: '.swiper-pagination',
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflow: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false
        }
    }

    var $elements = {
        menu:                   document.getElementById('menu'),
        menu_items:             document.getElementById('menu').getElementsByTagName('li'),

        design_menu:            document.getElementById('design-menu'),
        design_menu_button:     document.querySelector('.design-menu'),

        amenities_menu:         document.getElementById('amenities-menu'),
        amenities_menu_button:  document.querySelector('.amenities-menu'),

        site_menu:              document.getElementById('site-menu'),
        site_menu_button:       document.querySelector('.site-menu'),

        bg:                     document.querySelector('.bg'),
        dynamic_content:        document.querySelector('#dynamic-content'),
        index_title:            document.querySelector('#index-title h3')
    }

    setTimeout(function() {
        $elements.index_title.className = 'visible'
    }, 1000)

    $elements.menu.addEventListener(action, activateMenu, false)

    //MAIN MENU START

    function activateMenu() {
        var $menu = document.querySelector('.menu-wrapper')

        document.querySelector('#active-menu').className = 'visible'
        $menu.classList.add('menu-active');
        document.querySelector('#menu-logo').classList.add('menu-logo-active')

        stopBackgroundSlider()

        setTimeout(activateMenuStepTwo, 1400)
    }

    function stopBackgroundSlider() {
        //$('.bg').vegas('pause');
        //if(fade_process)
        //{
        //    stop_bg_slide_interval = setInterval(function() {
        //        if(!fade_process) {
        //            $elements.bg.style.webkitAnimationPlayState = "paused"
        //            clearInterval(stop_bg_slide_interval)
        //        }
        //    }, 2000)
        //} else {
        //    $elements.bg.style.webkitAnimationPlayState = "paused"
        //}
    }

    function activateMenuStepTwo() {
        var $menu = document.querySelector('#active-menu'),
            li = $menu.getElementsByTagName('li')

        for (var i = 0; i < li.length; i++) { (function(i){
            li[i].addEventListener(action, showLinkedMenu, false)
            setTimeout(li[i].classList.add('visible'), 1000)
        })(i) }
    }

    function showLinkedMenu(event) {
        var btn = event.target,
            menu_name = btn.dataset.name,
            $menu = document.querySelector('#active-menu'),
            li = $menu.getElementsByTagName('li')

        for (var i = 0; i < li.length; i++) { (function(i){
            setTimeout(li[i].classList.remove('active'), 1000)
        })(i) }

        clearMenus()
        btn.classList.add('active')

        document.getElementById(menu_name).classList.remove('hidden')
        document.getElementById(menu_name).classList.add('active')
        //setTimeout(function() { document.getElementById(menu_name).classList.add('index-top') }, 650)
    }

    function clearMenus() {
        [$elements.design_menu, $elements.amenities_menu, $elements.site_menu].forEach(function(e,i) {
            e.classList.remove('active')
            //e.classList.remove('index-top')
        });

        [$elements.design_menu_button, $elements.amenities_menu_button, $elements.site_menu_button].forEach(function(e,i) {
            e.classList.remove('active')
        })
    }
    //MAIN MENU END

    // INNER MENU START
    [$elements.design_menu, $elements.amenities_menu, $elements.site_menu].forEach(function(e) {
        var buttons = e.getElementsByTagName('li')

        for(var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener(action, showCollection, false)
        }
    });

    function showCollection(event) {
        var btn = event.target
        $('.bg').vegas('destroy')
        for(var i = 0; i < $elements.menu_items.length; i++) {
            $elements.menu_items[i].classList.remove('active')
        }

        btn.classList.add('active')

        activateCollectionMainGallery(btn.dataset.name ,function() {
            attachHandlers()
        })
    }

    function activateCollectionMainGallery(gallery_name, callback) {
        document.querySelector('#index-title').classList.add('hidden')

        $($elements.dynamic_content).load('html_partials/'+gallery_name+'.html', function() {
            var container = '.'+gallery_name.replace('_','-')+'-main-gallery'
            renderSlideshow(container, callback)
        })

        $elements.bg.style.background = 'white'
    }

    function attachHandlers() {
        var slides = document.getElementsByClassName('swiper-slide')
        for(var i = 0; i < slides.length; i++) {
            slides[i].addEventListener(action, showCollectionDetails, false)
        }
    }

    function showCollectionDetails(event) {
        var slide = event.target,
            partial_link = 'html_partials/collections/'+slide.dataset.group+'/'+slide.dataset.collection+'.html'

        //jquery(
        $($elements.dynamic_content).load(partial_link, function() {
            renderSlideshow('#collection-slideshow', function() {
               var btn = document.getElementsByTagName('button')[0]
                btn.addEventListener(action, function() {
                    $($elements.dynamic_content).load('html_partials/'+btn.dataset.collection+'.html', function() {
                        activateCollectionMainGallery(btn.dataset.collection, function(){ attachHandlers() })
                    })
                }, false)
            })
        })
    }
    // INNER MENU END

    //COLLECTIONS
    //END COLLECTIONS

    // HELPERS
    function renderSlideshow(container_name, callback) {
        var container = container_name || '#collection-slideshow'

        var swiper = new Swiper(container, swiper_default_options);

        swiper.on('onSlideChangeEnd', function(swiper) {
            var slide = swiper.slides[swiper.activeIndex]
            var preview_container = document.querySelector('#town-collection-perview')

            if(slide.dataset.coordinatex && preview_container) {
                var preview_block = preview_container.querySelector('.town-collection-block')
                    preview_block.style.cssText = 'left:'+slide.dataset.coordinatex+'px;'
            }
        })

        callback && callback()
    }

    //$elements.bg.addEventListener("animationiteration",function(e){
    //    fade_process = 1
    //    for(var i = 0; i < slides.length; i++) {
    //        if(!current_slide) {
    //            $elements.bg.classList.add(slides[0])
    //            current_slide = slides[0]
    //            break
    //        } else {
    //            if(current_slide == slides[slides.length-1]) {
    //                $elements.bg.style.opacity = '0'
    //                $elements.bg.className = 'bg'
    //                current_slide = false
    //                break
    //            } else {
    //                var index = slides.indexOf(current_slide)
    //                $elements.bg.classList.add(slides[index+1])
    //                current_slide = slides[index+1]
    //                break
    //            }
    //        }
    //    }
    //    setTimeout(function() { fade_process = 0 }, 2000)
    //},false);
}