import React from "react";

import { Modal } from "@mui/material";

import "./AvatarSlider.scss";
interface IAvatarSliderProps {
  open: boolean;
}

const AvatarSlider: React.FC<IAvatarSliderProps> = (props) => {
  const { open } = props;
  return (
    <Modal open={open}>
      <div></div>
    </Modal>
  );
};

export default AvatarSlider;
