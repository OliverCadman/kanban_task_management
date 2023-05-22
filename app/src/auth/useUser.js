import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import * as localStorage from "./user.localstore";
import { QUERY_KEY } from "../constants/query_keys";

const useUser = () => {
  const { data: user } = useQuery(
    [QUERY_KEY.user],
    () => localStorage.setUserToken(user.token),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      initialData: {
        token: localStorage.getUserToken(),
      },
      onError: () => {
        localStorage.removeUserToken();
      },
    }
  );

  useEffect(() => {
    if (!user) localStorage.removeUserToken();
    else localStorage.setUserToken(user);
  }, [user]);

  return user ?? null;
};

export default useUser;
