import { Field, useField } from 'effector-forms';
import React, { InputHTMLAttributes, useState } from 'react';
import clsx from 'clsx';
import DatePicker from 'react-datepicker';
import TimeIcon from '../assets/icons/time.svg?react';
import * as model from '../jobs/model.ts';

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

export type SelectFieldOption = {
  value: string;
  label: string;
};

export const TextFieldAdapter = ({
  field,
  className,
  ...props
}: FormAdapterProps<string>) => {
  const { value, onChange, hasError } = useField(field);

  return (
    <input
      className={clsx(
        'w-full rounded outline-none border border-gray-300 py-3 indent-3',
        className,
        { '!border-red-300 !border-2': hasError() }
      )}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      {...props}
    />
  );
};

export const SelectFieldAdapter = ({
  field,
  defaultOptionValue,
  options,
  className,
}: {
  options: SelectFieldOption[];
  defaultOptionValue: string;
  field: Field<any>;
  className?: string;
}) => {
  const { value, onChange, hasError } = useField(field);

  return (
    <select
      value={value ?? defaultOptionValue}
      onChange={(ev) => onChange(ev.currentTarget.value)}
      className={clsx(
        'w-full rounded outline-none border border-gray-300 py-3 indent-3',
        className,
        { '!border-red-300 !border-2': hasError() }
      )}
    >
      {options.map(({ value, label }, i) => (
        <option key={value + i} value={value} className="">
          {label}
        </option>
      ))}
    </select>
  );
};

export const DateFieldAdapter = ({
  field,
  time = false,
  placeholder,
}: {
  field: Field<any>;
  placeholder: string;
  className?: string;
  time?: boolean;
}) => {
  const { value, onChange, hasError } = useField(field);

  const [date, setDate] = useState<Date | null>(
    value ? new Date(time ? '1970-01-01T' + value : value + 'T00:00:00') : null
  );

  const timeFormat = 'HH:mm';
  const locale = 'sv-SE';

  return (
    <DatePicker
      className={clsx(
        'w-full rounded outline-none border border-gray-300 !py-3 !indent-3',
        {
          '!border-red-300 !border-2': hasError(),
        },
        {
          '!min-w-20': time,
        }
      )}
      selected={date}
      showIcon
      icon={time && <TimeIcon />}
      calendarIconClassName="mt-1.5 pointer-events-none"
      timeFormat={timeFormat}
      dateFormat={time ? timeFormat : 'dd/MM/yyyy'}
      showTimeSelect={time}
      showTimeSelectOnly={time}
      onChange={(date) => {
        setDate(date);
        onChange(
          date
            ? time
              ? date.toLocaleTimeString(locale)
              : date.toLocaleDateString(locale)
            : ''
        );
      }}
      placeholderText={placeholder}
    />
  );
};

export const TextareaAdapter = ({
  field,
  placeholder,
}: {
  field: Field<any>;
  placeholder: string;
}) => {
  const { value, onChange } = useField(field);

  return (
    <textarea
      className="w-full rounded outline-none border border-gray-300 p-3 h-[102px]"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
};
