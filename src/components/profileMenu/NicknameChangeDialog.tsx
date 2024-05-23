import React, { useCallback, useState } from "react";
import { firebaseUpdateProfile } from "@/API/firebase";
import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, TextField, ToggleButton } from "@mui/material";
import { debounce } from "lodash";
import { IChangeDialogProps } from "./types";

const NicknameChangeDialog: React.FC<IChangeDialogProps> = (props) => {
  const { userData, isDialogOpen, setIsDialogOpen } = props;

  const [nickname, setNickname] = useState<string>(userData?.nickname ?? "");

  const updateNickname = useCallback(
    debounce((data: string) => {
      if (data.length < 1) {
        return;
      }
      firebaseUpdateProfile({ nickname: data });
    }, 1000),
    []
  );

  return (
    <Dialog
      classes={{
        root: "nickname-dialog profile-change-dialog",
        paper: "profile-change-dialog__paper nickname-dialog__paper",
      }}
      onClose={() => {
        setIsDialogOpen(false);
      }}
      open={isDialogOpen}>
      <DialogTitle className="profile-change-dialog__title">
        Изменить ник
        <ToggleButton
          className="profile-menu__close-button"
          onClick={() => {
            setIsDialogOpen(false);
          }}
          style={{ width: "40px", height: "40px" }}
          value={""}>
          <Close />
        </ToggleButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          variant="standard"
          onChange={(e) => {
            setNickname(e.currentTarget.value);
            updateNickname(e.currentTarget.value);
          }}
          value={nickname}
          color={nickname.length > 0 ? "secondary" : "error"}
          label="Ник"
          className="profile-change-dialog__input"
          autoComplete="off"
        />
      </DialogContent>
    </Dialog>
  );
};

export default NicknameChangeDialog;
