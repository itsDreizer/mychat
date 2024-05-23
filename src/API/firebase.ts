import { IAuthProperties } from "@/types";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { IUserData } from "./types";
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
export const firestore = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);

export const auth = getAuth();

setPersistence(auth, browserLocalPersistence);

export const firebaseRegister = async ({ email, password, nickname }: IAuthProperties) => {
  try {
    const resultOfRegistration = await createUserWithEmailAndPassword(auth, email, password);
    const user = resultOfRegistration.user;
    await updateProfile(user, { displayName: nickname });
    await setDoc(doc(firestore, "users", user.uid), {
      nickname,
      id: `@id${user.uid.slice(0, 8).toLowerCase()}`,
      userId: user.uid,
    });
    return resultOfRegistration;
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

export const firebaseUpdateProfile = async (userData: IUserData) => {
  try {
    if (auth.currentUser) {
      updateDoc(doc(firestore, "users", auth.currentUser.uid), {
        ...userData,
      });
      return await updateProfile(auth.currentUser, { displayName: userData.nickname, photoURL: userData.photoURL });
    }
  } catch (error) {
    console.log(error);
  }
};

export const isIdExists = async (id: string) => {
  try {
    const snapshot = await getDocs(query(collection(firestore, "users"), where("id", "==", `${id}`)));
    return snapshot.docs.length;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return error.message;
    }
  }
};
