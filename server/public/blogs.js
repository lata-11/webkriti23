var ham = document.querySelector('.ico2');
var cross = document.querySelector('.ico3');
var sort_button = document.querySelector('.sort');

var angle_drop={
    value:0
}
sort_button.addEventListener('click',()=>
{
    document.querySelector('.sorting_method').classList.toggle('expand_sort')
    angle_drop.value+=180
    
    document.querySelector('.drop_icon').style.cssText=`transform:rotate(${angle_drop.value}deg)`
})






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

