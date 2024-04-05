import React, { useEffect, useState } from "react";

import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Drawer,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  TextField,
  ToggleButton,
} from "@mui/material";

import { AccountBox, Close, ExitToApp, FormatAlignLeft, HelpCenter, Info, Menu } from "@mui/icons-material";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth, firebaseUpdateProfile, firestore } from "@/API/firebase";
import { useAppDispatch } from "@/redux/hooks";
import { setIsAuthLoading } from "@/redux/reducers/AuthSlice";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { IUserData } from "@/API/types";
import { DefaultProps } from "@/types";
import MenuModal from "@/components/UI/menuModal/MenuModal";
import LiButton from "@/components/UI/liButton/LiButton";
import CustomMUISnackbar from "@/components/UI/customMUISnackbar/CustomMUISnackbar";
import ProfileMenu from "@/components/profileMenu/ProfileMenu";

interface IMessengerControllsProps {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  userData: IUserData | undefined;
}

const MessengerControlls: React.FC<IMessengerControllsProps> = (props) => {
  const { setSearchQuery, userData } = props;
  const [signOut, signOutLoading, signOutError] = useSignOut(auth);
  const [user, userLoading, userError] = useAuthState(auth);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [isSignOutDialogVisible, setIsSignOutDialogVisible] = useState<boolean>(false);
  const [isClipboardSnackbarVisible, setIsClipboardSnackbarVisible] = useState<boolean>(false);
  const [isProfileMenuVisible, setIsProfileMenuVisible] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setIsAuthLoading(signOutLoading));
  }, [signOutLoading]);

  return (
    <div className="controlls">
      <ToggleButton onClick={() => setIsMenuVisible(true)} style={{ width: "40px", height: "40px" }} value={""}>
        <Menu />
      </ToggleButton>
      <MenuModal classes={{ root: "123" }} onClose={() => setIsMenuVisible(false)} open={isMenuVisible}>
        <header className="controlls-menu__header">
          <Avatar className="controlls-menu__profile-img" src={userData?.photoURL} />
          <div className="controlls-menu__profile-nickname">{userData?.nickname}</div>
          <Link
            onClick={(e) => {
              if (e.currentTarget.textContent) {
                navigator.clipboard.writeText(e.currentTarget.textContent);
                setIsClipboardSnackbarVisible(true);
              }
            }}
            color={"secondary"}
            underline="none"
            className="controlls-menu__profile-id">
            {userData?.id}
          </Link>
          <ToggleButton
            className="controlls-menu__close-button"
            onClick={() => setIsMenuVisible(false)}
            style={{ width: "40px", height: "40px" }}
            value={""}>
            <Close />
          </ToggleButton>
        </header>
        <List className="controlls-list">
          <li className="controlls-list-item">
            <LiButton
              onClick={() => {
                setIsMenuVisible(false);
                setIsProfileMenuVisible(true);
              }}
              Icon={<AccountBox />}
              text="Мой профиль"
            />
          </li>
          <li className="controlls-list-item">
            <LiButton Icon={<HelpCenter />} text="О проекте" />
          </li>
          <li className="controlls-list-item">
            <LiButton
              onClick={() => {
                setIsSignOutDialogVisible(true);
              }}
              Icon={<ExitToApp />}
              text="Выйти из аккаунта"
            />
          </li>
        </List>
        <Dialog
          classes={{ root: "signout-dialog", paper: "signout-dialog__background" }}
          open={isSignOutDialogVisible}
          onClose={() => setIsSignOutDialogVisible(false)}>
          <DialogTitle id="alert-dialog-title">Вы уверены что хотите выйти?</DialogTitle>
          <DialogActions>
            <Button
              color={"secondary"}
              onClick={() => {
                setIsSignOutDialogVisible(false);
              }}>
              Нет
            </Button>
            <Button
              color={"secondary"}
              onClick={async () => {
                const succes = await signOut();
                if (succes) {
                  dispatch(setIsAuthLoading(false));
                }
              }}>
              Да
            </Button>
          </DialogActions>
        </Dialog>
      </MenuModal>
      <ProfileMenu
        userData={userData}
        open={isProfileMenuVisible}
        handleClose={() => {
          setIsProfileMenuVisible(false);
        }}
      />
      <CustomMUISnackbar
        onClose={(e, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setIsClipboardSnackbarVisible(false);
        }}
        open={isClipboardSnackbarVisible}
        message={"Скопировано в буфер обмена!"}
        autoHideDuration={3000}
      />
      <TextField
        autoComplete="off"
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
        placeholder="Поиск"
        size="small"
        className="controlls__search"
      />
    </div>
  );
};

export default MessengerControlls;
