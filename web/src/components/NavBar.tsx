import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../gql/generated";
import {useRouter} from "next/router"
interface NavBarProps {}
export const Navbar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    // pause: isServer(),
  });
  let body = null;
  if (fetching) {
    // data loading
  } else if (!data?.me) {
    // user logged in
    body = (
      <>
        {/* <NextLink href="/register">
          <Link mr={2}>register</Link>
        </NextLink>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink> */}
        <NextLink href="/register" style={{ marginRight: "8px" }}>
          register
        </NextLink>
        <NextLink href="/login" style={{ marginRight: "8px" }}>
          login
        </NextLink>
      </>
    );
  } else {
    // user is logged in
    body = (
      <Flex align={"center"}>
        <Flex mr={4}>
          <NextLink href={"/create-post"} style={{ marginLeft: "auto" }}>
            <Button>Create Post</Button>
          </NextLink>
        </Flex>
        <Box mr={4}>{data.me.username}</Box>
        <Button
          onClick={async() => {
            await logout({});
            router.reload();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          Log out
        </Button>
      </Flex>
    );
  }
  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
      <Flex flex={1} m="auto" align="center" maxWidth={800}>
        <Heading>
          <NextLink href={"/"}>
            <Box>HOME</Box>
          </NextLink>
        </Heading>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
