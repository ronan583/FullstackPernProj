import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (!options.email.includes("@")) {
    return {
      errors: [{ field: "email", message: "must be a valid email" }],
    };
  }
  if (options.username.length <= 2) {
    return {
      errors: [{ field: "username", message: "length must be greater than 2" }],
    };
  }
  if (options.username.includes("@")) {
    return {
      errors: [{ field: "username", message: "cannot include @" }],
    };
  }
  if (options.password.length <= 3) {
    return {
      errors: [{ field: "password", message: "length must be greater than 3" }],
    };
  }
  return null;
};
