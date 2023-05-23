import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "../auth/useUser";

const postBoardData = async ({ boardName, columns }) => {
  const { token } = useUser();

  const response = await fetch("https://127.0.0.1:443/api/create_board", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // TODO: Handle 400/404/500 errors

  const data = await response.json();
  console.log(data);
  return data;
};

const useBoardPost = () => {
  const { mutation: boardPost } = useMutation({
    mutationFn: ({ name, columns }) => postBoardData(name, columns),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return boardPost;
};

export default useBoardPost;
