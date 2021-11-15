// storing the info scraped from upsplash
let mainStorage = null;
let altStorage = null;
// flags to make sure that you only change max heights once
let mainflag = false;
let altflag = false;
// check if a picture has been enlarged
var englarge = false;

 // when we hover over a picture
function onHover(pic) {
    // pic is the current image we are hovering over accessed by passing in the current image by using the "this" keywordP
    if (mainflag == false) {
        maxHeightMain();
    }
    if (altflag == false) {
        maxHeightAlt();
    }
    // when the user clicks on an iamge
    pic.onclick = function () {
        // loop through the storages to check if the imaged clicked on is a main theme image
        for(let i = 0; i < mainStorage.results.length; i++) {
            // if it is a main theme image set the image as the image to be enlarged
            if (pic.id == mainStorage.results[i].id) {
                document.getElementById("enlargedImg").src = mainStorage.results[i].urls["regular"];
            }
        }
        // loop through the storages to check if the imaged clicked on is an alt theme image
        for(let i = 0; i < altStorage.results.length; i++) {
            // if it is a alt theme image set the image as the image to be enlarged
            if (pic.id == altStorage.results[i].id) {
                document.getElementById("enlargedImg").src = altStorage.results[i].urls["regular"];
            }
        }
        // add css to change to enlarge mode
        document.getElementById("closeButton").style.display = "initial";
        document.getElementById("cover").classList.add("covered");
        document.getElementById("enlargedImg").classList.add("enlarged");
        document.getElementById("enlargedImg").style.display = "initial";
        enlarge = true;
        enlargeImage(pic);
    }
}

// function to make the enlarged image bigger
function enlargeImage(originalPic) {
    // get the current screen size
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;
    // get the old height the image we're supposed to enlarge
    var oldHeight = originalPic.clientHeight;
    var oldWidth = originalPic.clientWidth;
    // goal is to scale the image, but keep the new Image proportional to the old image, like (oldLength/oldHeight) = (newLength/newHeight)
    // try to use optimization from Calculus to try and find the best dimensions to cover the most area possible 
    newHeight = ((2 * windowWidth + 2 * windowHeight)) / 2;
    newWidth = (oldWidth / oldHeight) * (newHeight);
    // make sure the image isn't bigger than the window, and make sure the new dimensions are proportional to the old image dimensions
    while ((newHeight >= windowHeight - 80) || (newWidth >= windowWidth - 80)) {
        // if the image is too big scale the image down
        newHeight = newHeight * 0.95;
        newWidth = newWidth * 0.95;
    }
    // get the ratio that the image dimensions has increased and scale the old image by that ratio
    document.getElementById("enlargedImg").style.maxHeight = newHeight + "px";
    document.getElementById("enlargedImg").style.maxWidth = newWidth + "px";
}

