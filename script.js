const VSE_LAT = 50.08417205702758;
const VSE_LON = 14.441107081770891;

function toRad(deg) {
    return (deg * Math.PI) / 180;
}

/**
 * Formuli pro výpočet vzdušné vzdálenosti (Haversine formula) jsem převzal
 * z https://en.wikipedia.org/wiki/Haversine_formula
 */
function haversineDistanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000; // poloměr Země v metrech

    const phi1 = toRad(lat1);
    const phi2 = toRad(lat2);
    const dPhi = toRad(lat2 - lat1);
    const dLambda = toRad(lon2 - lon1);

    const a =
        Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(dLambda / 2) * Math.sin(dLambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

document.addEventListener("DOMContentLoaded", () => {
    const locateButton = document.getElementById("locateButton");
    const statusEl = document.getElementById("status");
    const userCoordsEl = document.getElementById("userCoords");
    const distanceEl = document.getElementById("distance");

    locateButton.addEventListener("click", () => {
        statusEl.textContent = "Zjišťuji tvoji polohu…";
        distanceEl.textContent = "–";
        userCoordsEl.textContent = "–";

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    // souřadnice uživatele
                    userCoordsEl.textContent = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;

                    // spočítáme vzdálenost
                    const distanceMeters = haversineDistanceMeters(lat, lon, VSE_LAT, VSE_LON);

                    const distanceKm = distanceMeters / 1000;

                    const kmStr = distanceKm.toFixed(2);
                    const mStr = Math.round(distanceMeters).toString();

                    distanceEl.textContent = `${kmStr} km (${mStr} m)`;
                    statusEl.textContent = "Poloha zjištěna. Vzdálenost byla spočítána.";
                },
                (error) => {
                    handleGeoError(error, statusEl);
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0
                }
            );
        } else {
            statusEl.textContent = "Geolocation is not supported by this browser";
        }
    });
});

function handleGeoError(error, statusEl) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            statusEl.textContent = "Přístup k poloze byl odmítnut";
            break;
        case error.POSITION_UNAVAILABLE:
            statusEl.textContent = "Poloha není dostupná";
            break;
        default:
            statusEl.textContent = "Došlo k chybě při zjišťování polohy";
    }
}