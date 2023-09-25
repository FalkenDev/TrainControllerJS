<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { auth } from "../models/auth.js";
import { ref, provide, reactive } from "vue";

export default {
  setup() {
    const isAuthenticated = ref(false);
    const user = reactive({});

    const register = async (email, password) => {
      await auth.register(email, password);
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
