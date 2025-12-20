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

    // ============================================================
    // CRITICAL SECURITY: Anti-Capture & Blackout Provision
    // ============================================================

    // 1. Blackout Logic: Detects focus loss
    const blackout = () => {
        $('body').css({
            'opacity': '0',
            'filter': 'blur(100px)',
            'pointer-events': 'none',
            'transition': 'opacity 0.1s ease'
        });
    };

    const restore = () => {
        $('body').css({
            'opacity': '1',
            'filter': 'none',
            'pointer-events': 'auto'
        });
    };

    // Detect Focus Loss (Triggers when Snipping Tool or OS Capture tool appears)
    window.addEventListener('blur', blackout);
    window.addEventListener('focus', restore);
    
    // Detect Tab/Window switching or browser minimization
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') blackout();
        else restore();
    });

    // 2. Keyboard & Screenshot Key Protections
    document.onkeydown = function (e) {
        // Block PrintScreen (PrtSc) and common capture shortcuts
        if (e.key === "PrintScreen" || e.keyCode === 44 || (e.metaKey && e.shiftKey && e.keyCode === 83)) {
            handleCaptureAttempt();
            return false;
        }

        // Disable Developer Tools, View Source, Save-As, and Print
        if (e.keyCode == 123 || 
            (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 67 || e.keyCode == 74)) || 
            (e.ctrlKey && (e.keyCode == 85 || e.keyCode == 83 || e.keyCode == 80))) {
            return false;
        }
    };

    function handleCaptureAttempt() {
        // Clear Clipboard immediately
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText("SECURITY ALERT: This content is protected. Captured images are unusable.");
        }
        
        blackout();
        alert("SECURITY ALERT: Screen capture detected. This content is protected property of Sneha Complex.");
        setTimeout(restore, 2000);
    }

    // 3. Disable Right-Click & Mobile Context Menus
    document.addEventListener('contextmenu', event => event.preventDefault());
    document.onselectstart = function () { return false; };
    document.oncopy = function () { return false; };

    // 4. PDF Download Protection with Password
    window.downloadProtectedFile = function (fileUrl, fileName) {
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