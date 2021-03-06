/**
 * Created by Andrey on 03.06.2015.
 */

var action = 'click' // for testing on pc
var swiper

window.onload = function() {

    var  IDLE_TIMEOUT = 600; //seconds
    var _idleSecondsCounter = 0;

    var swiper_default_options = {
        pagination: '.swiper-pagination',
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        paginationClickable: true,
        slidesPerView: 'auto',
        onInit: launchPreview,
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
        menu_items:             document.querySelector('.secondary-menu').getElementsByTagName('li'),

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
        clearMainMenu()
        document.querySelector('.site-menu').classList.add('active')
        clearSecondaryMenu()
    }

    function showLinkedMenu(event) {
        var btn = event.target,
            menu_name = btn.dataset.name,
            $menu = document.querySelector('#active-menu'),
            li = $menu.getElementsByTagName('li')

        //for (var i = 0; i < li.length; i++) { (function(i){
        //    li[i].classList.remove('active')
        //})(i) }

        clearSecondaryMenu()
        setTimeout(function() {btn.classList.add('active')},300)

        document.getElementById(menu_name).classList.remove('hidden')
        document.getElementById(menu_name).classList.add('active')

        if(menu_name == 'design-menu')
            $('#TWH').click()

        if(menu_name == 'amenities-menu')
            $('#AMG').click()
    }

    function clearSecondaryMenu() {
        [$elements.design_menu, $elements.amenities_menu].forEach(function(e,i) {
            e.classList.remove('active')
        });
    }

    function clearMainMenu() {
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

        //clearSecondaryMenu()
        for(var i = 0; i < $elements.menu_items.length; i++) {
            $elements.menu_items[i].classList.remove('active')
            if($($elements.menu_items[i]).find('i').length) {
                $($elements.menu_items[i]).find('i').css('opacity','0')
            }
        }

        if(!btn.dataset.name) {
            btn = $(btn).parent()
        } else {
            btn = $(btn)
        }

        $(btn).addClass('active')

        activateCollectionMainGallery(btn.data('name') ,function() {
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

        $('.secondary-menu').find('li.active i').css('opacity', '0')

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
        $('.secondary-menu').find('li.active i').css('opacity', '1')
        $($elements.dynamic_content).load(partial_link, function() {
            renderSlideshow('#collection-slideshow', function() {
               var btn = document.getElementsByTagName('button')[0]
                //btn.addEventListener(action, function() {
                //    $($elements.dynamic_content).load('html_partials/'+btn.dataset.collection+'.html', function() {
                //        activateCollectionMainGallery(btn.dataset.collection, function(){ attachHandlers() })
                //    })
                //}, false)
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

        prepareEmailForm()

        setTimeout(function() {
            $('.keyboard').keyboard({
                usePreview: false,
                alwaysOpen: true,
                autoAccept: true,
                appendTo: $('#form-keyboard'),
                layout: 'custom',
                customLayout : {
                    'normal': [
                        '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
                        '@ q w e r t y u i o p [ ] \\',
                        'a s d f g h j k l ; \' {enter}',
                        '{shift} z x c v b n m , . / {shift}',
                        '{space} {cancel} {extender}'
                    ],
                    'shift': [
                        '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
                        '{tab} Q W E R T Y U I O P { } |',
                        'A S D F G H J K L : " {enter}',
                        '{shift} Z X C V B N M < > ? {shift}',
                        '{space} {cancel} {extender}'
                    ]
                },
                position: {
                    of: '.email-form-wrapper',
                    my: 'center top',
                    at: 'center bottom',
                    offset: '0 20'
                }
            }).autocomplete( "disable" );
        }, 1000)
    }

    function prepareEmailForm() {
       var form = document.querySelector('#email-form')
        form.querySelector('#email-product-name').innerHTML = document.querySelector('.product-details').innerHTML.replace(/<[^>]*>/g, "")
    }

    function hideEmailForm() {
        document.querySelector('#email-form').style.cssText = 'top:-1000px'
    }

    $('form').on('submit', function(e) {
        var data = {}
        var cs =  swiper.slides[swiper.activeIndex]
        var slides = swiper.container[0].getElementsByClassName('swiper-slide')

        $('form button').text('Sending...')

        function getPlanUrls() {
            var urls = []
            for(var i = 0; i < slides.length ; i++) {
                urls.push(slides[i].dataset.url)
            }
            return urls
        }

        data.user_name = $('form input[name=name]').val()
        data.friend_email = $('form input[name=friend-email]').val()
        data.message = $('form textarea').val()
        data.group =  cs.dataset.group,
        data.url =    getPlanUrls(),
        data.product_name=  cs.dataset.name

        setTimeout(function() {
            $.post('http://localhost/mailer/mailer.php', data).done(function(data) {
                var form_wrapper = $('.email-form-wrapper')

                form_wrapper.html('')
                form_wrapper.css('background-color','#ccd8e4')
                $('.email-header span').hide()

                showItem(document.querySelector('.thx-message'), 'remove')

                setTimeout(function() {
                    hideEmailForm()
                }, 10000)
            })
        }, 200)

        return false
    })
    //SEND EMAIL END

    // HELPERS
    function launchPreview(swiper) {
        var slide = swiper.slides[swiper.activeIndex]
        var preview_container = document.querySelector('#town-collection-perview')

        if (slide.dataset.coordinatex && preview_container) {

            var cp = slide.dataset.collection
            var preview_block

            if (cp == 1) {
                document.querySelector('#collection-th1').classList.remove('hidden')
                document.querySelector('#collection-th2').classList.add('hidden')
                document.querySelector('#collection-th3').classList.add('hidden')
                preview_block = preview_container.querySelector('.town-collection-block')
            } else if(cp == 2) {
                document.querySelector('#collection-th2').classList.remove('hidden')
                document.querySelector('#collection-th1').classList.add('hidden')
                document.querySelector('#collection-th3').classList.add('hidden')
                preview_block = preview_container.querySelector('.town-collection-block2')
            } else {
                document.querySelector('#collection-th3').classList.remove('hidden')
                document.querySelector('#collection-th1').classList.add('hidden')
                document.querySelector('#collection-th2').classList.add('hidden')
                preview_block = preview_container.querySelector('.town-collection-block3')
            }

            setTimeout(function(){
                preview_block.style.cssText = 'left:'+slide.dataset.coordinatex+'px;'
            },200)
        }
    }

    function renderSlideshow(container_name, callback) {
        var container = container_name || '#collection-slideshow'

        swiper = new Swiper(container, swiper_default_options);

        swiper.on('onSlideChangeEnd', function(swiper) {
            var slide = swiper.slides[swiper.activeIndex]
            var preview_container = document.querySelector('#town-collection-perview')

            if(slide.dataset.coordinatex && preview_container) {

                var cp = slide.dataset.collection
                var preview_block

                if (cp == 1) {
                    document.querySelector('#collection-th1').classList.remove('hidden')
                    document.querySelector('#collection-th2').classList.add('hidden')
                    document.querySelector('#collection-th3').classList.add('hidden')
                    preview_block = preview_container.querySelector('.town-collection-block')
                } else if(cp == 2) {
                    document.querySelector('#collection-th2').classList.remove('hidden')
                    document.querySelector('#collection-th1').classList.add('hidden')
                    document.querySelector('#collection-th3').classList.add('hidden')
                    preview_block = preview_container.querySelector('.town-collection-block2')
                } else {
                    document.querySelector('#collection-th3').classList.remove('hidden')
                    document.querySelector('#collection-th1').classList.add('hidden')
                    document.querySelector('#collection-th2').classList.add('hidden')
                    preview_block = preview_container.querySelector('.town-collection-block3')
                }

                setTimeout(function(){
                    preview_block.style.cssText = 'left:'+slide.dataset.coordinatex+'px;'
                },200)
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