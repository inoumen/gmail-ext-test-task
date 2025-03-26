chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes('compose')) {
        chrome.tabs.sendMessage(tabId, { event: 'createNewEmail' })
    }
})