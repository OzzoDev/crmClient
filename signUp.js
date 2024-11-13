const body = document.body;
const usersList = document.getElementById("users");

let forms = [];
let inputs = [];
let labels = [];
let message;

function createSignUpAuth() {
  const signUpContainer = document.createElement("div");
  const signUpForm = document.createElement("form");
  const emailHolder = document.createElement("p");
  const password = document.createElement("input");
  const passwordLabel = document.createElement("label");
  const confirmPassword = document.createElement("input");
  const confirmPasswordLabel = document.createElement("label");
  const signUpBtn = document.createElement("button");
  const signUpMessage = document.createElement("p");

  signUpContainer.setAttribute("class", "signUpContainer authContainer");

  const passID = "password";
  const confirmID = "confirmPassword";

  emailHolder.innerText = getEmailFromLocalStorage() || "Gå tillbaka och ange meljadress för att skapa konto";
  emailHolder.setAttribute("class", "emailHolder");

  password.setAttribute("placeHolder", "Ange ett lösenord");
  password.setAttribute("id", passID);
  inputs.push({ name: "password", el: password });

  passwordLabel.setAttribute("for", passID);
  labels.push(passwordLabel);

  confirmPassword.setAttribute("placeholder", "Bekräfta lösenord");
  confirmPassword.setAttribute("id", confirmID);
  inputs.push({ name: "confirm", el: confirmPassword });

  confirmPasswordLabel.setAttribute("for", passID);
  labels.push(confirmPasswordLabel);

  signUpBtn.innerText = "Skapa konto";
  signUpBtn.setAttribute("type", "submit");
  signUpBtn.setAttribute("class", "submitBtn");

  signUpMessage.setAttribute("class", "submitMessage");

  message = signUpMessage;

  forms.push({ name: "signUp", el: signUpForm });

  signUpForm.appendChild(emailHolder);
  signUpForm.appendChild(password);
  signUpForm.appendChild(passwordLabel);
  signUpForm.appendChild(confirmPassword);
  signUpForm.appendChild(confirmPasswordLabel);
  signUpForm.appendChild(signUpBtn);

  signUpContainer.appendChild(signUpForm);
  signUpContainer.appendChild(signUpMessage);

  body.appendChild(signUpContainer);
}

function formEvents() {
  forms.forEach((form) => {
    const formName = form.name;
    const formEl = form.el;

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = getEmailFromLocalStorage();
      const password = inputs[0].el.value;
      const confirmPassword = inputs[1].el.value;

      switch (formName) {
        case "signUp":
          if (password.length > 7 && password === confirmPassword) {
            addUser({ email: email, password: password, confirmPassword: confirmPassword });
            resetLables();
          } else {
            message.innerText = "Lösenorden måste vara samma och minst vara 8 tecken långa";
            console.log("Error");
          }
          break;
        default:
          break;
      }
    });
  });
}

function inputEvents() {
  const passwordLabel = labels[0];
  const confirmPasswordLabel = labels[1];

  inputs.forEach((input) => {
    const inputName = input.name;
    const inputEl = input.el;

    inputEl.addEventListener("input", () => {
      const password = inputs[0].el.value;
      const confirmPassword = inputs[1].el.value;
      switch (inputName) {
        case "password":
          if (password.length < 8) {
            passwordLabel.innerText = "Lösenordet måste vara minst 8 tecken långt";
          } else {
            passwordLabel.innerText = "";
          }
          break;
        case "confirm":
          if (password !== confirmPassword) {
            confirmPasswordLabel.innerText = "Lösenorden måste vara samma";
          } else {
            confirmPasswordLabel.innerText = "";
          }
          break;
        default:
          break;
      }
    });
  });
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
      renderUser(users.users);
      if (users.message === "User added successfully") {
        console.log("Congrats! You are signed in!");
        redirectToAnotherPage("organization.html");
      }
    }
  } catch (error) {
    console.log(`There was a problem adding user ${user}`);
    console.log("Error: ", error);
  }
}

function renderUser(users) {
  usersList.innerHTML = "";

  users.forEach((user) => {
    const li = document.createElement("li");
    const email = document.createElement("p");
    const password = document.createElement("p");
    email.innerText = user.email;
    password.innerText = user.password;

    li.appendChild(email);
    li.appendChild(password);
    console.log("li", li);
    usersList.appendChild(li);
  });
}

function resetLables() {
  labels.forEach((label) => (label.innerText = ""));
}

function getEmailFromLocalStorage() {
  const emailData = localStorage.getItem("email");
  if (emailData) {
    const parsedData = JSON.parse(emailData);
    return parsedData.key;
  } else {
    return null;
  }
}

function redirectToAnotherPage(path) {
  window.location.href = path;
}

createSignUpAuth();
formEvents();
inputEvents();
