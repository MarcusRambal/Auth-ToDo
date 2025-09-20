// Credenciales válidas
const users = [{ username: "admin", password: "admin" }];

if (localStorage.getItem("isAuthenticated") === "true") {
  window.location.href = "index.html";
}

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submit");

submitBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("username", username);
    window.location.href = "index.html";
  } else {
    alert("Credenciales incorrectas");
  }
});
