const USER_SESSION_KEY = "grit-studios-user";

function getCurrentUser() {
  const user = localStorage.getItem(USER_SESSION_KEY);
  return user ? JSON.parse(user) : null;
}

function loginUser(email) {
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify({ email }));
}

function showMessage(message, type = "info") {
  const loginContent = document.getElementById("loginContent");
  const existingMessage = loginContent.querySelector(".login-message");
  if (existingMessage) existingMessage.remove();

  const messageEl = document.createElement("div");
  messageEl.className = `login-message login-message-${type}`;
  messageEl.textContent = message;
  loginContent.insertBefore(messageEl, loginContent.firstChild);

  if (type === "error") {
    setTimeout(() => messageEl.remove(), 3000);
  }
}

function handleLoginSubmit(e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();

  if (!email) {
    showMessage("Please enter a valid email", "error");
    return;
  }

  const orders = JSON.parse(localStorage.getItem("grit-studios-orders")) || [];
  const hasExistingOrders = orders.some(order => order.customer.email === email);

  if (hasExistingOrders) {
    showMessage("Welcome back! Redirecting...", "success");
  } else {
    showMessage("Account created! Redirecting...", "success");
  }

  loginUser(email);

  // Redirect to index.html after a short delay
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}

function checkIfAlreadyLoggedIn() {
  const user = getCurrentUser();
  if (user) {
    window.location.href = "index.html";
  }
}

function init() {
  checkIfAlreadyLoggedIn();

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }
}

document.addEventListener("DOMContentLoaded", init);
