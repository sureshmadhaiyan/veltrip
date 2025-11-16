import { defineStore } from 'pinia';
import { ref } from 'vue';
import { login, register, logout, getCurrentUser } from '../api/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(getCurrentUser());
  const isAuthenticated = ref(!!user.value);

  const setUser = (userData) => {
    user.value = userData;
    isAuthenticated.value = !!userData;
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const setToken = (token) => {
    localStorage.setItem('accessToken', token);
  };

  const setRefreshToken = (token) => {
    localStorage.setItem('refreshToken', token);
  };

  const loginUser = async (email, password) => {
    try {
      const response = await login(email, password);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await register(userData);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = () => {
    logout();
    user.value = null;
    isAuthenticated.value = false;
  };

  return {
    user,
    isAuthenticated,
    loginUser,
    registerUser,
    logoutUser,
    setUser,
    setToken,
    setRefreshToken,
  };
});

