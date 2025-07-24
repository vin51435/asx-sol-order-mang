import { ZodError } from 'zod';
import { FormInstance } from 'antd';

function setZodErrorsToForm(zodError: ZodError, form: FormInstance) {
  console.log('zodError', zodError);
  const errorFields = zodError.issues.map((issue) => ({
    name: issue.path.length === 1 ? issue.path[0] : issue.path,
    errors: [issue.message],
  }));

  form.setFields(errorFields);
}

export { setZodErrorsToForm };

