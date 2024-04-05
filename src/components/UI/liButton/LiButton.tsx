import { DefaultProps } from "@/types";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React, { ReactNode } from "react";

import "./LiButton.scss";

interface ILiButtonProps extends DefaultProps {
  text?: string;
  Icon?: ReactNode;
  onClick?: () => void;
}

const LiButton: React.FC<ILiButtonProps> = (props) => {
  const { text, Icon, onClick, className, children } = props;

  const classes = {
    icon: className ? `${className}__icon` : "",
    text: className ? `${className}__text` : "",
  };

  return (
    <ListItemButton onClick={onClick} className={`list-item-button ${className}`}>
      {Icon ? <ListItemIcon className={`list-item-button__icon ${classes.icon}`}>{Icon}</ListItemIcon> : false}
      {text ? <ListItemText primary={text} className={`list-item-button__text ${classes.text}`} /> : false}
      {children}
    </ListItemButton>
  );
};

export default LiButton;
