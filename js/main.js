var loginFormWrapper = document.getElementsByClassName("login-form-wrapper")[0];
var loginForm = document.getElementById("loginForm");
var emailInputElement = loginForm.getElementsByClassName("login__form-email")[0];

emailInputElement.addEventListener("input", (event) => {
    removeInputError(emailInputElement);
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    disableFormInputs(loginForm, true);

    var loginResponse = await loginRequest(loginForm);
    var loginResponseData = await loginResponse.json();

    if (loginResponse.status == 200) {
        removeInputError(emailInputElement);
        clearFormInputs(loginForm);
        removeFormError(loginForm);
        hideElement(loginFormWrapper);
        setProfile(loginResponseData);
    } else {
        switch(loginResponse.status) {
            case 400:
                removeFormError(loginForm);
                setFormError(loginForm, loginResponseData);
                setInputError(emailInputElement);
                break;
            default:
                removeFormError(loginForm);
                setFormError(loginForm, loginResponseData);
                break;
        }
    }

    disableFormInputs(loginForm, false);
});

async function loginRequest(form) {
    const url = 'https://us-central1-mercdev-academy.cloudfunctions.net/login';
    var data = objectifyForm(form);
    data = JSON.stringify(data);

    var params = {
        headers: {
            "Content-Type":"application/json; charset=utf-8"
        },
        body: data,
        method: "POST"
    }
    
    return await fetch(url, params);
}

function objectifyForm(formArray) { //serialize form data function
    var returnArray = {};
    Array.prototype.slice.call(formArray).forEach(el => {
        if (el['name']) returnArray[el['name']] = el['value']; 
    });
    return returnArray;
}

function disableFormInputs(form, state) {
    Array.prototype.slice.call(form.elements).forEach(el => {
        el.readOnly = state;
    });
}

function createProfileElement(profileData) {
    var profile = document.createElement("div");
    profile.classList.add("profile");

    var profileImg = document.createElement("img");
    profileImg.src = profileData["photoUrl"];
    profileImg.classList.add("profile-img");
    profile.appendChild(profileImg);

    var profileName = document.createElement("span");
    profileName.textContent = profileData["name"];
    profileName.classList.add("profile-name");
    profile.appendChild(profileName);

    var logoutBtn = document.createElement("button");
    logoutBtn.classList.add("btn");
    logoutBtn.classList.add("logout-btn");
    logoutBtn.innerHTML = "Logout";
    logoutBtn.addEventListener("click", (event) => {
        logout(profile);
    });
    profile.appendChild(logoutBtn);

    return profile;
}

function setProfile(profileData) {
    var el = createProfileElement(profileData);
    document.getElementsByClassName("login")[0].appendChild(el);
}

function removeProfile(profileElement) {
    if (profileElement) profileElement.remove();
}

function showElement(form) {
    form.style.display = "block";
}

function hideElement(form) {
    form.style.display = "none";
}

async function setFormError(form, error) {
    var errMsg = createErrorMsgElement(error);
    form.insertBefore(errMsg, form.getElementsByClassName("btn")[0]);
}

function removeFormError(form) {
    var errorMsgElement = form.getElementsByClassName("error-msg")[0];
    if (errorMsgElement) errorMsgElement.remove();
}

function createErrorMsgElement(error) {
    var p = document.createElement("p");
    p.innerHTML = error["error"];
    p.classList.add("error-msg");
    return p;
}

function setInputError(inputElement) {
    if (inputElement) inputElement.classList.add("error-input");
}

function removeInputError(inputElement) {
    if (inputElement) inputElement.classList.remove("error-input"); 
}

function clearFormInputs(form) {
    Array.prototype.slice.call(form.elements).forEach(el => {
        el.value = "";
    });
}

function logout(profileElement) {
    removeProfile(profileElement);
    loginFormWrapper.style.display = "block";
}
