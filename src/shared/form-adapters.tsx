import { Field, useField } from 'effector-forms';
import { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  isInvalid?: boolean;
  isDisabled?: boolean;
  multiple?: boolean;
  className?: string;
  placeholder?: string;
};

export type FormAdapterProps<T> = {
  field: Field<T>;
} & Omit<InputProps, 'isInvalid'>;

export const TextFieldAdapter = ({
  field,
  ...props
}: FormAdapterProps<string>) => {
  const { value, onChange } = useField(field);

  return (
    <input
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      {...props}
    />
  );
};
