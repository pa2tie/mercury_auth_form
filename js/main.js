var loginFormWrapper = document.getElementsByClassName("login-form-wrapper")[0];
var loginForm = document.getElementById("loginForm");
var emailInputElement = loginForm.getElementsByClassName("login__form-email")[0];

emailInputElement.addEventListener("input", async (event) => {
    await removeInputError(emailInputElement);
});

loginForm.addEventListener("submit", async (event) => {
    await event.preventDefault();
    
    await disableFormInputs(loginForm, true);

    var loginResponse = await loginRequest(loginForm);
    var loginResponseData = await loginResponse.json();

    if (loginResponse.status == 200) {
        await removeInputError(emailInputElement);
        await clearFormInputs(loginForm);
        await removeFormError(loginForm);
        await hideElement(loginFormWrapper);
        await setProfile(loginResponseData);
    } else {
        switch(loginResponse.status) {
            case 400:
                await removeFormError(loginForm);
                await setFormError(loginForm, loginResponseData);
                await setInputError(emailInputElement);
                break;
            default:
                await removeFormError(loginForm);
                await setFormError(loginForm, loginResponseData);
                break;
        }
    }

    await disableFormInputs(loginForm, false);
});

async function loginRequest(form) {
    const url = 'https://us-central1-mercdev-academy.cloudfunctions.net/login';
    var data = await objectifyForm(form);
    data = await JSON.stringify(data);

    var params = {
        headers: {
            "Content-Type":"application/json; charset=utf-8"
        },
        body: data,
        method: "POST"
    }
    
    return await fetch(url, params);
}

async function objectifyForm(formArray) { //serialize form data function
    var returnArray = {};
    Array.prototype.slice.call(formArray).forEach(el => {
        if (el['name']) returnArray[el['name']] = el['value']; 
    });
    return returnArray;
}

async function disableFormInputs(form, state) {
    Array.prototype.slice.call(form.elements).forEach(el => {
        el.readOnly = state;
    });
}

async function createProfileElement(profileData) {
    var profile = await document.createElement("div");
    await profile.classList.add("profile");

    var profileImg = await document.createElement("img");
    profileImg.src = await profileData["photoUrl"];
    await profileImg.classList.add("profile-img");
    await profile.appendChild(profileImg);

    var profileName = await document.createElement("span");
    profileName.textContent = await profileData["name"];
    await profileName.classList.add("profile-name");
    await profile.appendChild(profileName);

    var logoutBtn = await document.createElement("button");
    await logoutBtn.classList.add("btn");
    await logoutBtn.classList.add("logout-btn");
    logoutBtn.innerHTML = "Logout";
    logoutBtn.addEventListener("click", async (event) => {
        await logout(profile);
    });
    await profile.appendChild(logoutBtn);

    return profile;
}

async function setProfile(profileData) {
    var el = await createProfileElement(profileData);
    await document.getElementsByClassName("login")[0].appendChild(el);
}

async function removeProfile(profileElement) {
    if (profileElement) profileElement.remove();
}

async function showElement(form) {
    form.style.display = "block";
}

async function hideElement(form) {
    form.style.display = "none";
}

async function setFormError(form, error) {
    var errMsg = await createErrorMsgElement(error);
    await form.insertBefore(errMsg, form.getElementsByClassName("btn")[0]);
}

async function removeFormError(form) {
    var errorMsgElement = form.getElementsByClassName("error-msg")[0];
    if (errorMsgElement) errorMsgElement.remove();
}

async function createErrorMsgElement(error) {
    var p = document.createElement("p");
    p.innerHTML = error["error"];
    p.classList.add("error-msg");
    return p;
}

async function setInputError(inputElement) {
    if (inputElement) inputElement.classList.add("error-input");
}

async function removeInputError(inputElement) {
    if (inputElement) inputElement.classList.remove("error-input"); 
}

async function clearFormInputs(form) {
    Array.prototype.slice.call(form.elements).forEach(el => {
        el.value = "";
    });
}

async function logout(profileElement) {
    removeProfile(profileElement);
    loginFormWrapper.style.display = "block";
}