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