// hold event handlers for buttons that work after the window has loaded (such as the close enlarge mode button and random button)
window.onload = function () {

    // when someone clicks the close button on the top right in the enlarged mode
    document.getElementById("closeButton").onclick = function () {
        console.log(enlarge)
        // check if an image is currently enlarge and the user is in enlarge mode
        if (enlarge == true) {
            // take away css to get out of enlarge mode. 
            document.getElementById("closeButton").style.display = "none";
            document.getElementById("enlargedImg").src = "";
            document.getElementById("enlargedImg").classList.remove("enlarged");
            document.getElementById("enlargedImg").style.display = "none";
            document.getElementById("cover").classList.remove("covered");
            enlarge = false;
        }
    }

    // main theme random button
    document.getElementById("mainRandomButton").onclick = function() {
        // max is the total amount of main theme images we have minus 1.
        var max = mainStorage.results.length - 1;
        // number is random integer we get. We then use the number to index the main Storage to get a random image. 
        // set the random image to be enlarged, by putting the newly picked image into the enlarge div, enlarging the image with enlargeImage(), and adding css for the enlarge mode.
        var number = Math.floor(Math.random() * ((max + 1)));
        document.getElementById("enlargedImg").src = mainStorage.results[number].urls["regular"];
        enlargeImage(document.getElementById(mainStorage.results[number].id));
        // add css to change to enlarge mode
        document.getElementById("closeButton").style.display = "initial";
        document.getElementById("cover").classList.add("covered");
        document.getElementById("enlargedImg").classList.add("enlarged");
        document.getElementById("enlargedImg").style.display = "initial";
        enlarge = true;
    }

    // alternate theme random button
    document.getElementById("altRandomButton").onclick = function() {
        // max is the total amount of alternate theme images we have minus 1.
        var max = altStorage.results.length - 1;
        // number is random integer we get. We then use the number to index the alternate Storage to get a random image. 
        // set the random image to be enlarged, by putting the newly picked image into the enlarge div, enlarging the image with enlargeImage(), and adding css for the enlarge mode.
        var number = Math.floor(Math.random() * ((max + 1)));
        document.getElementById("enlargedImg").src = altStorage.results[number].urls["regular"];
        enlargeImage(document.getElementById(altStorage.results[number].id));
        // add css to change to enlarge mode
        document.getElementById("closeButton").style.display = "initial";
        document.getElementById("cover").classList.add("covered");
        document.getElementById("enlargedImg").classList.add("enlarged");
        document.getElementById("enlargedImg").style.display = "initial";
        enlarge = true;
    }
}

 // load the images from upsplash based on today's theme
 async function loadPictures (theme, main, upsplash_access_key) {
    // remove special characters from the theme passed in so the query doesn't break
    theme = theme.replace(/[^a-zA-Z ]/g, '');
    // connecting to the API and making a request for the API info
    const response = await fetch('https://api.unsplash.com/search/photos?per_page=30&query=' + theme +'&client_id=' + upsplash_access_key);
    // get what the server sent back (response) and then make it into json so we can read and parse
    data = await response.json()
    // for just in case Upsplash doesn't have any images for the themes
    if (data.results.length == 0) {
        console.log(main ? "Upsplash has no images for today's main theme" : "Upsplash has no images for today's alternate theme");
    }
    // go through all the images we've just scrapped from upsplash
    for (let i = 0; i < data.results.length; i ++){
        // for each image we make a new image tag and add it to the html. we make sure that we give each image tag the onmouseover attribute
        currentpic = data.results[i]
        var div = document.createElement("div");
        div.setAttribute("class", "imagediv");
        div.setAttribute("id", currentpic.id + "div");
        // add images to either to main theme pics div or alttheme pics depending on which functions was called
        if (main == true){
            document.querySelector('.mainthemepics').appendChild(div);
        }
        else {
            document.querySelector('.altthemepics').appendChild(div);
        }
        // make the image and add attributes like class and id to the image
        image = document.createElement('img')
        image.setAttribute("id", currentpic["id"])
        image.setAttribute("onmouseover", "onHover(this)")
        image.setAttribute("class", "theimgs")
        // putting the image into the DOM.
        image.src = currentpic.urls["small"];
        document.getElementById(currentpic.id + "div").appendChild(image);
        // now also make a little description with crediting stuff for the image
        // make a div for the description, put that description div into the div with the image
        imgdescriptdiv = document.createElement("div")
        document.getElementById(currentpic.id + "div").appendChild(imgdescriptdiv);
        imgdescriptdiv.setAttribute("id", currentpic.id + "descriptiondiv")
        imgdescriptdiv.setAttribute("class", "imgdescript")
        // now you actually make the text part by making a p element and adding it into the imgdescript div we made
        imgdescript = document.createElement("p");
        imgdescript.setAttribute("id", currentpic.id + "description");
        imgdescript.setAttribute("class", "imgdescripttext");
        document.getElementById(currentpic.id + "descriptiondiv").appendChild(imgdescript);
        // now we change the DOM to actually have text
        photographer = currentpic.user;
        document.getElementById(currentpic.id + "description").innerHTML = `Photo by <a href = '${photographer.links.html}?utm_source=sketchdailywebapp&utm_medium=referral'> ${photographer.name} </a> from <a href="https://unsplash.com/?utm_source=sketchdailywebapp&utm_medium=referral"> Upsplash`;
    }
    // storing info so we don't really have to request again. also calls functions to change the image div heights
    if (main == true) {
        mainStorage = data;
    } 
    else {
        altStorage = data;
    }
}

// change the max height of the main theme divs
function maxHeightMain () {
    for (let i = 0; i < mainStorage.results.length; i ++) {
        id = mainStorage.results[i].id
        pic = document.getElementById(mainStorage.results[i].id)
        // make the pictures div the same as the picture height
        pic.parentElement.style.maxHeight = pic.height + "px";
    }
    // flag this so we only run it once and don't waste runtime
    mainflag = true;
}

// change the max height of the alt theme divs
function maxHeightAlt () {
    for (let i = 0; i < altStorage.results.length; i ++) {
        id = altStorage.results[i].id
        pic = document.getElementById(altStorage.results[i].id)
        // make the pictures div the same as the picture height
        pic.parentElement.style.maxHeight = pic.height + "px";
    }
    // flag this so we only run it once and don't waste runtime
    altflag = true;
}

// code to make the navigation header look good even if the table on past theme page is overflowing
window.onresize = fixHeader;
window.addEventListener('scroll', fixHeader)
function fixHeader() {
    try {
        document.getElementById("navHeader").style.width = document.getElementById("pastweekTable").offsetWidth + "px";
    }
    catch {
        window.removeEventListener('scroll', fixHeader);
    }
}