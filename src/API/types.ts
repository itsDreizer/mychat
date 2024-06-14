import { FieldValue, Timestamp } from "firebase/firestore";

export interface IUserData {
  nickname?: string;
  BIO?: string;
  id?: string;
  userId?: string;
  photoURL?: string;
  online?: Timestamp | FieldValue;
}
