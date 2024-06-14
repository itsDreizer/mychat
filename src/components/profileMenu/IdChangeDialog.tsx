import { firebaseUpdateProfile, isIdExists } from "@/API/firebase";
import Hint from "@/components/UI/hint/Hint";
import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, TextField, ToggleButton } from "@mui/material";
import { debounce } from "lodash";
import React, { useCallback, useState } from "react";
import { IChangeDialogProps } from "./types";

import InputMask from "react-input-mask";

import { useIMask } from "react-imask";

const IdChangeDialog: React.FC<IChangeDialogProps> = (props) => {
  const { userData, isDialogOpen, setIsDialogOpen } = props;

  const [opts, setOpts] = useState({ mask: "" });

  const { ref } = useIMask(opts);

  const [id, setId] = useState<string>(userData?.id ?? "");
  const [error, setError] = useState<string>("");

  const updateId = useCallback(
    debounce(async (id: string) => {
      id = "@" + id.toLowerCase();
      const result = await isIdExists(id);

      if (result && id !== userData.id) {
        setError("Данный id уже занят.");
        return;
      }

      await firebaseUpdateProfile({ id });
    }, 1000),
    []
  );

  return (
    <Dialog
      classes={{
        root: "id-dialog profile-change-dialog",
        paper: "profile-change-dialog__paper id-dialog__paper",
      }}
      onClose={() => {
        setIsDialogOpen(false);
      }}
      open={isDialogOpen}>
      <DialogTitle className="profile-change-dialog__title">
        Изменить @id
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
        <InputMask
          value={id.replace("@", "").toLowerCase()}
          mask={"****************"}
          maskPlaceholder={null}
          onChange={(e) => {
            if (e.currentTarget.value.length < 5) {
              setError("Кол-во символов должно быть не менее 5!");
              setId(e.currentTarget.value);
              return;
            }
            if (e.currentTarget.value.length > 15) {
              setError("Кол-во символов должно быть не более 15!");
              setId((previousState) => previousState);
              return;
            }
            setId(e.currentTarget.value);
            setError("");
            updateId(e.currentTarget.value);
          }}>
          <TextField
            variant="standard"
            color={error ? "error" : "secondary"}
            label="ID"
            className="profile-change-dialog__input"
            autoComplete="off"
          />
        </InputMask>
      </DialogContent>
      <Hint className="id-dialog__hint">
        <p style={{ marginBottom: "10px" }} className="id-dialog__hint-item">
          @id - уникальный идентефикатор, с помощью которого вас могут найти другие пользователи.
        </p>
        <p className="id-dialog__hint-item">Минимальное кол-во символов - 5 </p>
        <p className="id-dialog__hint-item">Максимальное кол-во символов - 15</p>
      </Hint>
      {error && (
        <DialogContent>
          <div className="error-message id-dialog__error-message">{error}</div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default IdChangeDialog;
