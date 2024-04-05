import { auth, firebaseStorage, firebaseUpdateProfile, firestore } from "@/API/firebase";

import { getAuth, signOut } from "firebase/auth";
import React, { useEffect, useMemo, useState } from "react";
import { useCollectionData, useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { useDownloadURL, useUploadFile } from "react-firebase-hooks/storage";
import { useAuthState } from "react-firebase-hooks/auth";

import savedMessages from "../../images/icons/saved-messages.jpg";

import { DocumentData, collection, doc, query, setDoc, updateDoc, where } from "firebase/firestore";
import MessengerControlls from "./MessengerControlls";
import { IUserData } from "@/API/types";
import { Button, List, ListItem } from "@mui/material";
import PageLoader from "../pageLoader/PageLoader";
import ChatPreview from "@/components/UI/chatPreview/ChatPreview";
import SearchList from "./SearchList";
import "./Messenger.scss";

const Messenger: React.FC = () => {
  // const [value] = useDownloadURL(storageRef(firebaseStorage, "gs://chat-be064.appspot.com/"));
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [user] = useAuthState(auth);
  const [users, usersLoading] = useCollectionData<IUserData>(query(collection(firestore, "users")));
  const [userData, userDataLoading] = useDocumentData<IUserData>(user ? doc(firestore, "users", user.uid) : null);

  const globalSearchedUsers = useMemo(() => {
    return users?.filter((user) => {
      if (user.id === userData?.id) {
        return;
      }
      return user.id?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, users]);

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
          {searchQuery ? (
            searchQuery[0] === "@" ? (
              <SearchList mode="global">
                {globalSearchedUsers?.map((user) => {
                  return (
                    <li key={user.userId}>
                      <ChatPreview
                        profileID={user.id}
                        photoURL={user.photoURL}
                        isSelected={false}
                        nickname={user.nickname}
                      />
                    </li>
                  );
                })}
              </SearchList>
            ) : (
              false
            )
          ) : (
            <ul className="chats-list">
              <li className="chats-list__item">
                <ChatPreview
                  photoURL={savedMessages}
                  onClick={() => {
                    setIsSelected(!isSelected);
                  }}
                  isSelected={isSelected}
                  nickname="Избранное"
                  lastMessage="Привет"
                  lastMessageDate="18:00"
                />
              </li>
            </ul>
          )}
        </div>
        <div className="opened-chat">
          <span className="opened-chat__starter">Выберите чат чтобы начать общение</span>
        </div>
      </div>
    </main>
  );
};

export default Messenger;
