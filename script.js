const userForm = document.getElementById("userForm");
const userEmail = document.getElementById("userEmail");
const submitMessage = document.getElementById("submitMessage");
const usersList = document.getElementById("users");

userForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    const email = userEmail.value.trim().toLocaleLowerCase();

    if(email===""){
        submitMessage.innerText="Field must not be empty";
        submitMessage.classList.add("error")
        submitMessage.classList.remove("success")
    }else{
        submitMessage.innerText="User created";
        submitMessage.classList.add("success")
        submitMessage.classList.remove("error");

        addUser(email);
    }

    resetForm();
})

async function getUsers(){
    try{
        const res = await fetch("http://localhost:3000/users");
        if(!res.ok){
            throw new Error("Network response was not ok")
        }else{
            const users = await res.json();
            console.log("Users: ",users)
        }
    }catch(error){
        console.log("There was a problem with fetching users");
    }
}

async function addUser(user){
    try{
        const res = await fetch("http://localhost:3000/users",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({user:user})
        });
        if(!res.ok){
            throw new Error("Network response was not ok")
        }else{
            const users = await res.json();
            console.log("Users: ",users)
            renderUser(users);
        }

    }catch(error){
        console.log(`There was a problem adding user ${user}`);
    }
}

function renderUser(users){

    usersList.innerHTML="";
    const usersAsArray = users.users;

    usersAsArray.forEach(user => {
        const li = document.createElement("li");
        li.innerText=user
        console.log("li",li)
        usersList.appendChild(li);
    });
}

function resetForm(){
    userEmail.value="";
}