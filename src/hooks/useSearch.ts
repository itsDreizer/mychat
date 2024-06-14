import { IUserData } from "@/API/types";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, doc, query, where } from "firebase/firestore";
import { firestore } from "@/API/firebase";
import { useCallback, useState } from "react";

export const useSearch = () => {
  const [localSearchQuery, setLocalSearchQuery] = useState<string>("");
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>("");

  const [searchedUser, searchedUserLoading] = useCollectionData<IUserData>(
    query(collection(firestore, "users"), where("id", "==", `${globalSearchQuery}`))
  );

  

  return { localSearchQuery, setLocalSearchQuery, globalSearchQuery, setGlobalSearchQuery, searchedUser, searchedUserLoading };
};
