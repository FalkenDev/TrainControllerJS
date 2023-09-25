export const auth = {
  login: async (email, password) => {
    const API_URL = "http://localhost:8393";
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
      const API_URL = "http://localhost:8393";
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

  fetchUserData: async () => {
    try {
      const API_URL = "http://localhost:8393";
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }
      const response = await fetch(`${API_URL}/v1/auth/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user data");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      throw error;
    }
  },
};
