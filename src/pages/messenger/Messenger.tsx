import { auth, firestore } from "@/API/firebase";

import React, { useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";

import savedMessages from "@/images/icons/saved-messages.jpg";

import { IUserData } from "@/API/types";
import ChatPreview from "@/components/UI/chatPreview/ChatPreview";
import { collection, doc, query } from "firebase/firestore";
import PageLoader from "../pageLoader/PageLoader";
import MessengerControls from "./MessengerControls";
import ChatsSearchList from "./ChatsSearchList";
import "./Messenger.scss";
import UnauthorizedPage from "../errors/UnauthorizedPage";

const Messenger: React.FC = () => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [user] = useAuthState(auth);
  const [users, usersLoading] = useCollectionData<IUserData>(query(collection(firestore, "users")));
  const [userData, userDataLoading] = useDocumentData<IUserData>(user && doc(firestore, "users", user.uid));

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

  if (!userData) {
    return <UnauthorizedPage />;
  }

  return (
    <main className="messenger-page">
      <div className="messenger-page__container">
        <div className="chats">
          <MessengerControls userData={userData} setSearchQuery={setSearchQuery} />
          {searchQuery ? (
            searchQuery[0] === "@" ? (
              <ChatsSearchList mode="global">
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
              </ChatsSearchList>
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
