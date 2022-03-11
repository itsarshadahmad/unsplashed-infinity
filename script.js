const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let photosArray = [];
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let counter = 0;

// Unsplash API
const count = 3;
const accessKey = "ENTER_YOUR_ACCESS_KEY";
const apiURL = `https://api.unsplash.com/photos/random/?client_id=${accessKey}&count=${count}`;

// Check if all images are loaded
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
    }
}

// Helper function to set attribute on DOM elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        /* Format of this function =>
         element.setAttribute("attributeNameAsKey", attributeValue); */
        element.setAttribute(key, attributes[key]);
    }
}

// Create Elements For Link & Photos, Add To DOM
function displayPhotos() {
    counter += 3;
    imagesLoaded = 0;
    totalImages = photosArray.length;

    // Run function for each object in photosArray
    photosArray.forEach(photo => {
        // Create <a> to link to Unsplash
        const item = document.createElement("a");
        setAttributes(item, {
            href: photo.links.html,
            target: "_blank"
        });

        // Create <img> for photo
        const img = document.createElement("img");
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        });

        // Event listener, check when each is finsihed loading
        img.addEventListener("load", imageLoaded);

        // Putting <img> inside <a>, then both inside imageContainer element
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}

// Get images from Unsplash API
async function getPhotos() {
    try {
        const response = await fetch(apiURL);
        photosArray = await response.json();
        displayPhotos();
    } catch (error) {
        console.log("ERROR IN FETCHING DATA FROM UNSPLASH API: ", error);
    }
}

// Check to see if scolling near bottom of page, Load more photos
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        if (counter < 10) {
            getPhotos();
        }
    }
});

// On Load
getPhotos();