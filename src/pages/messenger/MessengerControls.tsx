import React, { memo, useCallback, useEffect, useState } from "react";

import { Avatar, Button, Dialog, DialogActions, DialogTitle, Link, List, TextField, ToggleButton } from "@mui/material";

import { auth } from "@/API/firebase";
import { IUserData } from "@/API/types";
import CustomMUISnackbar from "@/components/UI/customMUISnackbar/CustomMUISnackbar";
import LiButton from "@/components/UI/liButton/LiButton";
import MenuModal from "@/components/UI/menuModal/MenuModal";
import ProfileMenu from "@/components/profileMenu/ProfileMenu";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setIsAuthLoading } from "@/redux/reducers/AuthSlice";
import { AccountBox, Close, ExitToApp, HelpCenter, Menu } from "@mui/icons-material";
import { useSignOut } from "react-firebase-hooks/auth";
import { debounce } from "lodash";
import { setIsClipboardSnackbarVisible } from "@/redux/reducers/SnackbarSlice";

interface IMessengerControlsProps {
  setLocalSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setGlobalSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  userData: IUserData;
}

const MessengerControls: React.FC<IMessengerControlsProps> = memo((props) => {
  const { setLocalSearchQuery, setGlobalSearchQuery, userData } = props;
  const [signOut, signOutLoading] = useSignOut(auth);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [isSignOutDialogVisible, setIsSignOutDialogVisible] = useState<boolean>(false);
  const [isProfileMenuVisible, setIsProfileMenuVisible] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setIsAuthLoading(signOutLoading));
  }, [signOutLoading]);

  const debouncedSetGlobalSearchQuery = useCallback(debounce(setGlobalSearchQuery, 1000), []);

  const handleProfileClose = useCallback(() => {
    setIsProfileMenuVisible(false);
  }, [setIsProfileMenuVisible]);

  return (
    <div className="controls">
      <ToggleButton onClick={() => setIsMenuVisible(true)} style={{ width: "40px", height: "40px" }} value={""}>
        <Menu />
      </ToggleButton>
      <MenuModal onClose={() => setIsMenuVisible(false)} open={isMenuVisible}>
        <header className="controls-menu__header">
          <Avatar className="controls-menu__profile-img" src={userData?.photoURL} />
          <div className="controls-menu__profile-nickname">{userData?.nickname}</div>
          <Link
            onClick={(e) => {
              if (e.currentTarget.textContent) {
                navigator.clipboard.writeText(e.currentTarget.textContent);
                dispatch(setIsClipboardSnackbarVisible(true));
              }
            }}
            color={"secondary"}
            underline="none"
            className="controls-menu__profile-id">
            {userData?.id}
          </Link>
          <ToggleButton
            className="controls-menu__close-button"
            onClick={() => setIsMenuVisible(false)}
            style={{ width: "40px", height: "40px" }}
            value={""}>
            <Close />
          </ToggleButton>
        </header>
        <List className="controls-list">
          <li className="controls-list-item">
            <LiButton
              onClick={() => {
                setIsMenuVisible(false);
                setIsProfileMenuVisible(true);
              }}
              Icon={<AccountBox />}
              text="Мой профиль"
            />
          </li>
          <li className="controls-list-item">
            <LiButton Icon={<HelpCenter />} text="О проекте" />
          </li>
          <li className="controls-list-item">
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
                const success = await signOut();
                if (success) {
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
        handleClose={handleProfileClose}
      />

      <TextField
        autoComplete="off"
        onChange={(e) => {
          const value = e.currentTarget.value.toLowerCase();
          if (value[0] === "@" || !value) {
            debouncedSetGlobalSearchQuery(value);
          } else {
            setLocalSearchQuery(value);
          }
          if (!value) {
            setLocalSearchQuery("");
            setGlobalSearchQuery("");
          }
        }}
        placeholder="Поиск"
        size="small"
        className="controls__search"
      />
    </div>
  );
});

export default MessengerControls;
