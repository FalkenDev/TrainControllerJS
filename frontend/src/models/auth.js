export const auth = {
  login: async (email, password) => {
    const API_URL = "https://jsramverk-editor-kafa21.azurewebsites.net";
    const response = await fetch(`${API_URL}/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    console.log("Login Successful:", data);
    return { email };
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  register: async (email, password) => {
    try {
      const API_URL = "https://jsramverk-editor-kafa21.azurewebsites.net";
      const response = await fetch(`${API_URL}/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const data = await response.json();
      console.log("Registration Successful:", data);
    } catch (error) {
      console.error("Registration Error:", error.message);
    }
  },
};
