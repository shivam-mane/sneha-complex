(function ($) {
    "use strict";

    // 1. Spinner: Handles the loading screen on page load
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    // 2. Initiate the wowjs animations
    new WOW().init();

    // 3. Sticky Navbar & Back to Top Logic
    $(window).scroll(function () {
        // Sticky Navbar
        if ($(this).scrollTop() > 45) {
            $('.nav-bar').addClass('sticky-top');
        } else {
            $('.nav-bar').removeClass('sticky-top');
        }

        // Back to top button visibility
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

    // 4. Header carousel initialization
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

    // 5. Photo Enlarger & Gallery Logic
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

    // Detect Focus Loss & Tab Switching
    window.addEventListener('blur', blackout);
    window.addEventListener('focus', restore);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') blackout();
        else restore();
    });

    // Keyboard & Screenshot Key Protections
    document.onkeydown = function (e) {
        if (e.key === "PrintScreen" || e.keyCode === 44 || (e.metaKey && e.shiftKey && e.keyCode === 83)) {
            handleCaptureAttempt();
            return false;
        }

        // Disable F12, Ctrl+Shift+I, Ctrl+U (View Source), Ctrl+S (Save), Ctrl+P (Print)
        if (e.keyCode == 123 || 
            (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 67 || e.keyCode == 74)) || 
            (e.ctrlKey && (e.keyCode == 85 || e.keyCode == 83 || e.keyCode == 80))) {
            return false;
        }
    };

    function handleCaptureAttempt() {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText("SECURITY ALERT: Content Protected.");
        }
        blackout();
        alert("SECURITY ALERT: Screen capture detected. Content is protected.");
        setTimeout(restore, 2000);
    }

    // Disable Right-Click and Copying
    document.addEventListener('contextmenu', event => event.preventDefault());
    document.onselectstart = function () { return false; };
    document.oncopy = function () { return false; };

    // ============================================================
    // PDF PROTECTION: Viewing & Downloading
    // ============================================================

    // 1. Password Protected Download
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

    // 2. Secure Mobile-Friendly PDF Viewer (Prevents "Open in New Tab")
    window.viewSecurePDF = function (fileUrl) {
        var password = prompt("Enter password to view this document:");

        if (password === "sneha@123") {
            // Create a fullscreen overlay
            var viewerHtml = `
            <div id="pdfOverlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:10000; display:flex; flex-direction:column;">
                <div style="padding:15px; background:#222; display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:white; font-family:sans-serif; font-weight:bold;">Protected Document</span>
                    <button onclick="$('#pdfOverlay').remove()" style="background:#ff4d4d; color:white; border:none; padding:8px 20px; border-radius:4px; cursor:pointer; font-weight:bold;">CLOSE</button>
                </div>
                <div style="flex-grow:1; overflow:hidden; -webkit-overflow-scrolling:touch;">
                    <iframe src="${fileUrl}#toolbar=0&navpanes=0&scrollbar=0" 
                            style="width:100%; height:100%; border:none;" 
                            oncontextmenu="return false;">
                    </iframe>
                </div>
            </div>`;
            $('body').append(viewerHtml);
            
            // Push a state to browser history so 'Back' button closes the PDF instead of leaving the page
            window.history.pushState({viewingPdf: true}, "");
            $(window).on('popstate', function() {
                $('#pdfOverlay').remove();
            });

        } else if (password !== null) {
            alert("Incorrect Password!");
        }
    };

})(jQuery);