import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../gql/generated";
interface NavBarProps {}
export const Navbar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();
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
      <Box>
        <Box>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout({});
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          Log out
        </Button>
      </Box>
    );
  }
  return (
    <Flex zIndex={1} position='sticky' top={0} bg="tan" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
