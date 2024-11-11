const signRadioBtns = document.querySelectorAll(".signBtn");

const upDiv = document.getElementById("signUpForm");
const upForm = document.getElementById("upForm");
const upEmail = document.getElementById("upEmail");
const confirmUpEmail = document.getElementById("confirmUpEmail");
const upPassword = document.getElementById("upPassword");
const confirmUpPassword = document.getElementById("confirmUpPassword");

const upEmailLabel = document.getElementById("upEmailLabel");
const confirmUpEmailLabel = document.getElementById("confirmUpEmailLabel");
const upPasswordLabel = document.getElementById("upPasswordLabel");
const confirmUpPasswordLabel = document.getElementById("confirmUpPasswordLabel");

const upSubmitMessage = document.getElementById("upSubmitMessage");

const inDiv = document.getElementById("signInForm");
const inForm = document.getElementById("inForm");
const inEmail = document.getElementById("inEmail");
const inPassword = document.getElementById("inPassword");
const inSubmitMessage = document.getElementById("inSubmitMessage");

const usersList = document.getElementById("users");

signRadioBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // upForm.classList.toggle("hidden");
    // inForm.classList.toggle("hidden");
    // console.log("Upform", upForm);
    // console.log("Inform", inForm);
    const index = Array.from(signRadioBtns).indexOf(btn);
    if (index === 0) {
      upDiv.classList.remove("hidden");
      inDiv.classList.add("hidden");
      console.log("Sign up");
    } else if (index === 1) {
      upDiv.classList.add("hidden");
      inDiv.classList.remove("hidden");
      console.log("Sign in");
    }
  });
});

upForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const isValid = upEmailLabel.innerText === "" && confirmUpEmailLabel.innerText === "" && upPasswordLabel.innerText === "" && confirmUpPasswordLabel.innerText === "" && upEmail.value.includes(".") && upEmail.value.includes("@") && upPassword.value.length > 7;

  if (isValid) {
    upSubmitMessage.classList.add("success");
    upSubmitMessage.classList.remove("error");

    const email = upEmail.value.trim().toLocaleLowerCase();
    const confirmEmail = upEmail.value.trim().toLocaleLowerCase();
    const password = upPassword.value.trim();
    const confimPassword = upPassword.value.trim();

    const user = {
      email: email,
      confirmEmail: confirmEmail,
      password: password,
      confirmPassword: confimPassword,
    };

    addUser(user);
    resetForm();
  } else {
    upSubmitMessage.innerText = "Formuläret är inte giltigt";
    upSubmitMessage.classList.add("error");
    upSubmitMessage.classList.remove("success");
  }
});

upEmail.addEventListener("blur", () => {
  const email = upEmail.value.trim().toLocaleLowerCase();
  if (email === "") {
    upEmailLabel.innerText = "Fältet får inte vara tomt";
  } else if (!email.includes("@") || !email.includes(".")) {
    upEmailLabel.innerText = "Ange en giltig mejladress";
  } else {
    upEmailLabel.innerText = "";
  }
});

confirmUpEmail.addEventListener("blur", () => {
  const confirmEmail = confirmUpEmail.value.trim().toLocaleLowerCase();
  const email = upEmail.value.trim().toLocaleLowerCase();

  if (email !== confirmEmail) {
    confirmUpEmailLabel.innerText = "Mejladresserna måste vara samma";
  } else {
    confirmUpEmailLabel.innerText = "";
  }
});

upPassword.addEventListener("blur", () => {
  const password = upPassword.value.trim();
  if (password.length < 8) {
    upPasswordLabel.innerText = "Lösenordet måste vara minst 8 tecken långt";
  } else {
    upPasswordLabel.innerText = "";
  }
});

confirmUpPassword.addEventListener("blur", () => {
  const confimPassword = confirmUpPassword.value.trim();
  const password = upPassword.value.trim();

  if (password !== confimPassword) {
    confirmUpPasswordLabel.innerText = "Lösenorden måste vara samma";
  } else {
    confirmUpPasswordLabel.innerText = "";
  }
});

async function getUsers() {
  try {
    const res = await fetch("http://localhost:3000/users");
    if (!res.ok) {
      throw new Error("Network response was not ok");
    } else {
      const users = await res.json();
      console.log("Users: ", users);
    }
  } catch (error) {
    console.log("There was a problem with fetching users");
  }
}

async function addUser(user) {
  console.log("User: ", user);
  try {
    const res = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user }),
    });
    if (!res.ok) {
      throw new Error("Network response was not ok");
    } else {
      const users = await res.json();
      renderUser(users);
      upSubmitMessage.innerText = users.message;
    }
  } catch (error) {
    console.log(`There was a problem adding user ${user}`);
  }
}

function renderUser(users) {
  usersList.innerHTML = "";
  const usersAsArray = users.users;

  usersAsArray.forEach((user) => {
    const li = document.createElement("li");
    const email = document.createElement("p");
    // const password = document.createElement("p");
    email.innerText = user.email;
    // password.innerText = user.password;

    li.appendChild(email);
    // li.appendChild(password);
    // console.log("li", li);
    usersList.appendChild(li);
  });
}

function resetForm() {
  upEmail.value = "";
  confirmUpEmail.value = "";
  upPassword.value = "";
  confirmUpPassword.value = "";
}
