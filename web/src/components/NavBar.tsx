import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useMeQuery } from "../gql/generated";
interface NavBarProps {}
export const Navbar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  let body = null;
  console.log(data);
  if (fetching) {
    // data loading
  } else if (!data?.me) {
    // user logged in
    body = (
      <>
        <NextLink href="/register">
          <Link mr={2}>register</Link>
        </NextLink>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
      </>
    );
  } else {
    // user is logged in
    body = (
      <Box>
        <Box>{data.me.username}</Box>;<Button variant="link">Log out</Button>
      </Box>
    );
  }
  return (
    <Flex bg="tomato" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
