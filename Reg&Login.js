import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJWGwgz6_-f73tDa0XhcEZNjVGgvAl5QA",
    authDomain: "authentication-ea1a6.firebaseapp.com",
    projectId: "authentication-ea1a6",
    storageBucket: "authentication-ea1a6.firebasestorage.app",
    messagingSenderId: "989899401271",
    appId: "1:989899401271:web:91b04fc926be5c336577b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/*---------------------------------------------------------Register Account function---------------------------------------------------------------------*/
//Declaration by getting id or info
const R_btn = document.getElementById('R-btn');
const R_message = document.querySelector(".R_message_box");

//Fucntion when button Click 
R_btn.addEventListener('click', function (event) {
    //Declaration inside the function
    const R_email = document.getElementById("register-email").value;
    const R_password = document.getElementById("register-password").value;

    event.preventDefault()
    createUserWithEmailAndPassword(auth, R_email, R_password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            R_message.classList.remove("Error");
            R_message.classList.add("Created");
            R_message.textContent = "Account Successfully Created!";
            setTimeout(() => {
                closeAuthModal();
            }, 1000);
        })

        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            if (errorCode == "auth/email-already-in-use") {
                R_message.classList.add("Error");
                R_message.textContent = "This email has been registed!";
            }
            else if (errorCode == "auth/weak-password") {
                R_message.classList.add("Error");
                R_message.textContent = "The password must be at lease 6 charactor!";
            }
            else if (errorCode == "auth/invalid-email") {
                R_message.classList.add("Error");
                R_message.textContent = "This email format is invalid!";
            }
        });
})

/*---------------------------------------------------------Login Account function---------------------------------------------------------------------*/
const L_btn = document.getElementById('L-btn');
const L_message = document.querySelector(".L_message_box");

L_btn.addEventListener('click', function (event) {
    const L_email = document.getElementById("login-email").value;
    const L_password = document.getElementById("login-password").value;

    event.preventDefault()
    signInWithEmailAndPassword(auth, L_email, L_password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            L_message.classList.remove("LoginError");
            L_message.classList.add("Login");
            L_message.textContent = "Login Successfully";
            isUserLoggedIn = true;
            setTimeout(() => {
                updateAuthUI();
                closeAuthModal();
            }, 1000);

        })

        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            if (errorCode == "auth/invalid-credential") {
                L_message.classList.add("LoginError");
                L_message.textContent = "This user or password is incorrect";
            }
            else if (errorCode == "auth/network-request-failed") {
                L_message.classList.add("LoginError");
                L_message.textContent = "The server is under maintenance";
            }
            else if (errorCode == "auth/invalid-email") {
                L_message.classList.add("LoginError");
                L_message.textContent = "This email format is invalid!";
            }
        })
})