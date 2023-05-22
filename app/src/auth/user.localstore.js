import Cookies from "js-cookie";

export const getUserToken = () => {
  const userToken = localStorage.getItem("access_token");
  return userToken || undefined;
};

export const setUserToken = (data) => {
  console.log("data", data);
  localStorage.setItem("access_token", data?.token);
};

export const removeUserToken = () => {
  Cookies.remove("access_token_cookie");
};
