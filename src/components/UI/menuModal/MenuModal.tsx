import { Drawer, DrawerClasses, DrawerProps } from "@mui/material";
import React from "react";
import "./MenuModal.scss";

interface IMenuModalProps extends DrawerProps {}

const MenuModal: React.FC<IMenuModalProps> = (props) => {
  const { children, classes, ...otherProps } = props;

  const resultClasses: Partial<DrawerClasses> = {
    root: `menu-modal ${classes?.root}`,
    paper: `menu-modal__background ${classes?.paper}`,
  };

  return (
    <Drawer classes={resultClasses} {...otherProps}>
      {children}
    </Drawer>
  );
};

export default MenuModal;
