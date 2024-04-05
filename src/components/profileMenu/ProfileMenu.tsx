import { DefaultProps } from "@/types";
import {
  Accordion,
  AccordionSummary,
  Avatar,
  Fade,
  Input,
  Menu,
  MenuItem,
  Modal,
  ModalProps,
  Popover,
  TextField,
  TextareaAutosize,
  ToggleButton,
  Typography,
} from "@mui/material";
import React, { useMemo, useRef, useState, useCallback } from "react";
import "./ProfileMenu.scss";
import { CameraAlt, Close, ExpandMore, Image, Link } from "@mui/icons-material";
import { IUserData } from "@/API/types";
import { debounce } from "lodash";
import { firebaseStorage, firebaseUpdateProfile } from "@/API/firebase";
import LiButton from "../UI/liButton/LiButton";
import CustomMUIPopover from "../UI/customMUIPopover/CustomMUIPopover";

import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { useUploadFile } from "react-firebase-hooks/storage";

interface IProfileMenuProps extends Omit<ModalProps, "children"> {
  handleClose: () => void;
  userData: IUserData | undefined;
}

const ProfileMenu: React.FC<IProfileMenuProps> = (props) => {
  const [uploadFile, uploading, snapshot] = useUploadFile();

  const { open, handleClose, userData, ...otherProps } = props;
  const [bio, setBio] = useState<string>(userData?.BIO ?? "");
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState<boolean>(false);

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
                anchorEl={document.querySelector(".profile-menu__change-photo")}
                onClose={() => {
                  setIsImagePopoverOpen(false);
                }}
                open={isImagePopoverOpen}>
                <ul className="">
                  <li>
                    <label>
                      <input
                        className="hidden-input"
                        onChange={updateAvatar}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                      />
                      <LiButton Icon={<Image />} text="Загрузить фотографию" />
                    </label>
                  </li>
                  <li>
                    <LiButton onClick={() => {}} Icon={<Link />} text="Ввести URL">
                      {/* <TextField autoComplete="off" color="secondary" variant="standard" /> */}
                    </LiButton>
                  </li>
                </ul>
              </CustomMUIPopover>
            </div>
            <div className="profile-menu__nickname">{userData?.nickname}</div>
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
        </div>
      </Fade>
    </Modal>
  );
};

export default ProfileMenu;
