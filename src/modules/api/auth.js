import api from "./api";

export async function getProfile() {
  const { data } = await api.get("/api/user/profile");
  return data;
}

export async function login(loginForm) {
  const res = await api.post("/api/user/login", loginForm);
  return res.data;
}

export async function register(registerForm) {
  const res = await api.post("/api/user/register", registerForm);
  return res.data;
}

