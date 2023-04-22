export type Dog = {
  id: number;
  name: string;
  breed: string;
  gender: string;
  hdbapproved: boolean;
  dob: Date;
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

export type AdoptionForm = {
  dog_id: number;
  user_id: number;
  history: boolean;
  activity_level: string;
  existing_pet: string;
  reason: string;
};

export type FosterForm = {
  dog_id: number;
  user_id: number;
  history: boolean;
  activity_level: string;
  existing_pet: string;
  reason: string;
  duration: string;
};

export type PostFormProps = {
  dogs: Dog[];
};
