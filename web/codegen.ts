
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  // schema: "http://localhost:4000/graphql",
  schema: "http://10.24.8.49:4000/graphql",
  documents: "src/**/*.graphql",
  generates: {
    "src/gql/generated.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-urql"]
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
