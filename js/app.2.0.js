/**
 * Created by Andrey on 03.06.2015.
 */

var action = 'click' // for testing on pc

window.onload = function() {

    var  IDLE_TIMEOUT = 600; //seconds
    var _idleSecondsCounter = 0;

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
        letter_box:             document.querySelector('.letter-box'),
        dynamic_content:        document.querySelector('#dynamic-content'),
        index_title:            document.querySelector('#index-title h3')
    }

    setTimeout(function() {
        showItem($elements.index_title, false)
    }, 1000)

    $elements.letter_box.addEventListener(action, sendEmail, false)
    document.addEventListener(action, activateMenu, false)

    //MAIN MENU START

    function activateMenu() {
        var $menu = document.querySelector('.menu-wrapper')
        document.removeEventListener(action, activateMenu, false)

        handleUnactive()

        showItem(document.querySelector('#active-menu'), false)

        $elements.amenities_menu.style.display = 'block'
        $elements.design_menu.style.display = 'block'

        $menu.classList.add('menu-active');
        document.querySelector('#menu-logo').classList.add('menu-logo-active')

        stopBackgroundSlider()

        setTimeout(activateMenuStepTwo, 1400)
    }

    function stopBackgroundSlider() {
        $($elements.bg).vegas('pause');
    }

    function activateMenuStepTwo() {
        var $menu = document.querySelector('#active-menu'),
            li = $menu.getElementsByTagName('li')

        for (var i = 0; i < li.length; i++) { (function(i){
            if(li[i].dataset.name) {
                li[i].addEventListener(action, showLinkedMenu, false)

            } else {
                li[i].addEventListener(action, renderSitePlan, false)
            }
            setTimeout(showItem(li[i],'add','inline-block'), 1000)
        })(i) }
    }

    function renderSitePlan() {
        $($elements.dynamic_content).html('')
        hideItem(document.querySelector('#index-title'), 'add')
        vegasRemoveSlideshow()
        $elements.bg.style.backgroundImage = 'url(images/site_plan.jpg)'
        clearMenus()
    }

    function showLinkedMenu(event) {
        var btn = event.target,
            menu_name = btn.dataset.name,
            $menu = document.querySelector('#active-menu'),
            li = $menu.getElementsByTagName('li')

        for (var i = 0; i < li.length; i++) { (function(i){
            li[i].classList.remove('active')
        })(i) }

        clearMenus()
        setTimeout(function() {btn.classList.add('active')},100)

        document.getElementById(menu_name).classList.remove('hidden')
        document.getElementById(menu_name).classList.add('active')
    }

    function clearMenus() {
        [$elements.design_menu, $elements.amenities_menu].forEach(function(e,i) {
            e.classList.remove('active')
        });

        [$elements.design_menu_button, $elements.amenities_menu_button, $elements.site_menu_button].forEach(function(e,i) {
            e.classList.remove('active')
        })
    }
    //MAIN MENU END

    // INNER MENU START
    [$elements.design_menu, $elements.amenities_menu].forEach(function(e) {
        var buttons = e.getElementsByTagName('li')

        for(var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener(action, showCollection, false)
        }
    });

    function showCollection(event) {
        var btn = event.target

        vegasRemoveSlideshow()
        hideEmailForm()

        for(var i = 0; i < $elements.menu_items.length; i++) {
            $elements.menu_items[i].classList.remove('active')
        }

        btn.classList.add('active')

        activateCollectionMainGallery(btn.dataset.name ,function() {
            attachHandlers()
        })
    }

    function activateCollectionMainGallery(gallery_name, callback) {
        hideItem(document.querySelector('#index-title'), 'add')
        hideItem($elements.letter_box)

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
            partial_link = 'html_partials/collections/'+slide.dataset.group+'/index.html'

        showItem($elements.letter_box, false, 'inline')
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

    // SEND EMAIL
    document.querySelector('.form-close').addEventListener(action, hideEmailForm, false)

    function sendEmail() {
        document.querySelector('#email-form').style.cssText = 'top:600px;'

        setTimeout(function() {
            $('.keyboard').keyboard({
                usePreview: false,
                alwaysOpen: true,
                autoAccept: true,
                appendTo: $('#form-keyboard'),
                position: {
                    of: '.email-form-wrapper',
                    my: 'center top',
                    at: 'center bottom',
                    offset: '0 20'
                }
            });
        }, 1000)
    }

    function hideEmailForm() {
        document.querySelector('#email-form').style.cssText = 'top:-1000px'
    }

    $('form').on('submit', function(e) {
        var data = []
        $('form input, form textarea').each(function(i,e) {
            var e = $(e)
            data.push({
                field: e.attr('name'),
                value: e.val()
            })
        })

        $.get('mailer/mailer.php', data).done(function(data) {
            console.log(data)
        })

        return false
    })
    //SEND EMAIL END

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

    function showItem(element, action, display) {
        element.style.display = display || 'block';
        setTimeout(function() {
            if(action == 'add') {
                element.classList.add('visible')
            } else if(action == 'remove') {
                element.classList.remove('hidden')
            } else {
                element.className = 'visible'
            }
        }, 100)
    }

    function hideItem(element,action) {
        element.classList.add('hidden')
        setTimeout(function() {
            element.style.display = 'none';
        }, 300)
    }

    function handleUnactive() {
        document.onclick = function() {
            _idleSecondsCounter = 0;
        };
        window.setInterval(CheckIdleTime, 1000);
    }

    function CheckIdleTime() {
        _idleSecondsCounter++;

        if (_idleSecondsCounter >= IDLE_TIMEOUT) {
            document.location.reload()
        }
    }

    function vegasRemoveSlideshow() {
        try
        {
            $('.bg').vegas('destroy')
        }
        catch(error)
        {
            //console.log(error);
        }
    }
}