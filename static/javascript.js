
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
     const response = await fetch('https://api.unsplash.com/search/photos?query=' + theme +'&client_id=' + upsplash_access_key)
     // get what the server sent back (response) and then make it into json so we can read and parse
     main_data = await response.json()
     // go through all the images we've just scrapped from upsplash
     for (let i = 0; i < (main_data.results).length; i ++){
         // for each image we make a new image tag and add it to the html. we make sure that we give each image tag the onmouseover attribute
         currentpic = main_data.results[i]
         var div = document.createElement("div");
         div.setAttribute("class", "imagediv");
         div.setAttribute("id", currentpic.id + "div")
         if (main == true){
             document.querySelector('.mainthemepics').appendChild(div)
         }
         else{
             document.querySelector('.altthemepics').appendChild(div)
         }
         image = document.createElement('img')
         image.setAttribute("id", currentpic["id"])
         image.setAttribute("onmouseover", "onHover(this)")
         image.src = currentpic.urls["small"]
         document.getElementById(currentpic.id + "div").appendChild(image)
         // now also make a little description for the image
         imgdescript = document.createElement("p")
         imgdescript.setAttribute("id", currentpic.id + "description")
         document.getElementById(currentpic.id + "div").appendChild(imgdescript);
         photographer = currentpic.user
         console.log(photographer)
         console.log(photographer.links)
         console.log(photographer.links.self)

         // make sure to fix this link this later on. upsplash API/about
         document.getElementById(currentpic.id + "description").innerHTML = `Photo by <a href = '${photographer.links.html}?utm_source=sketchdailywebapp&utm_medium=referral'> ${photographer.name} </a> from <a href="https://unsplash.com/?utm_source=sketchdailywebapp&utm_medium=referral"> Upsplash`;
     }

 }
