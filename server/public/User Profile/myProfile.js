// import cookie from "js-cookie";
function setCookie(name, value, path = '/') {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
    cookie += `; path=${path}`;
     
    console.log(cookie);
    document.cookie = cookie;
  }


const name=document.getElementById("name_input");
const userHandle=document.getElementById("slug");
const bio=document.getElementById("bio");

setCookie('token', localStorage.getItem("authToken"),'/');

const url="http://localhost:7000/api/v1/user/me"
const getInfo=()=>{

    fetch(url,{
        headers: {"Content-Type":"application/json;charset=utf-8;"}
    }).then(response=>response.json()).then(data=> console.log(data))

}
getInfo()