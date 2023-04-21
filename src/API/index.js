import axios from "axios";

export const getBills = () => {
  return axios.get("http://localhost:3000/bills");
};
