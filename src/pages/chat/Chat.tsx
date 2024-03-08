import { auth } from "@/API/firebase";
import { Button } from "@mui/material";
import { signOut } from "firebase/auth";
import React, { useEffect } from "react";

const Chat: React.FC = () => {
  useEffect(() => {
    document.title = "Мессенджер";
  }, []);
  return (
    <div className="chat-page">
      <div className="chat-page__container">
        CHAT
        <Button
          onClick={() => {
            signOut(auth);
          }}
          style={{ position: "absolute", top: "0", right: "0" }}>
          ЛОГАУТ
        </Button>
      </div>
    </div>
  );
};

export default Chat;
