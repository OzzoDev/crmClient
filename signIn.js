const body = document.body;
const usersList = document.getElementById("users");

const email = getEmailFromLocalStorage() || "Gå tillbaka och ange meljadress för att skapa konto";
let passChangeCode;

let form;
let message;

let inputs = [];
let labels = [];
let buttons = [];

function init() {
  createSignInAuth();
  buttonEvents();
  noWhiteSpaceInput();
  formEvent();
}

init();

function createSignInAuth() {
  const signInContainer = document.createElement("div");
  const signInForm = document.createElement("form");
  const emailHolder = document.createElement("p");
  const code = document.createElement("input");
  const password = document.createElement("input");
  const passwordLabel = document.createElement("label");
  const confirmNewPassowrd = document.createElement("input");
  const confirmNewPassowrdLabel = document.createElement("label");
  const cancelResetBtn = document.createElement("button");
  const resetPassWordBtn = document.createElement("button");
  const signInBtn = document.createElement("button");
  const signInMessage = document.createElement("p");

  signInContainer.setAttribute("class", "signUpContainer authContainer");

  const passID = "password";
  const confirmID = "confirmPassword";

  emailHolder.innerText = email;
  emailHolder.setAttribute("class", "emailHolder");

  code.setAttribute("placeholder", "Ange koden skickat till din melj");
  code.setAttribute("class", "hidden m-1rem");

  password.setAttribute("placeHolder", "Ange ditt lösenord");
  password.setAttribute("id", passID);

  passwordLabel.setAttribute("for", passID);

  confirmNewPassowrd.setAttribute("id", confirmID);
  confirmNewPassowrd.setAttribute("placeholder", "Bekräfta nytt lösenord");
  confirmNewPassowrd.setAttribute("class", "hidden");

  confirmNewPassowrdLabel.setAttribute("for", confirmID);

  cancelResetBtn.setAttribute("class", "cancelBtn btn hidden");
  cancelResetBtn.innerText = "Avbryt";

  resetPassWordBtn.innerText = "Återställ lösenord";
  resetPassWordBtn.setAttribute("class", "btn");
  resetPassWordBtn.setAttribute("type", "submit");

  signInBtn.innerText = "Logga in";
  signInBtn.setAttribute("type", "submit");
  signInBtn.setAttribute("class", "submitBtn");

  signInMessage.setAttribute("class", "submitMessage");

  message = signInMessage;
  form = signInForm;

  inputs.push(password);
  inputs.push(confirmNewPassowrd);
  inputs.push(code);

  labels.push(passwordLabel);
  labels.push(confirmNewPassowrdLabel);

  buttons.push(resetPassWordBtn);
  buttons.push(cancelResetBtn);
  buttons.push(signInBtn);

  signInForm.appendChild(emailHolder);

  signInForm.appendChild(code);

  signInForm.appendChild(password);
  signInForm.appendChild(passwordLabel);

  signInForm.appendChild(confirmNewPassowrd);
  signInForm.appendChild(confirmNewPassowrdLabel);

  signInForm.appendChild(cancelResetBtn);
  signInForm.appendChild(resetPassWordBtn);
  signInForm.appendChild(signInBtn);
  signInContainer.appendChild(signInForm);
  signInContainer.appendChild(signInMessage);

  body.appendChild(signInContainer);
}

function hideResetEls(resetBtn, cancelBtn, signInBtn) {
  inputs.forEach((input) => {
    const index = Array.from(inputs).indexOf(input);
    switch (index) {
      case 0:
        input.placeholder = "Ange ditt lösenord";
        break;
      case 1:
        input.classList.add("hidden");
        break;
      case 2:
        input.classList.add("hidden");
        break;
    }
  });

  resetBtn.innerText = "Återställ lösenord";
  cancelBtn.classList.add("hidden");
  signInBtn.classList.remove("hidden");
  inputEvents(false);
  resetLables();
}

function showResetEls(resetBtn, cancelBtn, signInBtn) {
  inputs.forEach((input) => {
    const index = Array.from(inputs).indexOf(input);
    switch (index) {
      case 0:
        input.placeholder = "Välj nytt lösenord";
        break;
      case 1:
        input.classList.remove("hidden");
        break;
      case 2:
        input.classList.remove("hidden");
        break;
    }
  });

  resetBtn.innerText = "Bekräfta nytt lösenord";
  cancelBtn.classList.remove("hidden");
  signInBtn.classList.add("hidden");
  inputEvents(true);
  resetLables();
  resetInputs();
}

