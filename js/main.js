window.addEventListener("load", function () {
    function sendData(url, form, success, showError) {
        var data = objectifyForm(form);
        data = JSON.stringify(data);
        console.log(data);
        var params = {
            headers: {
                "Content-Type":"application/json; charset=utf-8"
            },
            body: data,
            method: "POST"
        }
        
        fetch(url, params)
        .then(data => {
            if (data.status == 200) {
                return data.json();
            } else {
                throw new Error(data.json());
            }
        })
        .then(res => {console.log(res);success(res);})
        .catch(error => showError(error));
    }

    function objectifyForm(formArray) { //serialize data function

        var returnArray = {};
        for (var i = 0; i < formArray.length; i++){
            if (formArray[i]['name']) {
                returnArray[formArray[i]['name']] = formArray[i]['value'];
            }
        }
        return returnArray;
    }

    function showProfile(profile) {
        removeInputError();
        document.getElementsByClassName("error-msg")[0].style.display = "none";
        document.getElementsByClassName("profile-img")[0].src = profile["photoUrl"];
        document.getElementsByClassName("profile-name")[0].textContent = profile["name"];
        document.getElementsByClassName("login-form")[0].style.display = "none";
        document.getElementsByClassName("profile")[0].style.display = "flex";
    }

    function showError(error) {
        document.getElementsByClassName("error-msg")[0].style.display = "block";
        document.getElementsByClassName("login__form-email")[0].classList.add("error-input");
    }

    var loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (event) {
        const url = 'https://us-central1-mercdev-academy.cloudfunctions.net/login';
        event.preventDefault();
        sendData(url, loginForm, showProfile, showError);
    })
});

function removeInputError() {
    document.getElementsByClassName("login__form-email")[0].classList.remove("error-input");
}

function logout() {
    document.getElementsByClassName("profile")[0].style.display = "none";
    document.getElementsByClassName("login-form")[0].style.display = "block";
}