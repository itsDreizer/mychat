import { auth, firestore, refreshOnline } from "@/API/firebase";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";

import savedMessages from "@/images/icons/saved-messages.jpg";

import { IUserData } from "@/API/types";
import ChatPreview from "@/components/UI/chatPreview/ChatPreview";
import { Timestamp, collection, doc, query, where, DocumentData } from "firebase/firestore";
import PageLoader from "../pageLoader/PageLoader";
import MessengerControls from "./MessengerControls";
import ChatsSearchList from "../../components/ChatsSearchList/ChatsSearchList";
import UnauthorizedPage from "../errors/UnauthorizedPage";
import { useSearch } from "@/hooks/useSearch";
import Chat from "@/components/Chat/Chat";
import "./Messenger.scss";
import { useAppSelector } from "@/redux/hooks";
import { CSSTransition } from "react-transition-group";

const Messenger: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<{ userId: string; isSelected: boolean }>({
    userId: "",
    isSelected: false,
  });
  const [user, userLoading] = useAuthState(auth);
  const [userData, userDataLoading] = useDocumentData<IUserData>(user && doc(firestore, "users", user.uid));

  const openedChatRef = useRef(null);

  const {
    searchedUser,
    searchedUserLoading,
    setLocalSearchQuery,
    setGlobalSearchQuery,
    localSearchQuery,
    globalSearchQuery,
  } = useSearch();

  const windowWidth = useAppSelector((state) => {
    return state.commonStatesReducer.windowWidth;
  });

  // const localSearchedChat = () => {

  // }

  useEffect(() => {
    refreshOnline();
    const intervalId = setInterval(refreshOnline, 60000);
    document.title = "Мессенджер";

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (userDataLoading || userLoading) {
    return <PageLoader />;
  }

  if (!userData) {
    return <UnauthorizedPage />;
  }

  const isNoResult =
    (localSearchQuery || globalSearchQuery) && (!searchedUser?.length || searchedUser[0].id === userData.id);

  return (
    <main className="messenger-page">
      <div className="messenger-page__container">
        <div className="chats">
          <MessengerControls
            userData={userData}
            setGlobalSearchQuery={setGlobalSearchQuery}
            setLocalSearchQuery={setLocalSearchQuery}
          />
          {globalSearchQuery && (
            <ChatsSearchList mode="global">
              {searchedUser?.map((user) => {
                if (user.id !== userData.id) {
                  return (
                    <li key={user.userId}>
                      <ChatPreview
                        onClick={() => {
                          if (user.userId) {
                            setSelectedChat({ userId: user.userId, isSelected: true });
                          } else {
                            throw new Error("Ошибка!");
                          }
                        }}
                        profileID={user.id}
                        photoURL={user.photoURL}
                        isSelected={selectedChat.isSelected && selectedChat.userId === user.userId}
                        nickname={user.nickname}
                      />
                    </li>
                  );
                }
              })}
            </ChatsSearchList>
          )}
          {localSearchQuery && <ChatsSearchList mode="local"></ChatsSearchList>}
          {isNoResult && !searchedUserLoading && <div className="chats__no-result">Совпадений не найдено</div>}
          {searchedUserLoading && globalSearchQuery && <div className="chats__loading">Загрузка</div>}
          {!localSearchQuery && !globalSearchQuery && (
            <ul className="chats-list">
              <li className="chats-list__item">
                <ChatPreview
                  photoURL={savedMessages}
                  onClick={() => {}}
                  isSelected={false}
                  nickname="Избранное"
                  lastMessage="Привет"
                  lastMessageDate="18:00"
                />
              </li>
            </ul>
          )}
        </div>

        <CSSTransition
          onExited={() => {
            setSelectedChat((previousState) => {
              return { ...previousState, userId: "" };
            });
          }}
          nodeRef={openedChatRef}
          in={selectedChat.isSelected}
          timeout={390}>
          <div ref={openedChatRef} className={`opened-chat`}>
            {selectedChat.userId ? (
              <Chat setIsSelected={setSelectedChat} myUserData={userData} userId={selectedChat.userId} />
            ) : (
              // <div className=""></div>
              windowWidth > 1000 && <span className="opened-chat__starter">Выберите чат чтобы начать общение</span>
            )}
          </div>
        </CSSTransition>
      </div>
    </main>
  );
};

export default Messenger;
