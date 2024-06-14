import { IUserData } from "@/API/types";
import { useEffect, useState } from "react";
import { DateTime, Interval, DurationLikeObject } from "luxon";
import { Timestamp } from "firebase/firestore";

export const useChatState = (userData?: IUserData, myUserData?: IUserData) => {
  const [chatState, setChatState] = useState<string>();

  useEffect(() => {
    if (userData) {
      (() => {
        const lastSeen = DateTime.fromJSDate((userData?.online as Timestamp).toDate());
        const dateNow = DateTime.now();

        const interval = (unit: keyof DurationLikeObject) => {
          return Math.floor(Interval.fromDateTimes(lastSeen, dateNow).length(unit));
        };
        if (interval("days") && interval("days") < 2) {
          setChatState(
            `был(а) в сети вчера в ${lastSeen.hour < 10 ? "0" + lastSeen.hour : lastSeen.hour}:${lastSeen.minute}`
          );
          return;
        }
        if (interval("days")) {
          setChatState(
            `был(а) в сети ${lastSeen.day}.${lastSeen.month < 10 ? "0" + lastSeen.month : lastSeen.month}.${
              lastSeen.year
            } ${lastSeen.hour < 10 ? "0" + lastSeen.hour : lastSeen.hour}:${lastSeen.minute}`
          );
          return;
        }
        if (interval("hours")) {
          setChatState(`был(а) в сети ${interval("hours")} часов назад`);
          return;
        }
        if (interval("minutes")) {
          setChatState(`был(а) в сети ${interval("minutes")} минут назад`);
          return;
        } else {
          setChatState(`online`);
        }
      })();
    }
  }, [userData, myUserData]);
  return { chatState };
};
