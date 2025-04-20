function showsignup()
{
    document.getElementById("login-box").style.display="none";
    document.getElementById("signup-box").style.display="block";
}

function showlogin(){
    document.getElementById("signup-box").style.display="none";
    document.getElementById("login-box").style.display="block";
}
// login validation
document.getElementById("loginform").addEventListener("submit",function(event){
    event.preventDefault();
    let username=document.getElementById("username").value;
    let password=document.getElementById("password").value;

    if(username=="" && password=="")
    {
        alert("please fill all filelds")
    }
    
    if (username === 'admin' && password === 'admin') {
        window.location.href = 'home.html'; 
        
    }
    if(username=="")
    {
        alert ("please enter usernameid")
    }
    if(password=="")
    {
        alert("enter the password")
    }

});