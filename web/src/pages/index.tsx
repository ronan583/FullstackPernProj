import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import {
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery,
} from "../gql/generated";
import { Layout } from "../components/Layout";
import Link from "next/link";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { UpdootSection } from "../components/UpdootSection";
import { IconButton } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as string | null,
  });
  const [{ data: meData }] = useMeQuery();
  const [{ data, fetching }] = usePostsQuery({ variables });
  const [, deletePost] = useDeletePostMutation();
  console.log(variables,fetching,data);
  
  if (!fetching && !data) {
    return <div>there is no data</div>;
  }
  return (
    <Layout>
      {!data && fetching ? (
        <div>loading......</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={p} />
                <Box flex={1}>
                  <Link href={"/post/[id]"} as={`/post/${p.id}`}>
                    <Heading fontSize="xl">{p.title}</Heading>
                  </Link>
                  <Text fontSize="xs" color="grey" mt={1}>Posted by {p.creator.username}</Text>
                  <Flex align="center">
                    <Text flex={1} mt={4}>
                      {p.textSnippet}
                    </Text>
                    {meData?.me?.id !== p.creator.id ? null : (
                      <Box ml="auto">
                        <Link href="/post/edit/[id]" as={`/post/edit/${p.id}`}>
                          <IconButton
                            mr={4}
                            aria-label={"edit post"}
                            icon={<EditIcon />}
                            onClick={() => {
                            }}
                          ></IconButton>
                        </Link>
                        <IconButton
                          aria-label={"delete post"}
                          icon={<DeleteIcon />}
                          onClick={() => {
                            deletePost({ id: p.id });
                          }}
                        ></IconButton>
                      </Box>
                    )}
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            isLoading={fetching}
            m="auto"
            my={6}
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Index);
