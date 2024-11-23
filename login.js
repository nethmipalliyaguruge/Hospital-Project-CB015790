function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    // Basic validation logic
    if (username === "admin" && password === "password123") {
        alert("Login Successful!");
        errorMessage.textContent = "";
        // Redirect to dashboard or home page here
        // window.location.href = "dashboard.html";
    } else {
        errorMessage.textContent = "Invalid username or password. Please try again.";
    }
}