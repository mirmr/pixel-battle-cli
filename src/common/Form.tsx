import { Dispatch, ReactElement, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import Input from '../styled/Input';
import Button from '../styled/Button';
import { HTMLInputTypeAttribute } from 'react';

const StyledForm = styled.form({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  padding: '10px',
});

const InputGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
});

const Label = styled.label((props) => ({
  fontSize: props.theme.fontSizes.normal,
}));

const FormButtonsRow = styled.div({
  marginTop: '5px',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
});

type Field = {
  label: string;
  type?: HTMLInputTypeAttribute | undefined;
  initialValue?: string | undefined;
};

const Form = <
  Fields extends { [k: string]: Field },
  FormValues extends { [K in keyof Fields]: string },
>({
  fields,
  secondButton,
  submitButtonText,
  isValid,
  onSubmit,
}: {
  fields: Fields;
  secondButton?: ReactElement | undefined;
  submitButtonText: string;
  isValid?: (fields: FormValues) => boolean;
  onSubmit: (
    fields: FormValues,
    setFields: Dispatch<SetStateAction<FormValues>>,
  ) => void;
}): ReactElement => {
  const [formValues, setFormValues] = useState(
    Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [
        key,
        value.initialValue ?? '',
      ]),
    ) as FormValues,
  );

  return (
    <StyledForm
      onSubmit={(e) => {
        e.preventDefault();
        if (!isValid || isValid(formValues)) {
          onSubmit(formValues, setFormValues);
        }
      }}
    >
      {Object.entries(fields).map(([key, field]) => (
        <InputGroup key={key}>
          <Label>{field.label}</Label>
          <Input
            value={formValues[key as keyof typeof fields]}
            type={field.type}
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                [key]: e.target.value,
              }))
            }
          />
        </InputGroup>
      ))}
      <FormButtonsRow>
        {secondButton}
        <Button disabled={isValid ? !isValid(formValues) : false}>
          {submitButtonText}
        </Button>
      </FormButtonsRow>
    </StyledForm>
  );
};

export default Form;
