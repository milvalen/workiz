import * as model from './model';
import React from 'react';
import {
  DateFieldAdapter,
  SelectFieldAdapter,
  TextFieldAdapter,
} from '../shared/form-adapters.tsx';
import { useUnit } from 'effector-react';
import { Button } from '../shared/button.tsx';
import { areaOptions, technicianOptions } from './lib.ts';
import 'react-datepicker/dist/react-datepicker.css';
import AppExtensionsSDK from '@pipedrive/app-extensions-sdk';

export const AddJob = () => {
  model.open();

  const isLoading = useUnit(model.$isLoading);
  const isDone = useUnit(model.$isDone);

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    model.form.submit();
  }

  new AppExtensionsSDK().initialize();

  return !isLoading && !isDone ? (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid md:grid-cols-2 gap-4">
        <FormBlock label="Client details">
          <div className="flex justify-center gap-2">
            <TextFieldAdapter
              field={model.form.fields.firstName}
              placeholder="First Name"
              className="!min-w-20"
            />
            <TextFieldAdapter
              field={model.form.fields.lastName}
              placeholder="Last Name"
              className="!min-w-20"
            />
          </div>
          <TextFieldAdapter
            field={model.form.fields.phone}
            placeholder="Phone"
          />
          <TextFieldAdapter
            field={model.form.fields.email}
            placeholder="Email (optional)"
            type="email"
          />
        </FormBlock>
        <FormBlock label="Job details">
          <div className="flex justify-center gap-2">
            <TextFieldAdapter
              field={model.form.fields.jobType}
              placeholder="Job type"
              className="!min-w-20"
            />
            <TextFieldAdapter
              field={model.form.fields.jobSource}
              placeholder="Job source"
              className="!min-w-20"
            />
          </div>
          <textarea
            className="w-full rounded outline-none border border-gray-300 p-3 h-[102px]"
            placeholder="Job describtion (optional)"
            onChange={(e) =>
              model.form.fields.jobDescription.onChange(e.currentTarget.value)
            }
          />
        </FormBlock>
        <FormBlock label="Service location">
          <TextFieldAdapter
            field={model.form.fields.address}
            placeholder="Address"
          />
          <TextFieldAdapter field={model.form.fields.city} placeholder="City" />
          <TextFieldAdapter
            field={model.form.fields.state}
            placeholder="State"
          />
          <div className="flex justify-center gap-2">
            <TextFieldAdapter
              field={model.form.fields.zipCode}
              placeholder="Zip code"
              className="!min-w-20"
            />
            <SelectFieldAdapter
              field={model.form.fields.area}
              className="!min-w-20"
              defaultOptionValue=""
              options={areaOptions}
            />
          </div>
        </FormBlock>
        <FormBlock label="Scheluded">
          <DateFieldAdapter
            field={model.form.fields.startDate}
            placeholder="Start date"
          />
          <div className="flex justify-center gap-2">
            <DateFieldAdapter
              field={model.form.fields.startTime}
              placeholder="Start time"
              time
            />
            <DateFieldAdapter
              field={model.form.fields.endTime}
              placeholder="End time"
              time
            />
          </div>
          <SelectFieldAdapter
            field={model.form.fields.technician}
            options={technicianOptions}
            defaultOptionValue=""
          />
        </FormBlock>
      </div>
      <div className="flex justify-center gap-2">
        <Button className="bg-yellow-200" type="submit">
          Create job
        </Button>
        <Button onClick={() => model.save()} className="bg-gray-200">
          Save info
        </Button>
      </div>
    </form>
  ) : (
    <p className="text-2xl">{isDone ? 'Job created!' : 'Loading...'}</p>
  );
};

interface Props {
  label: string;
  children: React.ReactNode;
}

const FormBlock = ({ label, children }: Props) => {
  return (
    <div className="p-5 shadow-xl bg-white rounded flex flex-col gap-5 min-w-80">
      <h1 className="font-semibold text-xl text-gray-500">{label}</h1>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
};
