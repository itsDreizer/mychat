import { firebaseStorage, firebaseUpdateProfile } from "@/API/firebase";
import { IUserData } from "@/API/types";
import {
  CameraAlt,
  Close,
  DriveFileRenameOutline,
  Image as ImageIcon,
  Link as LinkIcon
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  Link,
  Modal,
  ModalProps,
  TextField,
  TextareaAutosize,
  ToggleButton,
} from "@mui/material";
import { debounce } from "lodash";
import React, { useCallback, useState } from "react";
import CustomMUIPopover from "../UI/customMUIPopover/CustomMUIPopover";
import LiButton from "../UI/liButton/LiButton";

import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { useUploadFile } from "react-firebase-hooks/storage";
import IdChangeDialog from "./IdChangeDialog";
import NicknameChangeDialog from "./NicknameChangeDialog";
import "./ProfileMenu.scss";

interface IProfileMenuProps extends Omit<ModalProps, "children"> {
  handleClose: () => void;
  userData: IUserData;
  setIsClipboardSnackbarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileMenu: React.FC<IProfileMenuProps> = (props) => {
  const { open, handleClose, userData, setIsClipboardSnackbarVisible, ...otherProps } = props;

  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState<boolean>(false);
  const [uploadFile] = useUploadFile();

  const [isURLDialogOpen, setIsURLDialogOpen] = useState<boolean>(false);
  const [isURLSubmitError, setIsURLSubmitError] = useState<boolean>(false);
  const [inputURLValue, setInputURLValue] = useState<string>("");

  const [bio, setBio] = useState<string>(userData?.BIO ?? "");

  const [isNicknameDialogOpen, setIsNicknameDialogOpen] = useState<boolean>(false);

  const [isIdDialogOpen, setIsIdDialogOpen] = useState<boolean>(false);

  const updateBio = useCallback(
    debounce((data: string) => {
      firebaseUpdateProfile({ BIO: data });
    }, 1000),
    []
  );

  const updateAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsImagePopoverOpen(false);
    if (e.currentTarget.files) {
      const selectedFile = e.currentTarget.files[0];
      const result = await uploadFile(
        storageRef(firebaseStorage, `${userData?.userId}/${selectedFile.name}`),
        selectedFile
      );
      const url = await getDownloadURL(storageRef(firebaseStorage, result?.ref.fullPath));
      firebaseUpdateProfile({ photoURL: url });
    }
  };

  return (
    <Modal classes={{ root: "profile-menu" }} onClose={handleClose} open={open} {...otherProps}>
      <Fade in={open}>
        <div className="profile-menu__body">
          <header className="profile-menu-header">
            <div className="profile-menu__title">Профиль</div>
            <ToggleButton
              className="profile-menu__close-button"
              onClick={() => {
                handleClose();
              }}
              style={{ width: "40px", height: "40px" }}
              value={""}>
              <Close />
            </ToggleButton>
          </header>
          <div className="profile-menu__user-info">
            <div className="profile-menu__block-img">
              <Avatar src={userData?.photoURL} className="profile-menu__profile-img" />
              <button
                onClick={() => {
                  setIsImagePopoverOpen(true);
                }}
                className="profile-menu__change-photo">
                <CameraAlt />
              </button>
              <CustomMUIPopover
                open={isImagePopoverOpen}
                anchorEl={document.querySelector(".profile-menu__change-photo")}
                onClose={() => {
                  setIsImagePopoverOpen(false);
                }}>
                <ul>
                  <li>
                    <label>
                      <input
                        className="hidden-input"
                        onChange={updateAvatar}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                      />
                      <LiButton Icon={<ImageIcon />} text="Загрузить фотографию" />
                    </label>
                  </li>
                  <li>
                    <LiButton
                      onClick={() => {
                        setIsImagePopoverOpen(false);
                        setIsURLDialogOpen(true);
                      }}
                      Icon={<LinkIcon />}
                      text="Ввести URL"></LiButton>
                  </li>
                </ul>
              </CustomMUIPopover>
            </div>
            <div className="profile-menu__nickname">{userData?.nickname}</div>
            <Link
              onClick={(e) => {
                if (e.currentTarget.textContent) {
                  navigator.clipboard.writeText(e.currentTarget.textContent);
                  setIsClipboardSnackbarVisible(true);
                }
              }}
              color={"secondary"}
              underline="none"
              className="profile-menu__id">
              {userData?.id}
            </Link>
            <div className="profile-menu__bio-wrapper">
              <TextareaAutosize
                onChange={(e) => {
                  setBio(e.currentTarget.value);
                  updateBio(e.currentTarget.value);
                }}
                value={bio}
                placeholder="Bio"
                maxLength={70}
                className="profile-menu__bio"
              />
              <div className="profile-menu__bio-length">{70 - bio.length}</div>
            </div>
          </div>
          <ul className="profile-menu-list">
            <li className="profile-menu-list__item">
              <LiButton
                onClick={() => {
                  setIsNicknameDialogOpen(true);
                }}
                Icon={<DriveFileRenameOutline />}
                className="profile-menu-list__button">
                Изменить ник
              </LiButton>
            </li>
            <li className="profile-menu-list__item">
              <LiButton
                onClick={() => {
                  setIsIdDialogOpen(true);
                }}
                Icon={<DriveFileRenameOutline />}
                className="profile-menu-list__button">
                Изменить @id
              </LiButton>
            </li>
          </ul>
          <Dialog
            classes={{
              root: "url-dialog profile-change-dialog",
              paper: "profile-change-dialog__paper url-dialog__paper",
            }}
            onClose={() => {
              setIsURLDialogOpen(false);
              setInputURLValue("");
              setIsURLSubmitError(false);
            }}
            open={isURLDialogOpen}>
            <DialogTitle className="profile-change-dialog__title">
              Ввести URL
              <ToggleButton
                className="profile-menu__close-button"
                onClick={() => {
                  setIsURLDialogOpen(false);
                  setInputURLValue("");
                  setIsURLSubmitError(false);
                }}
                style={{ width: "40px", height: "40px" }}
                value={""}>
                <Close />
              </ToggleButton>
            </DialogTitle>
            <DialogContent>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const img = new Image();
                  img.onload = async () => {
                    await firebaseUpdateProfile({ photoURL: inputURLValue });
                    setIsURLDialogOpen(false);
                    setInputURLValue("");
                  };
                  img.onerror = () => {
                    setIsURLSubmitError(true);
                  };
                  img.src = inputURLValue;
                }}
                className="url-dialog__form">
                <TextField
                  variant="standard"
                  onFocus={() => {
                    setIsURLSubmitError(false);
                  }}
                  onChange={(e) => setInputURLValue(e.currentTarget.value)}
                  value={inputURLValue}
                  color="secondary"
                  label="URL"
                  className="profile-change-dialog__input"
                  autoComplete="off"
                />
                {isURLSubmitError && <div className="error-message">Невалидный URL!</div>}
                <Button type="submit" variant="outlined" className="url-dialog__button" color="secondary">
                  Отправить
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <NicknameChangeDialog
            userData={userData}
            setIsDialogOpen={setIsNicknameDialogOpen}
            isDialogOpen={isNicknameDialogOpen}
          />
          <IdChangeDialog userData={userData} setIsDialogOpen={setIsIdDialogOpen} isDialogOpen={isIdDialogOpen} />
        </div>
      </Fade>
    </Modal>
  );
};

export default ProfileMenu;
