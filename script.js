const userForm = document.getElementById("userForm");
const userEmail = document.getElementById("userEmail");
const confirmUserEmail = document.getElementById("confirmUserEmail");
const userPassword = document.getElementById("userPassword");
const confirmUserPassword = document.getElementById("confirmUserPassword");

const userEmailLabel = document.getElementById("userEmailLabel");
const confirmUserEmailLabel = document.getElementById("confirmUserEmailLabel");
const userPasswordLabel = document.getElementById("userPasswordLabel");

const confirmUserPasswordLabel = document.getElementById("confirmUserPasswordLabel");

const submitMessage = document.getElementById("submitMessage");
const usersList = document.getElementById("users");

userForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //   const confimEmail = confirmUserEmail.value.trim().toLocaleLowerCase();
  //   const password = userPassword.value.trim().toLocaleLowerCase();
  //   const confimPassword = confirmUserPassword.value.trim().toLocaleLowerCase();

  const isValid = userEmailLabel.innerText === "" && confirmUserEmailLabel.innerText === "" && userPasswordLabel.innerText === "" && confirmUserPasswordLabel.innerText === "";

  if (isValid) {
    submitMessage.innerText = "Konto skapat";
    submitMessage.classList.add("success");
    submitMessage.classList.remove("error");

    const email = userEmail.value.trim().toLocaleLowerCase();
    const password = userPassword.value.trim();

    const user = {
      email: email,
      password: password,
    };

    addUser(user);
    resetForm();
  } else {
    submitMessage.innerText = "Formuläret är inte giltigt";
    submitMessage.classList.add("error");
    submitMessage.classList.remove("success");
  }
});

userEmail.addEventListener("blur", () => {
  const email = userEmail.value.trim().toLocaleLowerCase();
  if (email === "") {
    userEmailLabel.innerText = "Fältet får inte vara tomt";
  } else if (!email.includes("@") || !email.includes(".")) {
    userEmailLabel.innerText = "Ange en giltig mejladress";
  } else {
    userEmailLabel.innerText = "";
  }
});

confirmUserEmail.addEventListener("blur", () => {
  const confirmEmail = confirmUserEmail.value.trim().toLocaleLowerCase();
  const email = userEmail.value.trim().toLocaleLowerCase();

  if (email !== confirmEmail) {
    confirmUserEmailLabel.innerText = "Mejladresserna måste vara samma";
  } else {
    confirmUserEmailLabel.innerText = "";
  }
});

userPassword.addEventListener("blur", () => {
  const password = userPassword.value.trim();
  if (password.length < 8) {
    userPasswordLabel.innerText = "Lösenordet måste vara minst 8 tecken långt";
  } else {
    userPasswordLabel.innerText = "";
  }
});

confirmUserPassword.addEventListener("blur", () => {
  const confimPassword = confirmUserPassword.value.trim();
  const password = userPassword.value.trim();
  console.log(confimPassword, password, confimPassword === password);
  if (password !== confimPassword) {
    confirmUserPasswordLabel.innerText = "Lösenorden måste vara samma";
  } else {
    confirmUserPasswordLabel.innerText = "";
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
      console.log("Users: ", users);
      renderUser(users);
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
    const password = document.createElement("p");
    email.innerText = user.email;
    password.innerText = user.password;

    li.appendChild(email);
    li.appendChild(password);
    // console.log("li", li);
    usersList.appendChild(li);
  });
}

function resetForm() {
  userEmail.value = "";
}
