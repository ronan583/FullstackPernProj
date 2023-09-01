import { FieldError } from '../gql/generated';
export const toErrorMap = (errors: FieldError[]) => {
  const errorMap: Record<string, string> = {}
  errors.forEach(({field, message}) => {
    errorMap[field] = message;
  })
}