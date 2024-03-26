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
  const { text, Icon, onClick, className } = props;

  const classes = {
    button: className ? `${className}__button` : "",
    icon: className ? `${className}__icon` : "",
    text: className ? `${className}__text` : "",
  };

  return (
    <ListItem className={`list-item ${className}`}>
      <ListItemButton onClick={onClick} className={`list-item__button ${classes.button}`}>
        <ListItemIcon className={`list-item__icon ${classes.icon}`}>{Icon}</ListItemIcon>
        <ListItemText primary={text} className={`list-item__text ${classes.text}`} />
      </ListItemButton>
    </ListItem>
  );
};

export default LiButton;
