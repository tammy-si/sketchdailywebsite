// sotring the info scraped from upsplash
var mainStorage;
var altStorage;

 // when we hover over a picture
 function onHover(pic) {
    // pic is the current image we are hovering over accessed by passing in the current image by using the "this" keyword
    console.log("Testing");
    pic.onclick = function () {
        console.log(mainStorage);
        let j = 0;
        while (j < 10) {
            console.log("test");
            j += 1
        }
    }
}

 // load the images from upsplash based on today's theme
 async function loadPictures (theme, main, upsplash_access_key) {
    // connecting to the API and making a request for the API info
    const response = await fetch('https://api.unsplash.com/search/photos?per_page=30&query=' + theme +'&client_id=' + upsplash_access_key)
    // get what the server sent back (response) and then make it into json so we can read and parse
    data = await response.json()
    // storing the info scraped so we don't really have to request again
    if (main == true) {
        mainStorage = data;
    } 
    else {
        altStorage = data;
    }
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
        // putting the image into the DOM. We get the height of the image so we can restrict height of the div
        image.src = currentpic.urls["small"];
        document.getElementById(currentpic.id + "div").appendChild(image);
        divHeight = document.getElementById(currentpic.id).clientHeight;
        document.getElementById(currentpic.id + "div").style.maxHeight = String(divHeight) + "px";
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
}
 
