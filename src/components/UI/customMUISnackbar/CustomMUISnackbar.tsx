import { Snackbar, SnackbarProps } from "@mui/material";
import React from "react";

import "./CustomMUISnackbar.scss";

const CustomMUISnackbar: React.FC<SnackbarProps> = (props) => {
  return <Snackbar {...props} className="snackbar" />;
};

export default CustomMUISnackbar;
