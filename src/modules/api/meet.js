import api from "./api";

export async function meetHistory() {
  const { data } = await api.get("/api/meet/user");
  return data;
}

export async function startBot(url) {
  const { data } = await api.post("/api/bot/start", { url });
  return data;
}

export async function getMeetingDetails(id) {
  const { data } = await api.get(`/api/meet/${id}`);
  return data;
}
