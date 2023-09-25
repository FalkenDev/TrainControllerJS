<script setup>
import { inject, ref } from "vue";
const auth = inject("auth");

const email = ref("");
const password = ref("");
const passwordMatch = ref("");
const message = ref("");

const isRegister = ref(false);

const { hideLogin } = defineProps({
  hideLogin: Function,
});
const toggleRegisterMode = () => {
  email.value = "";
  password.value = "";
  message.value = "";
  isRegister.value = !isRegister.value;
};

const background = ref(null);

const closeOnBackgroundClick = (event) => {
  if (event.target === background.value) {
    hideLogin();
  }
};

const submitForm = async () => {
  if (isRegister.value) {
    // Handle registration
    if (password.value !== passwordMatch.value) {
      message.value = "Warning: Passwords must match";
      return;
    }

    try {
      await auth.register(email.value, password.value);
      isRegister.value = false;
      message.value = "Registration successful! Please log in.";
    } catch (error) {
      console.error("Registration Error:", error);
      message.value = "Error: Registration failed"; // Set an appropriate error message for registration failure
    }
  } else {
    // Handle login
    try {
      await auth.login(email.value, password.value);
      message.value = "Login successful!";
      hideLogin();
    } catch (error) {
      console.error("Login Error:", error);
      message.value = "Error: Login failed";
    }
  }
};
</script>

<template>
  <div
    @click="closeOnBackgroundClick"
    ref="background"
    class="fixed z-50 bg-opacity-60 bg-slate-700 w-screen h-screen flex flex-col"
  >
    <div class="w-1/3 bg-gray-50">
      <button @click="hideLogin">
        <v-icon class="text-3xl" name="io-close-outline" />
      </button>
      <div
        class="h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div class="max-w-md w-full space-y-8">
          <div>
            <h2
              class="mt-6 text-center text-3xl font-extrabold text-gray-900"
              v-if="isRegister"
            >
              Register a new account
            </h2>
            <h2
              class="mt-6 text-center text-3xl font-extrabold text-gray-900"
              v-else
            >
              Please sign into your account
            </h2>
          </div>
          <form
            class="mt-8 space-y-6"
            action="#"
            method="POST"
            v-if="isRegister"
          >
            <input type="hidden" name="remember" value="true" />
            <div class="rounded-md shadow-sm -space-y-px">
              <div>
                <label for="username" class="sr-only">Email</label>
                <input
                  id="registerEmail"
                  name="email"
                  type="text"
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  title="Please enter a valid email address"
                  v-model="email"
                  autocomplete="email"
                  required
                  class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                />
              </div>
              <div>
                <label for="password" class="sr-only">Password</label>
                <input
                  id="registerPassword"
                  name="password"
                  type="password"
                  v-model="password"
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                  title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
                <label for="confirmPassword" class="sr-only"
                  >Confirm Password</label
                >
                <input
                  id="confirmPassword"
                  name="password"
                  type="password"
                  required
                  class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <p class="font-semibold text-center w-full text-lg text-black mt-4">
              {{ message }}
            </p>

            <div>
              <button
                type="submit"
                @click="submitForm"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </button>
              <button
                @click="toggleRegisterMode"
                class="font-normal text-center w-full text-sm text-blue-700 mt-4"
              >
                already have an account?
              </button>
            </div>
          </form>
          <form class="mt-8 space-y-6" method="POST" v-else>
            <input type="hidden" name="remember" value="true" />
            <div class="rounded-md shadow-sm -space-y-px">
              <div>
                <label for="username" class="sr-only">Email</label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autocomplete="email"
                  v-model="email"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                />
              </div>
              <div>
                <label for="password" class="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  v-model="password"
                  autocomplete="current-password"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
            <p class="font-semibold text-center w-full text-lg text-black mt-4">
              {{ message }}
            </p>
            <div>
              <button
                type="button"
                @click="submitForm"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Log In
              </button>
              <button
                @click="toggleRegisterMode"
                class="font-normal text-center w-full text-sm text-blue-700 mt-4"
              >
                Don't have an account?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
