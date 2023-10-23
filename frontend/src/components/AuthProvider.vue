<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { auth } from "../models/auth.js";
import { onMounted, provide, reactive, ref } from "vue";

export default {
  setup() {
    const isAuthenticated = ref(false);
    const user = reactive({});

    const register = async (email, password) => {
      await auth.register(email, password);
    };

    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await auth.fetchUserData();
          Object.assign(user, userData);
          isAuthenticated.value = true;
        } catch (error) {
          console.error("Error validating token:", error.message);
          isAuthenticated.value = false;
          localStorage.removeItem("token");
        }
      } else {
        isAuthenticated.value = false;
      }
    };

    const login = async (email, password) => {
      try {
        const userData = await auth.login(email, password);
        isAuthenticated.value = true;
        Object.assign(user, userData);
      } catch (error) {
        console.error("Login Error:", error.message);
        isAuthenticated.value = false;
      }
    };

    const logout = () => {
      auth.logout();
      isAuthenticated.value = false;
      Object.assign(user, {});
    };

    onMounted(checkAuthentication);

    provide("auth", {
      isAuthenticated,
      user,
      login,
      logout,
      register,
    });
  },
};
</script>
