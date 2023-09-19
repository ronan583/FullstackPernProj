import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useField } from "formik";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  TextareaProps,
} from "@chakra-ui/react";

type BaseInputFieldProps = {
  name: string;
  label: string;
  textarea?: boolean;
};

type TextInputProps = InputHTMLAttributes<HTMLInputElement> &
  BaseInputFieldProps;
type TextAreaProps = TextareaHTMLAttributes<HTMLInputElement> &
  BaseInputFieldProps;

export const InputField: React.FC<TextInputProps & TextAreaProps> = ({
  label,
  textarea,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      {textarea ? (
        <Textarea {...(field as any)} {...(props as any)} />
      ) : (
        <Input {...field} {...props} id={field.name} />
      )}
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
