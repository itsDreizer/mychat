import React, { memo, useRef } from "react";
import Chat from "@/components/Chat/Chat";
import { CSSTransition } from "react-transition-group";
import { useAppSelector } from "@/redux/hooks";
import { ISelectedChat } from "@/types";
import { IUserData } from "@/API/types";

import "./OpenedChat.scss"

interface IOpenedChatProps {
  userData: IUserData;
  selectedChat: ISelectedChat;
  setSelectedChat: React.Dispatch<React.SetStateAction<ISelectedChat>>;
}

const OpenedChat: React.FC<IOpenedChatProps> = memo((props) => {
  const { selectedChat, setSelectedChat, userData } = props;

  const openedChatRef = useRef(null);
  const windowWidth = useAppSelector((state) => {
    return state.commonStatesReducer.windowWidth;
  });

  return (
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
  );
});

export default OpenedChat;
