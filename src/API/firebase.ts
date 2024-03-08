import { setIsAuth } from "@/redux/reducers/AuthSlice";
import { IAuthProperties } from "@/types";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-MfCPYcH_AeRrmaN4ISGw6aE7QKjeERA",
  authDomain: "chat-be064.firebaseapp.com",
  projectId: "chat-be064",
  storageBucket: "chat-be064.appspot.com",
  messagingSenderId: "749770734811",
  appId: "1:749770734811:web:7d3e681be25f7d9e6260fe",
  measurementId: "G-VGKZ98473T",
};

export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth();

export const firebaseRegister = async ({ email, password }: IAuthProperties) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    return error.message;
  }
};
export const firebaseLogin = async ({ email, password }: IAuthProperties) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    return error.message;
  }
};

