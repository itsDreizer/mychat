import { PropsWithChildren } from "react";

export interface DefaultProps extends PropsWithChildren {
  className?: string;
}

export interface IAuthProperties {
  nickname?: string;
  email: string;
  password: string;
}

export type TMessageDeliveryState = "Отправлено" | "Прочитано" | "Загрузка";
