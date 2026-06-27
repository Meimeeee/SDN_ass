import { http } from "./http";

export const authApi = {
  register(payload) {
    return http.post("/users/register", payload).then((res) => res.data);
  },
  login(payload) {
    return http.post("/users/login", payload).then((res) => res.data);
  },
  getMe() {
    return http.get("/users/me").then((res) => res.data);
  },
};
