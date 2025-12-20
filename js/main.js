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
        if ($(this).scrollTop() > 45) {
            $('.nav-bar').addClass('sticky-top');
        } else {
            $('.nav-bar').removeClass('sticky-top');
        }

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
            images.length <= 1 ? $('#prevBtn, #nextBtn').hide() : $('#prevBtn, #nextBtn').show();
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

    window.addEventListener('blur', blackout);
    window.addEventListener('focus', restore);
    document.addEventListener('visibilitychange', () => {
        document.visibilityState === 'hidden' ? blackout() : restore();
    });

    document.onkeydown = function (e) {
        if (e.key === "PrintScreen" || e.keyCode === 44 || (e.metaKey && e.shiftKey && e.keyCode === 83)) {
            handleCaptureAttempt();
            return false;
        }
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
        alert("SECURITY ALERT: Screen capture attempt detected. Content protected.");
        setTimeout(restore, 2000);
    }

    document.addEventListener('contextmenu', event => event.preventDefault());
    document.onselectstart = function () { return false; };
    document.oncopy = function () { return false; };

    // ============================================================
    // PDF PROTECTION: Viewing (Canvas) & Downloading
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

    // 2. Secure PDF Viewer (Canvas Rendering to block "Open in New Tab")
    window.viewSecurePDF = function (fileUrl) {
        var password = prompt("Enter password to view this document:");
        if (password !== "sneha@123") {
            if (password !== null) alert("Incorrect Password!");
            return;
        }

        // Overlay Construction
        var viewerHtml = `
        <div id="pdfOverlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.98); z-index:10000; overflow-y:auto; -webkit-overflow-scrolling:touch;">
            <div style="position:sticky; top:0; padding:15px; background:#111; display:flex; justify-content:space-between; align-items:center; z-index:10001; border-bottom: 2px solid #333;">
                <span style="color:white; font-family:sans-serif; font-weight:bold;">SECURE PREVIEW - SNEHA COMPLEX</span>
                <button onclick="$('#pdfOverlay').remove()" style="background:#ff4d4d; color:white; border:none; padding:8px 20px; border-radius:4px; cursor:pointer; font-weight:bold;">CLOSE</button>
            </div>
            <div id="pdfCanvasContainer" style="display:flex; flex-direction:column; align-items:center; padding:20px 10px;">
                <p id="pdfLoading" style="color:white; font-family:sans-serif; margin-top:50px;">Decrypting Secure Preview...</p>
            </div>
        </div>`;
        $('body').append(viewerHtml);

        // PDF.js Engine Setup
        var pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        var loadingTask = pdfjsLib.getDocument(fileUrl);
        loadingTask.promise.then(function(pdf) {
            $('#pdfLoading').remove();
            
            for (var pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                renderPage(pdf, pageNum);
            }
        }, function (reason) {
            alert("Security Error: Unable to render document. " + reason);
            $('#pdfOverlay').remove();
        });

        function renderPage(pdf, num) {
            var canvas = document.createElement('canvas');
            canvas.style.marginBottom = "25px";
            canvas.style.width = "95%"; 
            canvas.style.maxWidth = "850px";
            canvas.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
            // Prevent interaction with the canvas
            canvas.style.pointerEvents = "none";
            document.getElementById('pdfCanvasContainer').appendChild(canvas);

            pdf.getPage(num).then(function(page) {
                var viewport = page.getViewport({scale: 2.0}); 
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext);
            });
        }

        // Mobile "Back" button management
        window.history.pushState({viewingPdf: true}, "");
        $(window).on('popstate.pdfClose', function() {
            $('#pdfOverlay').remove();
            $(window).off('popstate.pdfClose');
        });
    };

})(jQuery);