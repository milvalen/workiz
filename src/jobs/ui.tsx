import { useGate } from 'effector-react';
import * as model from './model';
import React from 'react';
import { TextFieldAdapter } from '../shared/form-adapters.tsx';

// TODO: apply styles
export const AddJob = () => {
  useGate(model.gate);

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormBlock label="Client details">
        <div className="flex justify-center gap-2">
          <TextFieldAdapter
            field={model.form.fields.firstName}
            placeholder="First Name"
          />
          <TextFieldAdapter
            field={model.form.fields.lastName}
            placeholder="Last Name"
          />
        </div>
      </FormBlock>
    </div>
  );
};

interface Props {
  label: string;
  children: React.ReactNode;
}

const FormBlock = ({ label, children }: Props) => {
  return (
    <div className="p-5 bg-gray-500 rounded flex flex-col gap-5 w-80">
      <h1>{label}</h1>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
};
