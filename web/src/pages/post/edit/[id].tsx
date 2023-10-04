import { withUrqlClient } from "next-urql";
import React from "react";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { useGetPostFromUrl } from "../../../utils/useGetPostFromUrl";
import { useUpdatePostMutation } from "../../../gql/generated";
import { useGetIntId } from "../../../utils/useGetIntId";
import { useRouter } from "next/router";

const EditPost = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();
  const [{ data, error, fetching }] = useGetPostFromUrl();
  const [, updatePost] = useUpdatePostMutation();
  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }
  if (!data?.post) {
    return (
      <Layout>
        <Box> could not find post</Box>
      </Layout>
    );
  }
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          await updatePost({ id: intId, ...values });
          router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Text"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Update Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
