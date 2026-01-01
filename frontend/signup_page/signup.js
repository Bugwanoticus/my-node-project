function showErrors(errors) {
    document.querySelectorAll("[data-error-for]").forEach(el => {
        el.textContent = "";
    });

    Object.entries(errors).forEach(([field, messages]) => {
        const el = document.querySelector(
            '[data-error-for="${field}"'
        );
        if (el) {
            el.textContent = messages.join(", ");
        }
    });
}

document
    .getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const signupData = {
        username: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value,
        confirm_password: document.getElementById("confirm_password").value,
        email: document.getElementById("email").value.trim()
    };

    const errors = validateSignup(signupData); 
    if (errors) {
        showErrors(errors);
        return;
    }

    try {
        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, confirm_password, email })
        });
        const raw = await res.text();

    // success = go to the app
    window.location.href = "/";
      } catch (err) {
      console.error("Signup error has occured", err);
      errorEl.textContent = " Could not reach server. Connection check?";
      }
    });