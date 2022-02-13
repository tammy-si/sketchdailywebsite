// storing the info scraped from upsplash
let mainStorage = null;
let altStorage = null;
// flags to make sure that you only change max heights once
let mainflag = false;
let altflag = false;
// check if a picture has been enlarged
var englarge = false;
// default time for the timer is 5 mins (which is 300 secs). time is in seconds
var time = 300;
var mouseOverDigits = false;
// to keep track of the cursor location in the timer by remebering with span digit the cursor is supposed to be on.
var cursorLocation;
// inputtedNums will holds only the numbers the user has inputted as a list.
var inputtedNums = [];

 // when we hover over a picture
function onHover(pic) {
    // pic is the current image we are hovering over accessed by passing in the current image by using the "this" keyword
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
// need the window.onload because otherwise the functions might run before the DOM fully loads
window.onload = function () {
    cursorLocation = document.getElementById("digitSec");
    // event handler to restrict the input for the timer, also to update the timerDigits 
    document.getElementById("timerInput").oninput = function (event) {
        updateDigits();
        updateInputted();
        // timerInputVal is the numbers the users have inputted
        var timerInputVal = document.getElementById("timerInput").value;
        // regex for whether a string contains only numbers
        var regex = /^\d+$/;
        if (timerInputVal.length == 0) {
            updateDigits();
        }
        // if they user doesn't input a number
        if (!timerInputVal.match(regex)){
            // remove the character just inputted
            if (cursorLocation == document.getElementById("digitSec") || inputtedNums[1].classList.contains("cursorSpecial")) {
                console.log("coolio")
                document.getElementById("timerInput").value = timerInputVal.slice(1, timerInputVal.length);
                document.getElementById("timerInput").setSelectionRange(0, 0);
                console.log("this one");
            } else {
                console.log("check")
                document.getElementById("timerInput").value =  (timerInputVal.slice(0, inputtedNums.indexOf(cursorLocation)) + timerInputVal.slice((inputtedNums.indexOf(cursorLocation) + 1), timerInputVal.length));
            }
            updateDigits();
            updateInputted();
            keepCursor();
            return false;
        }
        console.log(timerInputVal.length);
        // for if the user adds more than the max amount of digits
        if (timerInputVal.length > 6) {
            console.log("rolly");
            // remove the first digit and move the timer caret
            document.getElementById("timerInput").value = timerInputVal.slice(1, timerInputVal.length);
        }
        // update the timerDigits
        updateDigits();
        // get element's of html digits (including h,m,s) that have been inputted and stores it as an array
        var inputted =  Array.prototype.slice.call(document.getElementsByClassName("timerInputted"));
        inputtedNums = [];
        // then we remove the (h,m,s) and just put the digits elments into inputted
        for (var index = 0; index < inputted.length; index++){
            if (inputted[index].id !== "digitH" && inputted[index].id !== "digitM" && inputted[index].id !== "digitSec") {
                inputtedNums.push(inputted[index]);
            }
        }
        keepCursor();
        inputted =  Array.prototype.slice.call(document.getElementsByClassName("timerInputted"));
    }
    
    // go into input mode when the user tries to click on the finalTimer
    document.getElementById("finalTimer").onclick = function() {
        document.getElementById("timerInput").focus();
    }

    // when the user is currently trying to input numbers into timer
    document.getElementById("timerInput").onfocus = function () {
        document.getElementById("finalTimer").style.display = "none";
    }
    // when the user is currenlty clicking while they're in input mode
    document.getElementById("timerInput").onblur = function () {
        // if they user is clicking off the input box, go off input mode and display the final time
        if (mouseOverDigits == false) {
            document.getElementById("finalTimer").style.display = "initial";
        }
        else {
            document.getElementById("timerInput").focus();
        }
    }

    // to keep track if the user is clicking off the input box or not. 
    document.getElementById("timerDigits").onmouseover = function() {
        mouseOverDigits = true;
    }
    document.getElementById("timerDigits").onmouseleave = function() {
        mouseOverDigits = false;
    }

    // when someone clicks the close button on the top right in the enlarged mode
    document.getElementById("closeButton").onclick = function () {
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
        document.getElementById("closeButton").style.display = " initial";
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
    // for get multiple pages of images
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
    // storing info so we don't really have to request again.
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

// code to update the timerDigits
function updateDigits() {
    let timerInputVal = document.getElementById("timerInput").value;
    if (timerInputVal.length > 6) {
        return;
    }
    if (timerInputVal.length == 0) {
        document.getElementById("digitH").classList.remove("timerInputted");
        document.getElementById("digitM").classList.remove("timerInputted");
        document.getElementById("digitSec").classList.remove("timerInputted");
    }
    // start from the right side and go left till finish putting all the digits the user has inputted so far
    for (let i = 0; i <= timerInputVal.length - 1; i++) {
        // change the corresponding timerDigit to the corresponding user input digit
        document.getElementById("digit"+i).innerHTML = timerInputVal.slice(timerInputVal.length - 1 - i,(timerInputVal.length - i));
        // make the timerDigit black
        document.getElementById("digit"+i).classList.add("timerInputted");
        // make the h, m, s black
        if (((document.getElementById("timerInput").value).length) > 4 ){
            document.getElementById("digitH").classList.add("timerInputted");
            document.getElementById("digitM").classList.add("timerInputted");
            document.getElementById("digitSec").classList.add("timerInputted");
        }
        else if (((document.getElementById("timerInput").value).length) > 2 ){
            document.getElementById("digitH").classList.remove("timerInputted");
            document.getElementById("digitM").classList.add("timerInputted");
            document.getElementById("digitSec").classList.add("timerInputted");
        }
        else if (((document.getElementById("timerInput").value).length) > 0 ){
            document.getElementById("digitH").classList.remove("timerInputted");
            document.getElementById("digitM").classList.remove("timerInputted");
            document.getElementById("digitSec").classList.add("timerInputted");
        } 
    }
    // make everything else zero
    for (let i = timerInputVal.length; i < 6; i ++) {
        document.getElementById("digit"+i).innerHTML = 0;
        document.getElementById("digit"+i).classList.remove("timerInputted");
    }
}

// function to move the timer cursor arround
function moveCursor(digit) {
    console.log("oranges");
    // get the current location of the cursor
    var current = document.getElementsByClassName("timerCursor")[0];
    // check if the digit the user click one has been one that the user has inputted and it's not a special digit
    if (digit.classList.contains("timerInputted") && digit.id !== "digitSec" && digit.id !== "digitM" && digit.id !== "digitH") {
        // remove the old cursor
        current.classList.remove("timerCursor");
        current.classList.remove("cursorSpecial");
        // put the cursor behind the digit the user just clicked on
        digit.classList.add("timerCursor");
        // change cursor location in the actual input field
        // first we get the index of the digit user clicked on going from left to right. 
         // ex: user inputted 1234, 2 would be index 1, 4 would be index 3. 
        for (var i = 0; i < inputtedNums.length; i++) {
            if (inputtedNums[i] == digit) {
                cursorLocation = digit;
                document.getElementById("timerInput").setSelectionRange(i+1, i+1);
                break;
            }
        }
    // if the user clicks off infront of the inputted digits (like the low opacity zeros in front)
    } else if (!(digit.classList.contains("timerInputted"))) {
        // remove the old cursor
        current.classList.remove("timerCursor");
        // in case user has nothing inputted, just put the cursor infront of the s.
        if (inputtedNums.length == 0) {
            document.getElementById("digitSec").classList.add("timerCursor");
            document.getElementById("digitSec").classList.add("cursorSpecial");
            document.getElementById("timerInput").setSelectionRange(0, 0);
            return;
        } else {
            // get the front number inputted and make it a special cursor so that the dash is in front
            inputtedNums[0].classList.add("timerCursor");
            inputtedNums[0].classList.add("cursorSpecial");
        }
        // we remeber the cursor location as the first digit span infront of all the inputted digits
        var newDigitNum = parseInt(inputtedNums[0].id.substring(inputtedNums[0].id.length - 1, inputtedNums[0].id.length)) + 1;
        cursorLocation = document.getElementById(inputtedNums[0].id.slice(0, -1) + newDigitNum);
        document.getElementById("timerInput").setSelectionRange(0, 0);
    }
}

// this function is to keep the cursor at the location it's supposed to be at by adjusting the inputTimer's cursor to match the digit spans
function keepCursor() {
    for (var i = 0; i < inputtedNums.length; i++) {
        if (inputtedNums[i] == cursorLocation) {
            document.getElementById("timerInput").setSelectionRange(i + 1, i + 1);
        }
    }
}

// function for updating the inputtedNums array to reflect the current things that have but inputtted
function updateInputted() {
    // get element's of html digits (including h,m,s) that have been inputted and stores it as an array
    var inputted =  Array.prototype.slice.call(document.getElementsByClassName("timerInputted"));
    inputtedNums = [];
    // then we remove the (h,m,s) and just put the digits elments into inputted
    for (var index = 0; index < inputted.length; index++){
        if (inputted[index].id !== "digitH" && inputted[index].id !== "digitM" && inputted[index].id !== "digitSec") {
            inputtedNums.push(inputted[index]);
        }
    }
}