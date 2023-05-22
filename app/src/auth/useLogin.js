import { useQueryClient, useMutation } from "@tanstack/react-query";
import { ResponseError } from "../utils/errors";
import { useNavigate } from "react-router";
import { QUERY_KEY } from "../constants/query_keys";

const login = async (email, password) => {
  const response = await fetch("https://127.0.0.1:443/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let data;
  if (response.status === 400) {
    data = await response.json();
    console.log(data);
    throw new ResponseError("Error signing in", response, data);
  }

  data = await response.json();
  console.log("RESPONSE:", response);
  return data;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: loginMutation } = useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY.user], data);
      navigate("/kanban");
    },
    onError: (error, response) => {
      console.log("Error logging in.", error.customMessage);
    },
  });

  return loginMutation;
};
