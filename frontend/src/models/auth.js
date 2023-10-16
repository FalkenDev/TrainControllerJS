import { gql } from "@apollo/client/core";
import { apolloClient } from "../main.js";

export const auth = {
  login: async (email, password) => {
    const LOGIN_MUTATION = gql`
      mutation loginUser($LoginUser: LoginInput!) {
        loginUser(LoginUser: $LoginUser) {
          token
        }
      }
    `;

    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: {
          LoginUser: { email, password },
        },
      });

      localStorage.setItem("token", data.loginUser.token);
      return { email };
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  register: async (email, password) => {
    const REGISTER_MUTATION = gql`
      mutation registerUser($RegisterUser: RegisterInput!) {
        registerUser(RegisterUser: $RegisterUser) {
          message
        }
      }
    `;

    try {
      const { data } = await apolloClient.mutate({
        mutation: REGISTER_MUTATION,
        variables: {
          RegisterUser: { email, password },
        },
      });

      console.log("Registration Successful:", data);
    } catch (error) {
      throw new Error(error.message || "Registration failed");
    }
  },

  fetchUserData: async () => {
    const GET_USER_DATA_QUERY = gql`
      query getUserData {
        getUserData {
          id
          email
        }
      }
    `;

    try {
      const token = localStorage.getItem("token");
      console.log("jag är en token", token);
      if (!token) {
        throw new Error("No token found");
      }

      const { data } = await apolloClient.query({
        query: GET_USER_DATA_QUERY,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
      return data.getUserData;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user data");
    }
  },
};
