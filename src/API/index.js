import axios from "axios";

export const getBills = () => {
  return axios.get("http://localhost:3000/bills");
};

export const getMenu = () => {
  return axios.get("http://localhost:3000/menu");
};

export const getStaffs = () => {
  return axios.get("http://localhost:3000/staffs");
};

export const getDashboard = () => {
  return axios.get("http://localhost:3000/profile");
};

export const getReservation = () => {
  return axios.get("http://localhost:3000/shift");
};

export const getRating = () => {
  return axios.get("http://localhost:3000/rate");
};

export const getImages = () => {
  return axios.get("http://localhost:3000/images");
};
