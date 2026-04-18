// DOM Elements - IP Locator
const ipInput = document.getElementById('ip-input');
const ipBtn = document.getElementById('ip-btn');
const myIpBtn = document.getElementById('my-ip-btn');
const ipResults = document.getElementById('ip-results');
const ipLoader = document.getElementById('ip-loader');
const ipError = document.getElementById('ip-error');

// DOM Elements - Phone Validator
const phoneInput = document.getElementById('phone-input');
const phoneBtn = document.getElementById('phone-btn');
const phoneResults = document.getElementById('phone-results');
const phoneLoader = document.getElementById('phone-loader');
const phoneError = document.getElementById('phone-error');

// Map Instance
let mapInstance = null;

// Helper: UI State Management
function showLoader(section) {
    if (section === 'ip') {
        ipResults.classList.add('hidden');
        ipError.classList.add('hidden');
        ipLoader.classList.remove('hidden');
    } else {
        phoneResults.classList.add('hidden');
        phoneError.classList.add('hidden');
        phoneLoader.classList.remove('hidden');
    }
}

function hideLoader(section) {
    if (section === 'ip') {
        ipLoader.classList.add('hidden');
    } else {
        phoneLoader.classList.add('hidden');
    }
}

function showError(section, message) {
    hideLoader(section);
    if (section === 'ip') {
        ipError.textContent = message;
        ipError.classList.remove('hidden');
    } else {
        phoneError.textContent = message;
        phoneError.classList.remove('hidden');
    }
}

// --- IP Locator Logic ---

async function fetchIpInfo(ip = '') {
    showLoader('ip');

    try {
        const apiKey = '60376b5e22280d8f4aab42b147768fbb';
        const url = ip ? `http://api.ipstack.com/${ip}?access_key=${apiKey}` : `http://api.ipstack.com/check?access_key=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.success === false) {
            throw new Error(data.error.info || 'Invalid IP Address');
        }

        displayIpResults(data);
    } catch (error) {
        showError('ip', `Failed to locate IP: ${error.message}`);
    }
}

function displayIpResults(data) {
    hideLoader('ip');
    ipResults.classList.remove('hidden');

    // Populate Data
    document.getElementById('res-ip').textContent = data.ip;
    document.getElementById('res-location').textContent = `${data.city || 'Unknown'}, ${data.region_name || 'Unknown'}, ${data.country_name || 'Unknown'}`;
    document.getElementById('res-isp').textContent = data.connection?.isp || 'N/A';
    document.getElementById('res-timezone').textContent = data.time_zone?.id || 'N/A';

    // Setup Map
    const lat = data.latitude || 0;
    const lon = data.longitude || 0;

    if (mapInstance) {
        mapInstance.setView([lat, lon], 13);
        // Clear existing markers
        mapInstance.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                mapInstance.removeLayer(layer);
            }
        });
    } else {
        mapInstance = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);
    }

    L.marker([lat, lon]).addTo(mapInstance)
        .bindPopup(`<b>${data.city}</b><br>${data.country}`)
        .openPopup();

    // Fix leaflet rendering issue when unhidden
    setTimeout(() => {
        mapInstance.invalidateSize();
    }, 100);
}

ipBtn.addEventListener('click', () => {
    let ip = ipInput.value.trim();

    // Extract hostname if a full URL is provided
    if (ip.startsWith('http://') || ip.startsWith('https://')) {
        try {
            const parsedUrl = new URL(ip);
            ip = parsedUrl.hostname;
            ipInput.value = ip; // Update the input field visually
        } catch (e) {
            // Ignore parse errors, let the API handle it
        }
    }

    if (ip) {
        fetchIpInfo(ip);
    } else {
        showError('ip', 'Please enter an IP address or domain');
    }
});

myIpBtn.addEventListener('click', () => {
    ipInput.value = '';
    fetchIpInfo();
});

ipInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        ipBtn.click();
    }
});

// --- Phone Validator Logic ---

async function validatePhone() {
    const rawInput = phoneInput.value.trim();

    if (!rawInput) {
        showError('phone', 'Please enter a phone number');
        return;
    }

    showLoader('phone');

    try {
        const apiKey = '5HdXXrVa5BUxv2HEc76LOeHVRbMTLEiv';
        const url = `https://api.apilayer.com/number_verification/validate?number=${encodeURIComponent(rawInput)}`;

        const response = await fetch(url, {
            headers: {
                'apikey': apiKey
            }
        });

        if (!response.ok) {
            throw new Error('Network error or invalid request');
        }

        const data = await response.json();
        displayPhoneResults(data);
    } catch (error) {
        showError('phone', `Failed to validate: ${error.message}`);
    }
}

function displayPhoneResults(data) {
    hideLoader('phone');
    phoneResults.classList.remove('hidden');

    const badge = document.getElementById('phone-status-badge');

    if (data && data.valid) {
        badge.className = 'status-badge valid';
        badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Valid Number';

        document.getElementById('res-phone-intl').textContent = data.international_format || 'N/A';
        document.getElementById('res-phone-national').textContent = data.local_format || 'N/A';
        document.getElementById('res-phone-country').textContent = `${data.country_name} (${data.country_code})`;
        document.getElementById('res-phone-type').textContent = data.line_type || 'Unknown';

    } else {
        badge.className = 'status-badge invalid';
        badge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Invalid Number';

        document.getElementById('res-phone-intl').textContent = 'N/A';
        document.getElementById('res-phone-national').textContent = 'N/A';
        document.getElementById('res-phone-country').textContent = 'N/A';
        document.getElementById('res-phone-type').textContent = 'N/A';
    }
}

phoneBtn.addEventListener('click', validatePhone);

phoneInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        phoneBtn.click();
    }
});

// Initial Focus
window.onload = () => {
    ipInput.focus();
};
