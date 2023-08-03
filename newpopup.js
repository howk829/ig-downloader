

getCurrentTab();


let list = document.getElementById('list')

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
           
            li.classList.add("list-group-item")
            li.classList.add("d-flex")
            li.classList.add("justify-content-between")
            li.classList.add("align-items-center")


            let button = document.createElement(`button`)
                button.setAttribute("class", "btn");
                button.setAttribute("class", "btn-secondary");
                button.setAttribute("type", "button");
                button.innerHTML = "Download Image"

            let xhr = new XMLHttpRequest();
            xhr.open('GET', photo, true);
            xhr.responseType = 'blob';

            xhr.onload = function(e) {

                let img = document.createElement('img');

                img.src = window.URL.createObjectURL(this.response);
                    
                img.setAttribute("height", "468");
                img.setAttribute("width", "584");
                
                img.style.property = ("object-fit: cover")

                li.appendChild(img);

                button.addEventListener('click', (e) => {


                    var nameArray = photo.toString().split('=')
                    var name = nameArray[nameArray.length - 2]
                    var finalName = name.substring(0, name.length - 4)

                    const a = document.createElement("a");
                    a.href = img.src;
                    a.download = `${finalName}.png`
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
            
                })

            };

            xhr.send();
            
           



            // TODO: add download button
            // let span = document.createElement(`span`)
            // span.setAttribute("class", "bi-download");

            // button.appendChild(span)

             
            list.appendChild(li)
            list.appendChild(button)
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

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true }
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions)

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: scrapePhotoFromPage,
    })
}





