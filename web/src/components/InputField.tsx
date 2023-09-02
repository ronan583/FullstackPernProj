import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";

type InputFieldFrops = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  // placeholder: string
};

export const InputField: React.FC<InputFieldFrops> = ({label, size:_, ...props}) => {
  const [field, { error }] = useField(props);
  // const obj = useField(props);
  // console.log(obj);  

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} id={field.name} placeholder={props.placeholder} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
