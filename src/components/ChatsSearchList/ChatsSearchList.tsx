import { DefaultProps } from "@/types";
import React from "react";
import "./ChatSearchList.scss";

interface ISearchListProps extends DefaultProps {
  mode: "local" | "global";
}

const ChatsSearchList: React.FC<ISearchListProps> = (props) => {
  const { mode, children } = props;
  return (
    <div className="chats-search">
      <div className="chats-search__mode">{mode === "local" ? "Локальный поиск" : "Глобальный поиск"}</div>
      <ul className="chats-search-body">{children}</ul>
    </div>
  );
};

export default ChatsSearchList;
