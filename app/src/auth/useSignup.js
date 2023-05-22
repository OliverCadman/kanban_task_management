import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { ResponseError } from "../utils/errors";
import { QUERY_KEY } from "../constants/query_keys";

const signUp = async (username, email, password) => {
  const response = await fetch("https://127.0.0.1:443/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    credentials: "include",
    body: JSON.stringify({ username, email, password }),
  });

  let data;

  if (response.status === 400) {
    data = await response.json();
    throw new ResponseError("Hello", response, data);
  } else if (response.status === 404) {
    throw new ResponseError("Page not found...", response);
  } else if (response.status === 500) {
    throw new ResponseError("Sorry, there has been a server error.", response);
  }

  data = await response.json();

  return data;
};

export const useSignUp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: registerMutation } = useMutation({
    mutationFn: ({ username, email, password }) =>
      signUp(username, email, password),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY.user], data);
      navigate("kanban");
    },
    onError: (error, response) => {
      console.log("hELLO..", error.customMessage);
    },
  });

  return registerMutation;
};
