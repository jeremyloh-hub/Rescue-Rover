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
  delPostForm: (id: number) => void;
};

export type PostFormDeleteProps = {
  id: number;
  delPostForm: (id: number) => void;
};

export type PostForms = {
  name: string;
  breed: string;
  gender: string;
  hdbapproved: boolean;
  dob: Date;
  status: boolean;
  personality: string;
  imgurl: string;
};

export type EditPostForms = {
  name: string;
  hdbapproved: boolean;
  dob: Date;
  personality: string;
};

export type PostFormAddProps = {
  addPost: (dog: PostForms) => void;
};

export type PostFormEditProps = {
  handleEditPost: (editedPost: EditPostForms) => void;
};
