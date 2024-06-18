import { DefaultProps } from "@/types";
import React, { ReactNode, useEffect, useRef, useState } from "react";

import { IUserData } from "@/API/types";
import { TextareaAutosize } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";

import { firestore } from "@/API/firebase";
import { Timestamp, collection, doc, query, where } from "firebase/firestore";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import "./Chat.scss";
import { Height, KeyboardBackspace, Send } from "@mui/icons-material";
import { useAppSelector } from "@/redux/hooks";

import { useChatState } from "@/hooks/useChatState";
import PageLoader from "@/pages/pageLoader/PageLoader";

interface IChatProps extends DefaultProps {
  userId: string;
  myUserData: IUserData;
  setIsSelected: React.Dispatch<
    React.SetStateAction<{
      userId: string;
      isSelected: boolean;
    }>
  >;
}

interface IFormData {
  message: string;
}

const Chat: React.FC<IChatProps> = (props) => {
  const { userId, myUserData, setIsSelected } = props;
  const [userData, userDataLoading] = useDocumentData<IUserData>(doc(firestore, "users", userId));
  const { register, handleSubmit, formState, reset } = useForm<IFormData>({
    defaultValues: {
      message: "",
    },
  });
  const { chatState } = useChatState(userData, myUserData);

  const windowWidth = useAppSelector((state) => {
    return state.commonStatesReducer.windowWidth;
  });

  const formRef = useRef<HTMLFormElement>(null);

  if (userDataLoading) {
    return <PageLoader />;
  }

  const onSubmit: SubmitHandler<IFormData> = (data) => {
    console.log(data);
    reset();
  };

  console.log("render CHAT");

  return (
    <div className="chat">
      <header className="chat-header">
        {windowWidth <= 1000 && (
          <button
            onClick={() => {
              setIsSelected((previousState) => {
                return { ...previousState, isSelected: false };
              });
            }}>
            <KeyboardBackspace />
          </button>
        )}
        <div className="chat-info">
          <div className="chat-info__name">{userData?.nickname}</div>
          <div className={`chat-info__state ${chatState === "online" ? "online" : ""}`}>{`${chatState || ""}`}</div>
        </div>
        <div className="chat-controls"></div>
      </header>
      <div className="chat-messages"></div>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="chat-footer">
        <div className="chat-footer__inner">
          <TextareaAutosize
            onKeyDown={(e) => {
              if (e.key === "Enter" && !(e.shiftKey && e.key === "Enter" && e.currentTarget.value)) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
            {...register("message", { required: true })}
            placeholder="Напишите сообщение"
            className="chat__textarea"
          />
          <button disabled={formState.dirtyFields.message ? false : true} className="chat__send-button">
            <Send color={formState.dirtyFields.message ? "secondary" : "disabled"} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
