import { auth, firestore, refreshOnline } from "@/API/firebase";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { IUserData } from "@/API/types";
import Chats from "@/components/Chats/Chats";
import OpenedChat from "@/components/OpenedChat/OpenedChat";
import { ISelectedChat } from "@/types";
import { doc } from "firebase/firestore";
import UnauthorizedPage from "../errors/UnauthorizedPage";
import PageLoader from "../pageLoader/PageLoader";
import CustomMUISnackbar from "@/components/UI/customMUISnackbar/CustomMUISnackbar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setIsClipboardSnackbarVisible } from "@/redux/reducers/SnackbarSlice";
import "./Messenger.scss";

const Messenger: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<ISelectedChat>({
    userId: "",
    isSelected: false,
  });
  const [user, userLoading] = useAuthState(auth);
  const [userData, userDataLoading] = useDocumentData<IUserData>(user && doc(firestore, "users", user.uid));

  const { isClipboardSnackbarVisible } = useAppSelector((state) => {
    return state.snackbarReducer;
  });

  const dispatch = useAppDispatch();
  // const localSearchedChat = () => {

  // }

  useEffect(() => {
    document.title = "Мессенджер";
    refreshOnline();
    const intervalId = setInterval(refreshOnline, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (userDataLoading || userLoading) {
    return <PageLoader />;
  }

  if (!userData || !user) {
    return <UnauthorizedPage />;
  }

  return (
    <main className="messenger-page">
      <div className="messenger-page__container">
        <Chats userData={userData} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
        <OpenedChat userData={userData} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
        <CustomMUISnackbar
          onClose={(e, reason) => {
            if (reason === "clickaway") {
              return;
            }
            dispatch(setIsClipboardSnackbarVisible(false));
          }}
          open={isClipboardSnackbarVisible}
          message={"Скопировано в буфер обмена!"}
          autoHideDuration={3000}
        />
      </div>
    </main>
  );
};

export default Messenger;
