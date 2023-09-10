var ham = document.querySelector('.ico2');
var cross = document.querySelector('.ico3');
var blog_data = document.querySelector('.blog_data');
var follower_data = document.querySelector('.followers_data');
var blogs = document.querySelector('.blogs');
var followers = document.querySelector('.followers');
blog_data.classList.add('expand');
follower_data.classList.add('collapse');
function expand()
{
    follower_data.classList.toggle('collapse');
    follower_data.classList.toggle('expand');
    blog_data.classList.toggle('collapse');
    blog_data.classList.toggle('expand');
}
blogs.addEventListener('click',()=>
{
    if(!blog_data.classList.contains('expand'))
    {
        expand();
        active_button();
    }
});
followers.addEventListener('click',()=>
{
    if(!follower_data.classList.contains('expand'))
    {
        expand();
        active_button();
    }
});
blogs.classList.add('active_button');
function active_button()
{
  followers.classList.toggle('active_button')
  blogs.classList.toggle('active_button')
}


function switches()
{

    var ham = document.querySelector('.ico2');
    var cross = document.querySelector('.ico3');
    ham.classList.toggle('wrap');
    cross.classList.toggle('wrap');
   hide_nav();
}
function hide_nav()
{
    document.querySelector('.vertical_navbar').classList.toggle('visible_verticle_navbar');
}
ham.addEventListener('click',switches);
cross.addEventListener('click',switches);

var translate ={
    value:0
}

//Adding camera js
let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");
let DP;
let popUpBox=document.querySelector(".pop-up-box");
let Profile=document.querySelector(".profile")

camera_button.addEventListener('click', async function() {
   	let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
	video.srcObject = stream;
});

click_button.addEventListener('click', function() {
   	canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
   	let image_data_url = canvas.toDataURL('image/jpeg');
DP=image_data_url;
   	// data url of the image
   	console.log(image_data_url);
});
function popUp()
{
    popUpBox.style.display="block"
}
function updatePicture()
{
    let stream = navigator.mediaDevices.getUserMedia({ video: false, audio: false });
    Profile.style.backgroundImage=`url(${DP})`;
    popUpBox.style.display="none"
}
function cancel()
{
    let stream = navigator.mediaDevices.getUserMedia({ video: false, audio: false });
    popUpBox.style.display="none"
}