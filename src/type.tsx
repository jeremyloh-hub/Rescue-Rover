import { string } from "yup";

export type Dog = {
  id: number;
  name: string;
  breed: string;
  gender: string;
  hdbapproved: boolean;
  dob: string;
  status: boolean;
  personality: string;
  imgurl: string;
};

export type User = {
  name: string;
  userid: string;
  password: string;
  confirm: string;
  email: string;
  age: number;
  residential: string;
};
