const body = document.body;
let forms = [];
let inputs = [];
let message;

function createSignUpAuth() {
  const signUpContainer = document.createElement("div");
  const signUpForm = document.createElement("form");
  const emailHolder = document.createElement("p");
  const password = document.createElement("input");
  const confirmPassword = document.createElement("input");
  const signUpBtn = document.createElement("button");
  const signUpMessage = document.createElement("p");

  emailHolder.innerText = getEmailFromLocalStorage() || "Gå tillbaka och ange meljadress för att skapa konto";

  password.setAttribute("placeHolder", "Ange ett lösenord");
  inputs.push({ name: "password", el: password });

  confirmPassword.setAttribute("placeholder", "Bekräfta lösenord");
  inputs.push({ name: "confirm", el: confirmPassword });

  signUpBtn.innerText = "Skapa konto";
  signUpBtn.setAttribute("type", "submit");
  signUpBtn.setAttribute("class", "submitBtn");

  message = signUpMessage;

  signUpForm.appendChild(emailHolder);
  signUpForm.appendChild(password);
  signUpForm.appendChild(confirmPassword);
  signUpForm.appendChild(signUpBtn);

  signUpContainer.appendChild(signUpForm);

  body.appendChild(signUpContainer);
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

createSignUpAuth();
