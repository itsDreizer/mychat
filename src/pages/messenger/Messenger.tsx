import { auth, firebaseUpdateProfile, firestore } from "@/API/firebase";

import { getAuth, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useCollectionData, useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { collection, doc, query, setDoc, updateDoc, where } from "firebase/firestore";
import "./Messenger.scss";
import MessengerControlls from "./MessengerControlls";
import { IUserData } from "@/API/types";
import { Button, List, ListItem } from "@mui/material";
import PageLoader from "../pageLoader/PageLoader";
import ChatPreview from "@/components/UI/chatPreview/ChatPreview";

const Messenger: React.FC = () => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [user] = useAuthState(auth);
  const [users, usersLoading] = useCollectionData<IUserData>(query(collection(firestore, "users")));
  const [userData, userDataLoading] = useDocumentData<IUserData>(user ? doc(firestore, "users", user.uid) : null);

  useEffect(() => {
    document.title = "Мессенджер";
  }, []);

  if (userDataLoading) {
    return <PageLoader />;
  }

  return (
    <main className="messenger-page">
      <div className="messenger-page__container">
        <div className="chats">
          <MessengerControlls userData={userData} setSearchQuery={setSearchQuery} />
          <List className="chats-list">
            <li className="chats-list__item">
              <ChatPreview
                onClick={() => {
                  setIsSelected(!isSelected);
                }}
                isSelected={isSelected}
                nickname="Избранное"
                lastMessage="Привет"
                lastMessageDate="18:00"
              />
            </li>
          </List>
        </div>
        <div className="opened-chat">
          <span className="opened-chat__starter">Выберите чат чтобы начать общение</span>
        </div>
      </div>
    </main>
  );
};

export default Messenger;
