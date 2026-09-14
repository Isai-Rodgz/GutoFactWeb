export interface User {

  id: string;

  email: string;

  password: string;

  empresa?: string;

  country: string;

  createdAt: Date;

}