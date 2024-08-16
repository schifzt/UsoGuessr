function changeTabTitle() {
    // Hide location from a tab name.
    document.title = "UsoGuessr";
}

function hideRegeion() {
    // Hide 'role="region"' element from all elements.
    document.querySelectorAll('[role="region"]').forEach(function (elm) {
        elm.style.visibility = "hidden";
        elm.style.display = "none";
    });
};

function hideNavigation() {
    // Hide 'role="navigation"' element from all elements.
    document.querySelectorAll('[role="navigation"]').forEach(function (elm) {
        elm.style.visibility = "hidden";
        elm.style.display = "none";
    });
};

function hideMinimap() {
    // Hide 'id="minimap"' element from all elements.
    let minimap = document.getElementById('minimap');
    if (minimap === null) {
        return;
    }
    minimap.style.visibility = "hidden";
    minimap.style.display = "none";
};

function fetchAngle() {
    // Fetch direction angle infomation from url pathname.
    let pathname = window.location.pathname.split('/').at(2);
    if (pathname === null) {
        return null;
    }
    let result = pathname.match(/\d+(\.\d+)?h/);
    if (result === null) {
        return 0;
    }
    let angle = result[0].slice(0, -1);
    return angle;
};

function drawModernCompass(x, y, r, pi) {
    const targetElement = document.getElementById("scene");
    let theta = 0;
    const path_command = `M ${x + r * Math.cos(theta + 1 / 4 * pi)} ${y - r * Math.sin(theta + 1 / 4 * pi)}
                          A ${r} ${r} 0 0 0 ${x + r * Math.cos(theta + 3 / 4 * pi)} ${y - r * Math.sin(theta + 3 / 4 * pi)}
                          L ${x} ${y} Z`;
    const compass = `
    <div id="modern-compass-box" style="position: relative"; z-index: revert-layer;">
        <div id="modern-compass"">
            <!-- <p style="text-align: center; line-height: 60px;"></p> -->
            <svg id="modern-compass-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${x + r + 30} ${y + r + 30}"
            style="width: ${x + r + 30}; height: ${y + r + 30}; display: block;">
                <!-- <circle cx="5" cy="5" r="5" style="fill:red;" /> -->
                <circle cx="${x}" cy="${y}" r="${r}" style="fill:none; stroke-linecap: round; stroke-width: ${r * 0.1}; stroke: gray;" />
                <circle cx="${x}" cy="${y}" r="${r + 30}" style="fill: #ffffff; opacity: 0.5;" />
                <path d="${path_command}", style="fill: purple; stroke-linecap: round; stroke-width: ${r * 0.1}; stroke: purple;"/>
                <text x="${x}" y="${y - (r + 10)}" dominant-baseline="middle" text-anchor="middle">N</text>
                <text x="${x}" y="${y + (r + 15)}" dominant-baseline="middle" text-anchor="middle">S</text>
                <text x="${x - (r + 15)}" y="${y}" dominant-baseline="middle" text-anchor="middle">E</text>
                <text x="${x + (r + 15)}" y="${y}" dominant-baseline="middle" text-anchor="middle">W</text>
            </svg>
        </div>
    </div>
    `
    targetElement.insertAdjacentHTML('afterend', compass);
};

function updateModernCompass(x, y, r, pi) {
    let prevUrl = '';
    const callback = function (mutations) {
        url = location.href;
        if (url == prevUrl) {
            return;
        }
        prevUrl = url;
        let angle = fetchAngle();

        // update compass
        // let compass_text = document.querySelector("div#modern-compass>p");
        // compass_text.innerHTML = angle;
        let theta = -(angle / 180) * pi; // angle[deg] to theta[rad]
        const path_command = `M ${x + r * Math.cos((theta + pi / 2) - pi / 4)} ${y - r * Math.sin((theta + pi / 2) - pi / 4)}
                              A ${r} ${r} 0 0 0 ${x + r * Math.cos((theta + pi / 2) + pi / 4)} ${y - r * Math.sin((theta + pi / 2) + pi / 4)}
                              L ${x} ${y} Z`;
        let compass_svg = document.querySelector("svg#modern-compass-svg>path");
        compass_svg.setAttribute('d', path_command);
    };

    const observer = new MutationObserver(callback);
    const targetNode = document;
    const config = { subtree: true, childList: true };
    observer.observe(targetNode, config);
};

function main(config) {
    console.log("UsoGuessr extension loaded");

    changeTabTitle();
    hideRegeion();
    hideNavigation();
    hideMinimap();
    fetchAngle();

    window.addEventListener("load", changeTabTitle);
    window.addEventListener("load", hideRegeion);
    window.addEventListener("load", hideNavigation);
    window.addEventListener("load", hideMinimap);

    // event fired on Street View url is changed
    window.navigation.addEventListener("navigate", changeTabTitle);
    window.navigation.addEventListener("navigate", hideRegeion);
    window.navigation.addEventListener("navigate", hideNavigation); // TODO: resolve delay
    window.navigation.addEventListener("navigate", hideMinimap);

    if (config.modernCompass) {
        const x = 100;
        const y = 150;
        const r = 50;
        const pi = 22 / 7;
        drawModernCompass(x, y, r, pi);
        updateModernCompass(x, y, r, pi);
    }

};

const config = { modernCompass: true };
main(config);
