import { useRouter } from "next/router";
import { usePostQuery } from "../gql/generated";

export const useGetPostFromUrl = () => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
    console.log(usePostQuery({pause: intId === -1,
      variables: {
        id: intId,
      },}));
    
  return usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
};
