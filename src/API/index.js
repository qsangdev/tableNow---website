import axios from "axios";

export const getBills = () => {
  return axios.get("http://localhost:3000/bills");
};

export const getStaffs = () => {
  return axios.get("http://localhost:3000/staffs");
};

export const getReservation = () => {
  return axios.get("http://localhost:3000/shift");
};

export const getRating = () => {
  return axios.get("http://localhost:3000/rate");
};
