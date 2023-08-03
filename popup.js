

// not currently using

let scrapeButton = document.getElementById('scrape-button')

let list = document.getElementById('list')

chrome.browserAction.onClicked.addListener(function(tab) {
    alert('working?');
});



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let photoUrls = request.photoUrls;

    // reset
    list.innerHTML = '';

    if (photoUrls == null || photoUrls.length == 0) {
        let li = document.createElement(`li`)
        li.innerText = "No photos found"
        list.appendChild(li)
    } else {
        photoUrls.forEach((photo) => {


            let li = document.createElement(`li`)
            // let span = document.createElement(`span`)

            li.classList.add("list-group-item")
            li.classList.add("d-flex")
            li.classList.add("justify-content-between")
            li.classList.add("align-items-center")


            var xhr = new XMLHttpRequest();
            xhr.open('GET', photo, true);
            xhr.responseType = 'blob';

            xhr.onload = function(e) {

            var img = document.createElement('img');

            img.src = window.URL.createObjectURL(this.response);
                
            img.setAttribute("height", "468");
            img.setAttribute("width", "584");
            
            img.style.property = ("object-fit: cover")

            li.appendChild(img);

            };

            xhr.send();

            // TODO: add download button

            

            list.appendChild(li)
        }) 
    }
})



async function scrapePhotoFromPage() {
    let photos = document.getElementsByClassName("_aagv")
    console.log("hello")

    // console.log(photos)
    let photoUrls = [];
    for (var i = 0; i < photos.length; i++) {
        photoUrls.push(photos[i].getElementsByTagName("img")[0].src)
    }

    chrome.runtime.sendMessage({photoUrls});


    // // alert(photos);
}




scrapeButton.addEventListener("click",  async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true }
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions)

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: scrapePhotoFromPage,
    })
})




