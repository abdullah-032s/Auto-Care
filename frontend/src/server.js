const PROD_API = "http://localhost:8001/api/v2";
const DEV_API = "http://localhost:8001/api/v2";

export const server =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "development" ? DEV_API : PROD_API);

export const backendUrl = "http://localhost:8001";
export const frontendUrl = "http://localhost:3000";
export const socketUrl = "http://localhost:4000";




