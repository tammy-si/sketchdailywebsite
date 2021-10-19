
 // main data holds the scraped data for the main theme images from upsplash
 main_data = NaN

 // when we hover over a picture
 function onHover(pic) {
     // pic is the current image we are hovering over accessed by passing in the current image by using the "this" keyword
     console.log("Testing")
 }

 // load the images from upsplash based on today's theme
 async function loadPictures (theme, main, upsplash_access_key) {
     console.log("hello" + theme)
     // connecting to the API and making a request for the API info
     const response = await fetch('https://api.unsplash.com/search/photos?per_page=30&query=' + theme +'&client_id=' + upsplash_access_key)
     // get what the server sent back (response) and then make it into json so we can read and parse
     main_data = await response.json()
     // for just in case Upsplash doesn't have any images for the themes
     if (main_data.results.length == 0) {
         if (main == true) {
             console.log("Upsplash has no images for today's main theme")
         }
         else if (main == false) {
             console.log("Upsplash has no today's alternate theme")
         }
     }
     console.log(main_data.results.length)
     // go through all the images we've just scrapped from upsplash
     for (let i = 0; i < main_data.results.length; i ++){
         if (main == true) {
            console.log(main_data.results.length)
         }
         // for each image we make a new image tag and add it to the html. we make sure that we give each image tag the onmouseover attribute
         currentpic = main_data.results[i]
         var div = document.createElement("div");
         div.setAttribute("class", "imagediv");
         div.setAttribute("id", currentpic.id + "div")
         // add images to either to main theme pics div or alttheme pics depending on which functions was called
         if (main == true){
             document.querySelector('.mainthemepics').appendChild(div)
         }
         else {
             document.querySelector('.altthemepics').appendChild(div)
         }
         image = document.createElement('img')
         image.setAttribute("id", currentpic["id"])
         image.setAttribute("onmouseover", "onHover(this)")
         image.src = currentpic.urls["small"]
         document.getElementById(currentpic.id + "div").appendChild(image)
         // now also make a little description with crediting stuff for the image
         // make a div for the description, put that description div into the div with the image
         imgdescriptdiv = document.createElement("div")
         document.getElementById(currentpic.id + "div").appendChild(imgdescriptdiv);
         imgdescriptdiv.setAttribute("id", currentpic.id + "descriptiondiv")
         imgdescriptdiv.setAttribute("class", "imgdescript")
         // now you actually make the text part by making a p element and adding it into the imgdescript div we made
         imgdescript = document.createElement("p")
         imgdescript.setAttribute("id", currentpic.id + "description")
         imgdescript.setAttribute("class", "imgdescripttext")
         document.getElementById(currentpic.id + "descriptiondiv").appendChild(imgdescript);
         // now we change the DOM to actually have text
         photographer = currentpic.user
         document.getElementById(currentpic.id + "description").innerHTML = `Photo by <a href = '${photographer.links.html}?utm_source=sketchdailywebapp&utm_medium=referral'> ${photographer.name} </a> from <a href="https://unsplash.com/?utm_source=sketchdailywebapp&utm_medium=referral"> Upsplash`;
     }

 }
 
// to fix the image captions TO DO
 window.addEventListener("resize", function () {
    console.log(window.innerWidth)
});