function hideNavigationInfo() {
    // Description:
    //   hide 'role="navigation"' element from all elements
    //

    document.querySelectorAll('[role="navigation"]').forEach(function (elm) {
        elm.style.visibility = "hidden";
        elm.style.display = "none";
    });
};

function hideMinimap() {
    // Description:
    //   hide 'id="minimap"' element from all elements
    //

    var elm = document.getElementById('minimap');
    if (elm === null) {
        return;
    }
    elm.style.visibility = "hidden";
    elm.style.display = "none";
}

console.log("PseudoGuessr extension loaded");

window.addEventListener("load", hideNavigationInfo, false);
window.addEventListener("load", hideMinimap, false);

// event fired on Street View url is changed
window.navigation.addEventListener("navigate", hideNavigationInfo, false);
window.navigation.addEventListener("navigate", hideMinimap, false);