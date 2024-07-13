// function updateTabTitle(tabId) {
//     chrome.scripting.executeScript({
//         target: { tabId: tabId },
//         func: function () { document.title = "UsoGuessr"; },
//     })
// }
//
// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//     console.log(changeInfo.title);
//     if (changeInfo.status == "complete") {
//         updateTabTitle(tabId);
//     }
// });