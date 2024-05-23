import { IUserData } from "@/API/types";

export interface IChangeDialogProps {
  userData: IUserData;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
