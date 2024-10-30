let galleryIndex = 0;

function shiftGallery(direction: number) {

    let classes = Array.from(document.getElementsByClassName("gallery-image-container") as HTMLCollectionOf<HTMLElement>)

    for (let i = 0; i < classes.length; i++) {
        classes[i].style.display = "none";
    }

    galleryIndex += direction;

    if (galleryIndex < 0) galleryIndex += classes.length;
    else if (galleryIndex >= classes.length) galleryIndex -= classes.length;

    classes[galleryIndex].style.display = "block";

}
