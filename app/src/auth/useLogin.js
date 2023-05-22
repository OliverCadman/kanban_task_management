import { useQueryClient, useMutation } from "@tanstack/react-query";
import { ResponseError } from "../utils/errors";
import { useNavigate } from "react-router";

const login = async (email, password) => {
  const response = await fetch("http://127.0.0.1:8000/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
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
  return data;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: loginMutation } = useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: () => {
      console.log("success?");
      navigate("/kanban");
    },
    onError: (error, response) => {
      console.log("Error logging in.", error.customMessage);
    },
  });

  return loginMutation;
};
