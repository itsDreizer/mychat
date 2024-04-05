import { DefaultProps } from "@/types";
import React from "react";

interface ISearchListProps extends DefaultProps {
  mode: "local" | "global";
}

const SearchList: React.FC<ISearchListProps> = (props) => {
  const { mode, children } = props;
  return (
    <div className="search-body">
      <div className="search-body__mode">{mode === "local" ? "Локальный поиск" : "Глобальный поиск"}</div>
      <ul className="search-body">{children}</ul>
    </div>
  );
};

export default SearchList;
