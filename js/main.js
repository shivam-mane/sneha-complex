(function ($) {
    "use strict";

    // Spinner: Handles the loading screen on page load
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    // Initiate the wowjs animations
    new WOW().init();

    // Sticky Navbar: Adds background on scroll
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.nav-bar').addClass('sticky-top');
        } else {
            $('.nav-bar').removeClass('sticky-top');
        }
    });

    // Back to top button visibility and logic
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    // Header carousel initialization
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: true,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });

    // Photo Enlarger & Gallery Logic
    $(document).ready(function () {
        let images = [];
        let currentIdx = 0;

        function updateImageList() {
            images = [];
            $('.gallery-img').each(function () {
                images.push($(this).attr('src'));
            });
        }

        $(document).on('click', '.gallery-img', function () {
            updateImageList();
            const src = $(this).attr('src');
            currentIdx = images.indexOf(src);
            showGalleryModal(src);
        });

        $(document).on('click', '.pop-image-link', function () {
            const src = $(this).data('img');
            images = [src];
            currentIdx = 0;
            showGalleryModal(src);
        });

        function showGalleryModal(src) {
            $('#modalImage').attr('src', src);
            $('#imageModal').modal('show');

            if (images.length <= 1) {
                $('#prevBtn, #nextBtn').hide();
            } else {
                $('#prevBtn, #nextBtn').show();
            }
        }

        $('#nextBtn').click(function (e) {
            e.stopPropagation();
            currentIdx = (currentIdx + 1) % images.length;
            $('#modalImage').attr('src', images[currentIdx]);
        });

        $('#prevBtn').click(function (e) {
            e.stopPropagation();
            currentIdx = (currentIdx - 1 + images.length) % images.length;
            $('#modalImage').attr('src', images[currentIdx]);
        });
    });

    // ==========================================
    // SECURITY: Disable Copy, Right-Click, and Screenshots
    // ==========================================

    // 1. Disable Right Click
    document.addEventListener('contextmenu', event => event.preventDefault());

    // 2. Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+U, PrintScreen, Ctrl+S, Ctrl+P)
    document.onkeydown = function(e) {
        if (e.keyCode == 123 || // F12
            (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) || // Ctrl+Shift+I
            (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) || // Ctrl+Shift+C
            (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) || // Ctrl+Shift+J
            (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) || // Ctrl+U
            (e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)) || // Ctrl+S
            (e.ctrlKey && e.keyCode == 'P'.charCodeAt(0)) || // Ctrl+P
            (e.keyCode == 44)) { // PrintScreen
            return false;
        }
    };

    // 3. Disable Text Selection/Copying via JS (Backup to CSS)
    document.onselectstart = function() { return false; };
    document.oncopy = function() { return false; };

    /**
     * Global PDF Download Protection Function
     */
    window.downloadProtectedFile = function(fileUrl, fileName) {
        var password = prompt("Please enter the password to download this document:");
        
        if (password === "sneha@123") {
            var link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (password !== null) {
            alert("Incorrect Password!");
        }
    };

})(jQuery);