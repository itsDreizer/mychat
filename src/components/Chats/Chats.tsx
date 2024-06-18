import React, { memo } from "react";

import { IUserData } from "@/API/types";
import ChatsSearchList from "@/components/ChatsSearchList/ChatsSearchList";
import ChatPreview from "@/components/UI/chatPreview/ChatPreview";
import { useSearch } from "@/hooks/useSearch";
import savedMessages from "@/images/icons/saved-messages.jpg";
import MessengerControls from "@/pages/messenger/MessengerControls";
import { ISelectedChat } from "@/types";
import "./Chats.scss";

interface IChatsProps {
  userData: IUserData;
  selectedChat: ISelectedChat;
  setSelectedChat: React.Dispatch<React.SetStateAction<ISelectedChat>>;
}

const Chats: React.FC<IChatsProps> = memo((props) => {
  const { selectedChat, setSelectedChat, userData } = props;
  const {
    searchedUser,
    searchedUserLoading,
    setLocalSearchQuery,
    setGlobalSearchQuery,
    localSearchQuery,
    globalSearchQuery,
  } = useSearch();

  const isNoResult =
    (localSearchQuery || globalSearchQuery) && (!searchedUser?.length || searchedUser[0].id === userData.id);



  return (
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
  );
});

export default Chats;
