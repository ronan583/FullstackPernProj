import React, { InputHTMLAttributes } from "react";
import { FieldHookConfig, useField } from "formik";
import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";

type InputFieldFrops = InputHTMLAttributes<HTMLInputElement> & { name: string };

export const Wrapper: React.FC<InputFieldFrops> = (props) => {
  const [field, {error}]= useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>First name</FormLabel>
      <Input {...field} id={field.name} placeholder="name" />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
