function changeTabTitle() {
    /**
     * Hide location from a tab name.
     */
    document.title = "UsoGuessr";
}

function hideRegeion() {
    /**
     * Hide 'role="region"' element from all elements.
     */
    document.querySelectorAll('#titlecard > [role="region"]').forEach(function (elm) {
        elm.style.visibility = "hidden";
        elm.style.display = "none";
    });
};

function hideNavigation() {
    /**
     * Hide 'role="navigation"' element from all elements.
     */
    document.querySelectorAll('[role="navigation"]').forEach(function (elm) {
        elm.style.visibility = "hidden";
        elm.style.display = "none";
    });
};

function hideMinimap() {
    /**
     * Hide 'id="minimap"' element from all elements.
     */
    let minimap = document.getElementById('minimap');
    if (minimap === null) {
        return;
    }
    minimap.style.visibility = "hidden";
    minimap.style.display = "none";
};

class UsoCompass {
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.r = config.r;
    }

    fetchAngle() {
        /**
         * Definition of angle
         * N:   0 deg
         * W:  90 deg
         * S: 180 deg
         * E: 270 deg
         */
        let angle = this.fetchAngleByURL();
        return angle;
    }

    deg2rad(deg) {
        return (deg / 180) * Math.PI;
    }

    fetchAngleByAriaValueNow() {
        document.getElementById()
        "aria-valuenow";
    }

    fetchAngleByURL() {
        /**
         * Fetch direction angle infomation from url pathname.
         */
        // Fetch from URL
        let pathname = window.location.pathname.split('/').at(2);
        if (pathname === null) {
            return null;
        }
        let result = pathname.match(/\d+(\.\d+)?h/);
        if (result === null) {
            return 0;
        }
        let angle = result[0].slice(0, -1);
        return parseFloat(angle);
    };

    generateUsoCompassHTML(x, y, r) {
        /**
         *     0             r            2r
         *     |             |             |
         *  0--|-------------|-------------|
         *     |             |             |
         * 30--|----|--------|--------|    |
         *     |    |        |        |    |
         *     |    |        |        |    |
         *  r__|____|________.        |    |
         *     |    |        |        |    |
         *     |    |        |        |    |
         *     |    |--------|--------|    |
         *     |                           |
         * 2r--|---------------------------|
         *
         */

        const svg_path = "";
        const uso_compass_html = `
        <div id="uso-compass" style="width: ${2 * r}; height: ${2 * r}; position: absolute; left: ${x}px; top: ${y}px; z-index: revert-layer;">
            <svg id="uso-compass-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 ${2 * r} ${2 * r}"
            style="width: ${2 * r}; height: ${2 * r}; display: block;">
                <!-- <circle cx="5" cy="5" r="5" style="fill:red;" /> -->
                <circle cx="${r}" cy="${r}" r="${r}" style="fill: #ffffff; opacity: 0.5;" />
                <circle cx="${r}" cy="${r}" r="${r - 30}" style="fill:none; stroke-linecap: round; stroke-width: ${r * 0.1}; stroke: lightgray;" />
                <path id="uso-compass-arc" d="${svg_path}", style="fill: purple; stroke-linecap: round; stroke-width: ${r * 0.1}; stroke: purple;"/>
                <text x="${r}" y="${10}" dominant-baseline="middle" text-anchor="middle">N</text>
                <text x="${r}" y="${2 * r - 10}" dominant-baseline="middle" text-anchor="middle">S</text>
                <text x="${2 * r - 10}" y="${r}" dominant-baseline="middle" text-anchor="middle">E</text>
                <text x="${10}" y="${r}" dominant-baseline="middle" text-anchor="middle">W</text>
            </svg>
        </div>
        `
        return uso_compass_html;
    }

    initUsoCompass() {
        const uso_compass_html = this.generateUsoCompassHTML(this.x, this.y, this.r);
        document.getElementById("scene").insertAdjacentHTML('afterend', uso_compass_html);
    };

    updateUsoCompass() {
        let prevUrl = ''
        let angle = 0;
        const callback = function (mutations) {
            const url = location.href;
            if (url == prevUrl) {
                return;
            }
            prevUrl = url;

            angle = this.fetchAngle();
            const theta = -angle + 90;
            const r = this.r;
            const start_x = r + (r - 30) * Math.cos(this.deg2rad(theta - 45));
            const start_y = r - (r - 30) * Math.sin(this.deg2rad(theta - 45));
            const end_x = r + (r - 30) * Math.cos(this.deg2rad(theta + 45));
            const end_y = r - (r - 30) * Math.sin(this.deg2rad(theta + 45));
            const svg_path = `M ${start_x} ${start_y}
                              A ${r - 30} ${r - 30} 0 0 0 ${end_x} ${end_y}
                              L ${r} ${r} Z`;
            // insert arc to compass
            document.getElementById("uso-compass-arc").setAttribute('d', svg_path);
        };

        const observer = new MutationObserver(callback.bind(this)); // 'bind' is required to use 'this' inside 'callback'
        const targetNode = document;
        const config = { subtree: true, childList: true };
        observer.observe(targetNode, config);
    };

};

function main() {
    console.log("UsoGuessr extension loaded");

    const usoCompassConfig = {
        active: true,
        x: 30,  // top-left-x coordinate of the compass
        y: 100, // top-left-y-coordinate of the compass
        r: 80,  // size of the compass
    };

    changeTabTitle();
    hideRegeion();
    hideNavigation();
    hideMinimap();

    window.addEventListener("load", changeTabTitle);
    window.addEventListener("load", hideRegeion);
    window.addEventListener("load", hideNavigation);
    window.addEventListener("load", hideMinimap);

    // event fired on Street View url is changed
    window.navigation.addEventListener("navigate", changeTabTitle);
    window.navigation.addEventListener("navigate", hideRegeion);
    window.navigation.addEventListener("navigate", hideNavigation); // TODO: resolve delay
    window.navigation.addEventListener("navigate", hideMinimap);

    let uso_compass = new UsoCompass(usoCompassConfig);
    uso_compass.initUsoCompass();
    uso_compass.updateUsoCompass();
};

main();
