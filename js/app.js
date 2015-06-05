/**
 * Created by Andrey on 31.05.2015.
 */

var action = 'click' // for testing on pc

window.onload = function() {

    var current_slide = false,
        slides = [
        'slide3','slide4','slide5','slide6','slide7','slide8','slide9'
        ],
        fade_process = 0,
        stop_bg_slide_interval;

    var $elements = {
            menu: document.getElementById('menu'),
            menu_items: document.getElementById('menu').getElementsByTagName('li'),
            bg: document.querySelector('.bg'),

            design_menu: document.getElementById('design-menu'),
            design_menu_button: document.querySelector('.design-menu'),
            design_towns_collection_button: document.querySelector('.towns-collection'),
            design_towns_collection_main_gallery: document.querySelector('#towns-collection'),

            dynamic_content: document.querySelector('#dynamic-content'),

            amenities_menu: document.getElementById('amenities-menu'),
            amenities_menu_button: document.querySelector('.amenities-menu'),
            amenities_gallery: document.getElementById('amenities-gallery'),
            amenities_gallery_button: document.querySelector('.amenities-gallery'),

            site_menu: document.getElementById('site-menu'),
            site_menu_button: document.querySelector('.site-menu'),

            content: document.querySelector('#content'),
            index_title: document.querySelector('#index-title h3')
        }

    setTimeout(function() {
        $elements.index_title.className = 'visible'
    }, 1000)

    $elements.menu.addEventListener(action, activateMenu, false)
    $elements.design_menu_button.addEventListener(action, activateDesignMenu, false)
    $elements.amenities_menu_button.addEventListener(action, activateAmenitiesMenu, false)
    $elements.site_menu_button.addEventListener(action, activateSiteMenu, false)
    $elements.amenities_gallery_button.addEventListener(action, activateAmenitiesGallery, false)

    //$elements.design_towns_collection_button.addEventListener(action, showTownsCollection, false)

    for(var i = 0; i < $elements.menu_items.length; i++) {
        $elements.menu_items[i].addEventListener(action, showCollection, false)
    }

    $elements.bg.addEventListener("animationiteration",function(e){
        fade_process = 1
        for(var i = 0; i < slides.length; i++) {
            if(!current_slide) {
                $elements.bg.addClass(slides[0])
                current_slide = slides[0]
                break
            } else {
                if(current_slide == slides[slides.length-1]) {
                    console.log(current_slide, slides[slides.length-1])
                    $elements.bg.style.opacity = '0'
                    $elements.bg.className = 'bg'
                    current_slide = false
                    break
                } else {
                    var index = slides.indexOf(current_slide)
                    $elements.bg.addClass(slides[index+1])
                    current_slide = slides[index+1]
                    break
                }
            }
        }
        setTimeout(function() { fade_process = 0 }, 2000)
    },false);

    function showCollection(event) {
        var btn = event.target

        for(var i = 0; i < $elements.menu_items.length; i++) {
            $elements.menu_items[i].removeClass('active')
        }

        btn.addClass('active')

        activateCollectionMainGallery(btn.dataset.name ,function() {
            attachHandlers()
        })
    }

    function stopBackgroundSlider() {
        if(fade_process)
        {
            stop_bg_slide_interval = setInterval(function() {
                if(!fade_process) {
                    $elements.bg.style.webkitAnimationPlayState = "paused"
                    clearInterval(stop_bg_slide_interval)
                }
            }, 2000)
        } else {
            $elements.bg.style.webkitAnimationPlayState = "paused"
        }
    }

    function activateCollectionMainGallery(gallery_name ,callback) {
        document.querySelector('#index-title').addClass('hidden')
        $($elements.dynamic_content).load('html_partials/'+gallery_name+'.html', function() {
            var swiper = new Swiper('.'+gallery_name.replace('_','-')+'-main-gallery', {
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
                    slideShadows : false
                }
            });
            callback()
        })

        $elements.design_towns_collection_button.addClass('active')
        $elements.bg.style.background = 'white'
        $elements.design_towns_collection_main_gallery.removeClass('hidden')
    }

    function activateAmenitiesGallery() {
        document.querySelector('#index-title').addClass('hidden')
        $('#collection-preview').load('html_partials/amenities_gallery.html', function() {
            var swiper = new Swiper('.swiper-container', {
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
                    slideShadows : true
                }
            });
        })

        $elements.amenities_gallery_button.addClass('active')
        $elements.bg.style.background = 'white'
        $elements.amenities_gallery.className = 'visible'
    }

    function activateSiteMenu() {
        activateInnerMenu('site_menu')
    }

    function activateAmenitiesMenu() {
        activateInnerMenu('amenities_menu')
    }

    function activateDesignMenu() {
        activateInnerMenu('design_menu')
    }

    function activateInnerMenu(menu) {
        clearMenus()
        $elements[menu].className = 'visible active'
        $elements[menu+'_button'].classList.add('active')

        setTimeout(function() { $elements[menu].classList.add('index-top') }, 650)
    }

    function clearMenus() {
        [$elements.design_menu, $elements.amenities_menu, $elements.site_menu].forEach(function(e,i) {
            e.removeClass('active')
            e.removeClass('index-top')
        });

        [$elements.design_menu_button, $elements.amenities_menu_button, $elements.site_menu_button].forEach(function(e,i) {
            e.removeClass('active')
        })
    }

    function activateMenu() {
        var $menu = document.querySelector('.menu-wrapper')

        document.querySelector('#active-menu').className = 'visible'
        $menu.classList.add('menu-active');
        document.querySelector('#menu-logo').classList.add('menu-logo-active')

        stopBackgroundSlider()

        setTimeout(activateMenuStepTwo, 1400)
    }

    function activateMenuStepTwo() {

        var $menu = document.querySelector('.menu-wrapper'),
            li = $menu.getElementsByTagName('li')

        for (var i = 0; i < li.length; i++) { (function(i){
            setTimeout(li[i].classList.add('visible'), 1000)
        })(i) }
    }

    function attachHandlers() {
        var buttons = document.getElementsByTagName('button')
        for(var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener(action, showCollectionDetails, false)
        }
    }

    function showCollectionDetails(event) {
        var btn = event.target,
            partial_link = 'html_partials/collections/'+btn.dataset.group+'/'+btn.dataset.collection+'.html',
            target_element = document.querySelector('#collection-preview')

        $elements.design_towns_collection_main_gallery.addClass('hidden')
        //jquery(
        $(target_element).load(partial_link, function() {
            var swiper = new Swiper('#collection-slideshow', {
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
                    slideShadows : true
                }
            });
        })
    }
}


Element.prototype.hasClass = function (className) {
    return new RegExp(' ' + className + ' ').test(' ' + this.className + ' ');
};

Element.prototype.addClass = function (className) {
    if (!this.hasClass(className)) {
        this.className += ' ' + className;
    }
    return this;
};

Element.prototype.removeClass = function (className) {
    var newClass = ' ' + this.className.replace(/[\t\r\n]/g, ' ') + ' ';
    if (this.hasClass(className)) {
        while (newClass.indexOf( ' ' + className + ' ') >= 0) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        this.className = newClass.replace(/^\s+|\s+$/g, ' ');
    }
    return this;
};

Element.prototype.toggleClass = function (className) {
    var newClass = ' ' + this.className.replace(/[\t\r\n]/g, " ") + ' ';
    if (this.hasClass(className)) {
        while (newClass.indexOf(" " + className + " ") >= 0) {
            newClass = newClass.replace(" " + className + " ", " ");
        }
        this.className = newClass.replace(/^\s+|\s+$/g, ' ');
    } else {
        this.className += ' ' + className;
    }
    return this;
};