function inputEvents(addEvent) {
  const passwordLabel = labels[0];
  const confirmPasswordLabel = labels[1];

  function handleInput(index) {
    return function () {
      const password = inputs[0].value;
      const confirmPassword = inputs[1].value;

      if (index === 0) {
        checkPasswordLength(password, passwordLabel);
      } else if (index === 1) {
        checkPasswordMatch(password, confirmPassword, confirmPasswordLabel);
      }

      setFormMessage("");
    };
  }

  inputs.forEach((input, index) => {
    const boundHandler = handleInput(index).bind(input);

    if (addEvent) {
      input.addEventListener("input", boundHandler);
      input.boundHandler = boundHandler;
    } else {
      if (input.boundHandler) {
        input.removeEventListener("input", input.boundHandler);
      }
    }
  });
}

function buttonEvents() {
  const resetBtn = buttons[0];
  const cancelBtn = buttons[1];
  const signInBtn = buttons[2];

  resetBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const password = inputs[0].value;
    const confirmPassword = inputs[1].value;
    const code = inputs[2].value;
    const btnText = resetBtn.innerText;
    if (btnText === "Återställ lösenord") {
      getPassCode(email);
      showResetEls(resetBtn, cancelBtn, signInBtn);
    } else {
      if (password.length > 7) {
        if (password === confirmPassword) {
          hideResetEls(resetBtn, cancelBtn, signInBtn);
          changePassword({ email: email, password: password, confirmPassword: confirmPassword, code: code });
        } else {
          setFormMessage("Lösenorden stämmer inte överrens");
        }
      } else {
        setFormMessage("Lösenorden måste vara minst 8 tecken långa");
      }
      if (code === passChangeCode && password === confirmPassword) {
      }
    }
  });

  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideResetEls(resetBtn, cancelBtn, signInBtn);
    resetInputs();
  });
}

function formEvent() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = inputs[0].value;
    if (checkCredentials(email, password)) {
      signIn({ email: email, password: password });
    }
  });
}

function setFormMessage(msg) {
  message.innerText = msg;
}

function resetLables() {
  labels.forEach((label) => (label.innerText = ""));
}

function resetInputs() {
  inputs.forEach((input) => (input.value = ""));
}

function placePasswordInInput() {
  const passwordEl = inputs[0];
  const password = inputs[0].value;
  passwordEl.value = password;
}

function noWhiteSpaceInput() {
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.value = removeWhiteSpace(input.value);
    });
  });
}

function removeWhiteSpace(str) {
  return str.replace(/\s+/g, "");
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
    usersList.appendChild(li);
  });
}

function checkPasswordLength(password, passwordLabel) {
  if (password.length < 8) {
    passwordLabel.innerText = "Lösenordet måste vara minst 8 tecken långt";
  } else {
    passwordLabel.innerText = "";
  }
}

function checkPasswordMatch(password, confirmPassword, confirmPasswordLabel) {
  if (password !== confirmPassword) {
    confirmPasswordLabel.innerText = "Lösenorden måste vara samma";
  } else {
    confirmPasswordLabel.innerText = "";
  }
}

async function checkCredentials(emailToSubmit, passwordToSubmit) {
  const users = await getUsers();
  const user = users.find((u) => u.email === emailToSubmit);
  if (user && user.password === passwordToSubmit) {
    return true;
  }
  return false;
}

async function getPassCode(email) {
  try {
    fetch("http://localhost:3000/passCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
  } catch (error) {
    console.log("Error", error);
  }
}

async function changePassword(credentials) {
  try {
    const response = await fetch("http://localhost:3000/changePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credentials: credentials }),
    });

    if (response.ok) {
      const data = await response.json();
      const updatedUsers = data.users;
      if (updatedUsers.length > 0) {
        renderUser(updatedUsers);
        signedIn = true;
      }
    } else {
      console.log("Error", await response.text());
    }
  } catch (error) {
    console.log("Error", error);
  }
}

async function signIn(creds) {
  try {
    const response = await fetch("http://localhost:3000/signIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credentials: creds }),
    });
    if (response.ok) {
      const status = await response.json();
      if (status.ok) {
        redirectToAnotherPage(status.path);
      }
    }
  } catch (error) {
    console.log("Error", error);
  }
}

async function getUsers() {
  try {
    const res = await fetch("http://localhost:3000/users");
    return (users = await res.json());
  } catch (error) {
    console.log("There was a problem fetching users");
  }
}
