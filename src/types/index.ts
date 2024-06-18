import { PropsWithChildren } from "react";

export interface DefaultProps extends PropsWithChildren {
  className?: string;
}

export interface IAuthProperties {
  nickname?: string;
  email: string;
  password: string;
}

export interface ISelectedChat {
  userId: string;
  isSelected: boolean;
}

export type TMessageDeliveryState = "Отправлено" | "Прочитано" | "Загрузка";
