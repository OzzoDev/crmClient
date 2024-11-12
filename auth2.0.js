const body = document.body;
const inputs = [];
const forms = [];

function createEmailAuth() {
  const emailContainer = document.createElement("div");
  const emailForm = document.createElement("form");
  const emailInput = document.createElement("input");
  const emailSubmitBtn = document.createElement("button");

  emailContainer.setAttribute("class", "userEmail");
  emailInput.setAttribute("placeholder", "Ange en mejladress");
  emailSubmitBtn.innerText = "Gå vidare";
  emailSubmitBtn.setAttribute("type", "submit");
  emailSubmitBtn.setAttribute("class", "submitBtn");

  inputs.push({ name: "email", el: emailInput });

  forms.push({ name: "email", el: emailForm, inputs: inputs });

  emailForm.appendChild(emailInput);
  emailForm.appendChild(emailSubmitBtn);

  emailContainer.appendChild(emailForm);

  body.appendChild(emailContainer);
}

function formEvents() {
  forms.forEach((form) => {
    const formName = form.name;
    const formEl = form.el;
    const inputEls = form.inputs;

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();

      switch (formName) {
        case "email":
          inputEls.forEach((input) => {
            const inputName = input.name;
            const inputEl = input.el;

            switch (inputName) {
              case "email":
                const email = inputEl.value;
                isNewUser(email);
                break;
              default:
                break;
            }
          });
          break;
        default:
          break;
      }
    });
  });
}

createEmailAuth();
formEvents();

async function isNewUser(email) {
  if (email.includes(".") && email.includes("@")) {
    const userOnServer = await getUsers();
    const existsOnServer = userOnServer.filter((user) => user.email === email).length > 0;
    if (existsOnServer) {
      console.log("User exists, sign in");
    } else {
      redirectToAnotherPage("signUp.html");
      console.log("New user, sign up");
    }
  } else {
    console.log("You must enter a vaild email");
  }
}

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

function redirectToAnotherPage(path) {
  window.location.href = path;
}
