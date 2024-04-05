import React from "react";

import { Popover, PopoverProps } from "@mui/material";
import "./CustomMUIPopover.scss";

interface ICustomMUIPopoverProps extends PopoverProps {}

const CustomMUIPopover: React.FC<ICustomMUIPopoverProps> = (props) => {
  const { children, classes, ...otherProps } = props;
  const resultClasses = {
    root: `popover ${classes?.root}`,
    paper: `popover__paper ${classes?.paper}`,
  };
  return (
    <Popover classes={resultClasses} {...otherProps}>
      {children}
    </Popover>
  );
};

export default CustomMUIPopover;
