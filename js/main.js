(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    // Initiate the wowjs
    new WOW().init();

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.nav-bar').addClass('sticky-top');
        } else {
            $('.nav-bar').removeClass('sticky-top');
        }
    });
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: true,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });

    // --- Unified Gallery & Modal Logic ---
    let galleryImages = [];
    let currentIndex = 0;

    // Updates the list of images based on the current gallery view
    function updateGalleryList() {
        galleryImages = [];
        $('.gallery-img').each(function () {
            galleryImages.push($(this).attr('src'));
        });
    }

    function showImage(index) {
        if (galleryImages.length === 0) return;
        
        // Loop around logic
        if (index < 0) index = galleryImages.length - 1;
        if (index >= galleryImages.length) index = 0;
        
        currentIndex = index;
        $('#modalImage').attr('src', galleryImages[currentIndex]);

        // Hide arrows if it's just one image (like from a marquee link)
        if (galleryImages.length <= 1) {
            $('#prevGalleryBtn, #nextGalleryBtn').hide();
        } else {
            $('#prevGalleryBtn, #nextGalleryBtn').show();
        }
    }

    // Event: Click Gallery Image
    $(document).on('click', '.gallery-img', function () {
        updateGalleryList();
        let clickedSrc = $(this).attr('src');
        currentIndex = galleryImages.indexOf(clickedSrc);
        showImage(currentIndex);
        $('#imageModal').modal('show');
    });

    // Event: Click Marquee Link
    $(document).on('click', '.pop-image-link', function (e) {
        e.preventDefault();
        let clickedSrc = $(this).data('img');
        galleryImages = [clickedSrc]; // Single image mode
        currentIndex = 0;
        showImage(currentIndex);
        $('#imageModal').modal('show');
    });

    // Navigation Button Listeners
    $('#prevGalleryBtn').click(function (e) {
        e.stopPropagation();
        showImage(currentIndex - 1);
    });

    $('#nextGalleryBtn').click(function (e) {
        e.stopPropagation();
        showImage(currentIndex + 1);
    });

    // Keyboard Support
    $(document).keydown(function(e) {
        if ($('#imageModal').is(':visible')) {
            if (e.keyCode == 37) showImage(currentIndex - 1); // Left Arrow
            if (e.keyCode == 39) showImage(currentIndex + 1); // Right Arrow
        }
    });

})(jQuery);