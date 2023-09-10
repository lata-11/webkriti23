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