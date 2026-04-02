export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  rank?: string;
  preference?: string;
  role?: string;
}