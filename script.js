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
const inNewPassword = document.getElementById("inNewPassword");

const inEmailLabel = document.getElementById("inEmailLabel");
const inPasswordLabel = document.getElementById("inPasswordLabel");
const inNewPasswordLabel = document.getElementById("inNewPasswordLabel");

const cancelResetPasswordBtn = document.getElementById("cancelResetPasswordBtn");
const inResetBtn = document.getElementById("resetPasswordBtn");
const inSubmitMessage = document.getElementById("inSubmitMessage");

const usersList = document.getElementById("users");

let signedIn = false;

signRadioBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const index = Array.from(signRadioBtns).indexOf(btn);
    if (index === 0) {
      upDiv.classList.remove("hidden");
      inDiv.classList.add("hidden");
    } else if (index === 1) {
      upDiv.classList.add("hidden");
      inDiv.classList.remove("hidden");
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
    resetForm(1);
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

inEmail.addEventListener("blur", () => {
  const email = inEmail.value.trim().toLocaleLowerCase();
  if (!email.includes(".") || !email.includes("@")) {
    inEmailLabel.innerText = "Ange en giltig mejladdress";
  } else {
    inEmailLabel.innerText = "";
  }
});

inPassword.addEventListener("blur", () => {
  const password = inPassword.value.trim();
  if (password.length < 8) {
    inPasswordLabel.innerText = "Lösenordet måste vara minst 8 tecken långt";
  } else {
    inPasswordLabel.innerText = "";
  }
});

inNewPassword.addEventListener("blur", () => {
  const password = inPassword.value.trim();
  const newPassword = inNewPassword.value.trim();
  if (password !== newPassword) {
    inNewPasswordLabel.innerText = "Lösenorden måte vara samma";
  } else {
    inNewPasswordLabel.innerText = "";
  }
});

cancelResetPasswordBtn.addEventListener("click", () => {
  inPasswordLabel.innerText = "";
  inNewPasswordLabel.innerText = "";
  resetLables(2);
  inResetBtn.innerText = "Återställ lösenord";
  inSubmitMessage.innerText = "";
  cancelResetPasswordBtn.classList.add("hidden");
  inNewPassword.classList.add("hidden");
});

inResetBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const newPasswordClassList = inNewPassword.classList;

  if (newPasswordClassList.contains("hidden")) {
    resetLables(2);
  }

  const email = inEmail.value.trim().toLocaleLowerCase();

  if (email.includes(".") && email.includes("@")) {
    const password = inPassword.value;
    const confirmNewPassWord = inNewPassword.value;
    const validNewPassword = password.length > 7 && password === confirmNewPassWord;
    const isValid = inPasswordLabel.innerText === "" && inNewPasswordLabel.innerText === "" && validNewPassword;

    if (isValid || newPasswordClassList.contains("hidden")) {
      inNewPassword.classList.toggle("hidden");

      if (inNewPassword.classList.contains("hidden")) {
        console.log("Your are valid");
        getUsers()
          .then((allUsers) => {
            const userExists = allUsers.filter((user) => user.email === email).length > 0;

            if (userExists) {
              console.log("Changed password");
            }
          })
          .catch((error) => {
            console.log("Error fetching users", error);
          });
        inNewPassword.classList.add("hidden");
        inPassword.placeholder = "Ange lösenord";
        inNewPassword.placeholder = "Bekräfta nytt lösenord";
        inResetBtn.innerText = "Återställ lösenord";
        cancelResetPasswordBtn.classList.add("hidden");
      } else {
        console.log("Why are this code executed?");
        inPassword.placeholder = "Ange lösenord";
        inNewPassword.placeholder = "Bekräfta nytt lösenord";
        inResetBtn.innerText = "Bekräfta lösenord";
        cancelResetPasswordBtn.classList.remove("hidden");
        resetLables(2);
      }
    } else {
      // inNewPassword.classList.add("hidden");

      inSubmitMessage.innerText = "Formuläret är inte giltigt";
    }
  } else {
    inEmailLabel.innerText = "Ange en giltig mejladress";
  }
});

inForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //sign in

  const email = inEmail.value;
  const password = inPassword.value;

  const validEmail = email.includes(".") && email.includes("@");
  const validPassword = password.length > 7;

  const isValid = inEmailLabel.innerText === "" && inPasswordLabel.innerText === "" && validEmail && validPassword;

  if (isValid) {
    getUsers()
      .then((allUsers) => {
        const userExists = allUsers.filter((user) => user.email === email).length > 0;
        const rightPassword = allUsers.filter((user) => user.password === password).length > 0;

        if (userExists && rightPassword) {
          signedIn = true;
          console.log("Congrats you are signed in!", signedIn);
        } else {
          console.log("Invalid email or password");
        }
      })
      .catch((error) => {
        console.log("Error fetching users", error);
      });
  }
});

async function getUsers() {
  let fetchUsers = [];
  try {
    const res = await fetch("http://localhost:3000/users");
    if (!res.ok) {
      throw new Error("Network response was not ok");
    } else {
      const users = await res.json();
      console.log("Users: ", users);
      fetchUsers = users;
    }
  } catch (error) {
    console.log("There was a problem with fetching users");
  }
  return fetchUsers;
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
      if (users.message === "User added successfully") {
        signedIn = true;
        console.log("Congrats you are signed in!", signedIn);
      }
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

function resetForm(form) {
  if (form === 1) {
    upEmail.value = "";
    confirmUpEmail.value = "";
    upPassword.value = "";
    confirmUpPassword.value = "";
  } else if (form === 2) {
    inEmail.value = "";
    inNewPassword.value = "";
    inPassword.value = "";
  }
}

function resetLables(form) {
  if (form === 1) {
    upEmailLabel.innerText = "";
    confirmUpEmailLabel.innerText = "";
    upPasswordLabel.innerText = "";
    confirmUpPasswordLabel.innerText = "";
  } else if (form === 2) {
    inEmailLabel.innerText = "";
    inPasswordLabel.innerText = "";
    inNewPasswordLabel.innerText = "";
  }
}
