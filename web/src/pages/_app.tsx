import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import { AppProps } from "next/app";
import { Provider, fetchExchange, createClient, dedupExchange } from "urql";
import { QueryInput, Cache, cacheExchange } from "@urql/exchange-graphcache";
import { LoginMutation, MeDocument, MeQuery } from "../gql/generated";

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

const client = createClient({
  url: "http://localhost:4000/graphql",
  // url: "http://10.24.8.36:4000/graphql",
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutations: {
          login: (result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    fetchExchange,
  ],
  fetchOptions: {
    credentials: "include",
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
