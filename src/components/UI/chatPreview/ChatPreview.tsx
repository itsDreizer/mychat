import { DefaultProps } from "@/types";
import { Avatar, Link, ListItemButton } from "@mui/material";
import React from "react";

import { TMessageDeliveryState } from "@/types";

import "./ChatPreview.scss";
import { AccessTime, Done, DoneAll, HistoryToggleOff } from "@mui/icons-material";

interface IChatPreviewProps extends DefaultProps {
  photoURL?: string;
  nickname?: string;
  lastMessage?: string;
  lastMessageDate?: string;
  messageDeliveryState?: TMessageDeliveryState;
  isSelected: boolean;
  profileID?: string;
  onClick?: () => void;
}

const ChatPreview: React.FC<IChatPreviewProps> = (props) => {
  const { photoURL, nickname, lastMessage, lastMessageDate, messageDeliveryState, isSelected, onClick, profileID } =
    props;
  return (
    <ListItemButton onClick={onClick} color="secondary" selected={isSelected} className="chat-preview">
      <div className="chat-preview__block-img">
        <Avatar className="chat-preview__avatar" src={photoURL} />
      </div>
      <div className="chat-preview__body">
        <div className="chat-preview__info">
          <div className="chat-preview__nickname">{nickname ?? "Без имени"}</div>
          <div className="chat-preview__states">
            <div className="hat-preview__delivery-state">
              {/* Компоненты: <Done/> <DoneAll/> <AccessTime ИЛИ HistoryToggleOff/> */}
              {/* <Done /> */}
              {/* <DoneAll /> */}
              {/* <AccessTime /> */}
            </div>
            <div className="hat-preview__message-date">{lastMessageDate}</div>
          </div>
        </div>
        {lastMessage ? <div className="chat-preview__last-message">{lastMessage}</div> : false}
        {profileID ? (
          <Link color={"secondary"} className="chat-preview__profile-id" underline="none">
            {profileID}
          </Link>
        ) : (
          false
        )}
      </div>
    </ListItemButton>
  );
};

export default ChatPreview;
