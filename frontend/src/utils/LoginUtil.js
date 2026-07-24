export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const setUserSession = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUserSession = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
