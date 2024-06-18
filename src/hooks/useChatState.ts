import { IUserData } from "@/API/types";
import { useEffect, useMemo, useState } from "react";
import { DateTime, Interval, DurationLikeObject } from "luxon";
import { Timestamp } from "firebase/firestore";
import { unitFormatter } from "@/utils/utils";

export const useChatState = (userData?: IUserData, myUserData?: IUserData) => {
  const [chatState, setChatState] = useState<string>("был(а) в сети никогда");

  useEffect(() => {
    if (userData?.online) {
      (() => {
        const lastSeen = DateTime.fromJSDate((userData?.online as Timestamp).toDate());
        const dateNow = DateTime.now();

        const interval = (unit: keyof DurationLikeObject) => {
          return Math.floor(Interval.fromDateTimes(lastSeen, dateNow).length(unit));
        };

        if (interval("days") && interval("days") < 2) {
          setChatState(`был(а) в сети вчера в ${unitFormatter(lastSeen.hour)}:${unitFormatter(lastSeen.minute)}`);
          return;
        }
        if (interval("days")) {
          setChatState(
            `был(а) в сети ${unitFormatter(lastSeen.day)}.${unitFormatter(lastSeen.month)}.${
              lastSeen.year
            } ${unitFormatter(lastSeen.hour)}:${unitFormatter(lastSeen.minute)}`
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
    } else {
      setChatState("был(а) в сети никогда");
    }
  }, [userData, myUserData]);

  return { chatState };
};
