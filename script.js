const textInputTop = document.getElementById('text-input-top');
const textInputBottom = document.getElementById('text-input-bottom');
const textInputSubheading = document.getElementById('text-input-subheading');
const textInputMarkBottom = document.getElementById('text-input-mark-bottom');
const advancedToggle = document.getElementById('advanced-toggle');
const advancedInputs = document.getElementById('advanced-inputs');
const logoTextTop = document.getElementById('logo-text-top');
const logoTextSubheading = document.getElementById('logo-text-subheading');
const logoTextBottom = document.getElementById('logo-text-bottom');
const logoTextMarkBottom = document.getElementById('logo-text-mark-bottom');
const downloadBtn = document.getElementById('download-btn');
const logoContainer = document.getElementById('logo-container');
const MARK_BOTTOM_MAX_SIZE = 9;
const MARK_BOTTOM_MIN_SIZE = 3;
const SUBHEADING_MAX_SIZE = 13;
const SUBHEADING_MIN_SIZE = 7;
const BOTTOM_TEXT_MAX_SIZE = 30;
const BOTTOM_TEXT_MIN_SIZE = 1;

function fitTextToWidth(element, maxSize, minSize) {
    if (!element || element.clientWidth <= 0) return;

    let low = minSize;
    let high = maxSize;
    let best = minSize;

    while (high - low > 0.1) {
        const mid = (low + high) / 2;
        element.style.fontSize = `${mid}px`;

        if (element.scrollWidth <= element.clientWidth + 0.5) {
            best = mid;
            low = mid;
        } else {
            high = mid;
        }
    }

    element.style.fontSize = `${best.toFixed(2)}px`;
}

function fitMarkBottomText() {
    fitTextToWidth(logoTextMarkBottom, MARK_BOTTOM_MAX_SIZE, MARK_BOTTOM_MIN_SIZE);
}

function fitSubheadingText() {
    fitTextToWidth(logoTextSubheading, SUBHEADING_MAX_SIZE, SUBHEADING_MIN_SIZE);
}

function fitBottomText() {
    fitTextToWidth(logoTextBottom, BOTTOM_TEXT_MAX_SIZE, BOTTOM_TEXT_MIN_SIZE);
}

// Update top and bottom text as you type
textInputTop.addEventListener('input', (e) => {
    logoTextTop.textContent = e.target.value || "KOLEJ\nVOKASIONAL";
});

textInputSubheading.addEventListener('input', (e) => {
    logoTextSubheading.textContent = e.target.value || "KEMENTERIAN PENDIDIKAN MALAYSIA";
    fitSubheadingText();
});

textInputBottom.addEventListener('input', (e) => {
    logoTextBottom.textContent = e.target.value || "";
    fitBottomText();
});

textInputMarkBottom.addEventListener('input', (e) => {
    logoTextMarkBottom.textContent = e.target.value || "bersama membina masa depan";
    fitMarkBottomText();
});

advancedToggle.addEventListener('change', () => {
    advancedInputs.classList.toggle('hidden', !advancedToggle.checked);
});

window.addEventListener('resize', fitMarkBottomText);
window.addEventListener('resize', fitSubheadingText);
window.addEventListener('resize', fitBottomText);
window.addEventListener('load', () => {
    if (!logoTextBottom.textContent.trim()) {
        logoTextBottom.textContent = "";
    }
    fitMarkBottomText();
    fitSubheadingText();
    fitBottomText();
});

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
        fitMarkBottomText();
        fitSubheadingText();
        fitBottomText();
    });
}

// Download Function
downloadBtn.addEventListener('click', () => {
    // Increase render scale for a sharper exported PNG.
    const exportScale = Math.max(4, window.devicePixelRatio || 1);

    // html2canvas takes the element and a settings object
    html2canvas(logoContainer, {
        backgroundColor: null, // This makes the background transparent!
        scale: exportScale,
        useCORS: true,         // Helps with loading external fonts/images
        onclone: (clonedDoc) => {
            const clonedLogoContainer = clonedDoc.getElementById('logo-container');
            const clonedMarkBottom = clonedDoc.getElementById('logo-text-mark-bottom');

            if (clonedLogoContainer) {
                // Add export-only breathing room so descenders are not clipped.
                clonedLogoContainer.style.paddingBottom = '10px';
                clonedLogoContainer.style.overflow = 'visible';
            }

            if (clonedMarkBottom) {
                // Slightly larger line box for y/q/p/j during canvas text render.
                clonedMarkBottom.style.lineHeight = '1.35';
                clonedMarkBottom.style.paddingBottom = '4px';
            }
        }
    }).then(canvas => {
        // Create an invisible link to trigger the download
        const link = document.createElement('a');
        const top = logoTextTop.textContent.trim().replace(/\s+/g, '-');
        const bottom = logoTextBottom.textContent.trim().replace(/\s+/g, '-');
        link.download = `${top}-${bottom}-logo.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});
