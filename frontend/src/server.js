const PROD_API = "https://backend-phi-sand-87.vercel.app/api/v2";
const DEV_API = "http://localhost:8001/api/v2";

export const server =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "development" ? DEV_API : PROD_API);

export const backendUrl = "https://backend-phi-sand-87.vercel.app";
export const frontendUrl = "https://frontend-phi-rouge-27.vercel.app";
export const socketUrl = "https://socket-flax.vercel.app";




