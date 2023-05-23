import { useQuery } from "@tanstack/react-query";
import useUser from "../auth/useUser";
import { QUERY_KEY } from "../constants/query_keys";

const useBoardFetch = () => {
  const { token } = useUser();
  const { data: boards } = useQuery([QUERY_KEY.boards], async () => {
    const response = await fetch("https://127.0.0.1:443/api/get_boards", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  });

  return boards;
};

export default useBoardFetch;
