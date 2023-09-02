let galleryIndex = 0;

function shiftGallery(direction) {
    let classes = document.getElementsByClassName("gallery-image");
    for (let i = 0; i < classes.length; i++) {
        classes[i].style.display = "none";
    }

    galleryIndex = galleryIndex + direction;
    if (galleryIndex < 0) {
        galleryIndex += classes.length;
    }
    else if (galleryIndex >= classes.length) {
        galleryIndex -= classes.length;
    }

    classes[galleryIndex].style.display = "block";
}
