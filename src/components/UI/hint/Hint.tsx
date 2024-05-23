import React from "react";

import { DefaultProps } from "@/types";
import "./Hint.scss";

interface IHintProps extends DefaultProps {}

const Hint: React.FC<IHintProps> = ({ children, className }) => {
  return <div className={`hint-text ${className ? className : ""}`}>{children}</div>;
};

export default Hint;
