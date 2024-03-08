import { PropsWithChildren } from "react";

export interface DefaultProps extends PropsWithChildren {
  className?: string;
}

export interface IAuthProperties {
  username?: string;
  email: string;
  password: string;
}
