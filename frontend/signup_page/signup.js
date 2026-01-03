function showErrors(errors) {
    document.querySelectorAll("[data-error-for]").forEach(el => {
        el.textContent = "";
    });

    Object.entries(errors).forEach(([field, messages]) => {
        const el = document.querySelector(
            `[data-error-for="${field}"]`
        );
        if (el) {
            el.textContent = Array.isArray(messages) 
                ? messages.join(", ") 
                : String(messages);
        }
    });
}

//resetting previous errors

function showServerError(err) {
    console.error("Server error:", err);

    const el = document.getElementById("global-error");
    if (!el) return;

    if (typeof err === "string") {
        el.textContent = err;
    } else {
        el.textContent = "An unknown error occurred.";
    }
}

document
    .getElementById("signup-form")
    .addEventListener("submit", async (e) => {
        e.preventDefault();

        document.getElementById("global-error").textContent = "";

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
        await application.signup(signupData);
        window.location.href = "/";
    } catch (err) {
        showServerError(err);
      }
    });