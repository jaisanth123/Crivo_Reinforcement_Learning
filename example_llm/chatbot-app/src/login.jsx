import React, { useState } from "react";

function Login() {
  const [isLogin, setIsLogin] = useState(false);

  const toggleForms = () => setIsLogin(!isLogin);

  const register = () => {
    const fullName = document.getElementById("fullName").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const age = document.getElementById("age").value;
    const country = document.getElementById("country").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (fullName && username && email && password && age && country) {
      localStorage.setItem(
        "user",
        JSON.stringify({ username, email, password, age, country })
      );
      alert("Signup successful! You can now log in.");
      toggleForms();
    } else {
      alert("Please fill all fields!");
    }
  };

  const login = () => {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.username === username && user.password === password) {
      alert("Login successful! Redirecting to Typing Test...");
      // Replace with your actual redirection
      window.location.href = "typing_test.html";
    } else {
      alert("Invalid username or password.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-700 to-blue-500">
      <div className="w-96 bg-white p-8 rounded-lg shadow-md">
        {isLogin ? (
          <div className="form-container">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Login</h2>
            <input
              type="text"
              id="loginUsername"
              placeholder="Username"
              className="input-field"
              required
            />
            <input
              type="password"
              id="loginPassword"
              placeholder="Password"
              className="input-field"
              required
            />
            <button className="button" onClick={login}>
              Login
            </button>
            <p className="mt-4 text-sm">
              Don't have an account?{" "}
              <a
                href="#"
                onClick={toggleForms}
                className="text-purple-600 font-bold hover:underline"
              >
                Sign up here
              </a>
            </p>
          </div>
        ) : (
          <div className="form-container">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign Up</h2>
            <input
              type="text"
              id="fullName"
              placeholder="Full Name"
              className="input-field"
              required
            />
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="input-field"
              required
            />
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="input-field"
              required
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="input-field"
              required
            />
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              className="input-field"
              required
            />
            <input
              type="number"
              id="age"
              placeholder="Age"
              className="input-field"
              required
            />
            <input
              type="text"
              id="country"
              placeholder="Country"
              className="input-field"
              required
            />
            <button className="button" onClick={register}>
              Sign Up
            </button>
            <p className="mt-4 text-sm">
              Already have an account?{" "}
              <a
                href="#"
                onClick={toggleForms}
                className="text-purple-600 font-bold hover:underline"
              >
                Login here
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
