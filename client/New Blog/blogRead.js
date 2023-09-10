const likedIcon=document.querySelector(".liked");
const unlikedIcon=document.querySelector(".unliked");

likedIcon.style.display="none"

likedIcon.addEventListener("click",()=>{
    likedIcon.style.display="none"
    unlikedIcon.style.display=""
})

unlikedIcon.addEventListener("click",()=>{
    unlikedIcon.style.display="none"
    likedIcon.style.display="flex"
})

const textarea = document.querySelector(".blog-content");
textarea.addEventListener('keyup', autoResize, false);

function autoResize() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight+50) + 'px';
}

function updateThumbnail(category){
    let picture=document.querySelector(".thumbnail");
    picture.src=`https://source.unsplash.com/1600x900/?${category}`;
    console.log(picture.src);
}