import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { dealFieldsService } from '../services/DealFieldsServise.ts';
import { jobFields } from '../types/jobs.ts';
import { createForm } from 'effector-forms';
import { dealsService } from '../services/DealsService.ts';
import { createRule } from '../services/utils.ts';
import { z } from 'zod';
import { persist } from 'effector-storage/local';

export const form = createForm({
  fields: {
    firstName: {
      init: '',
      rules: [
        createRule({
          name: 'firstName',
          schema: z.string().min(1),
        }),
      ],
    },
    lastName: {
      init: '',
      rules: [
        createRule({
          name: 'lastName',
          schema: z.string().min(1),
        }),
      ],
    },
    phone: {
      init: '',
      rules: [
        createRule({
          name: 'phone',
          schema: z
            .string()
            .min(1)
            .regex(
              /^([+]?[\\s0-9]+)?(\\d{3}|[(]?[0-9]+[)])?([-]?[\\s]?[0-9])+$/
            ),
        }),
      ],
    },
    email: {
      init: '',
    },
    address: {
      init: '',
      rules: [
        createRule({
          name: 'address',
          schema: z.string().min(1),
        }),
      ],
    },
    city: {
      init: '',
      rules: [
        createRule({
          name: 'city',
          schema: z.string().min(1),
        }),
      ],
    },
    state: {
      init: '',
      rules: [
        createRule({
          name: 'state',
          schema: z.string().min(1),
        }),
      ],
    },
    zipCode: {
      init: '',
      rules: [
        createRule({
          name: 'zipCode',
          schema: z.string().min(1),
        }),
      ],
    },
    area: {
      init: '',
      rules: [
        createRule({
          name: 'area',
          schema: z.string().min(1),
        }),
      ],
    },
    jobType: {
      init: '',
      rules: [
        createRule({
          name: 'jobType',
          schema: z.string().min(1),
        }),
      ],
    },
    jobSource: {
      init: '',
      rules: [
        createRule({
          name: 'jobSource',
          schema: z.string().min(1),
        }),
      ],
    },
    jobDescription: {
      init: '',
    },
    startDate: {
      init: '',
      rules: [
        createRule({
          name: 'startDate',
          schema: z.string().min(1).date(''),
        }),
      ],
    },
    startTime: {
      init: '',
      rules: [
        createRule({
          name: 'startTime',
          schema: z.string().min(1).time(),
        }),
      ],
    },
    endTime: {
      init: '',
      rules: [
        createRule({
          name: 'endTime',
          schema: z.string().min(1).time(),
        }),
      ],
    },
    technician: {
      init: '',
      rules: [
        createRule({
          name: 'technician',
          schema: z.string().min(1),
        }),
      ],
    },
  },
});

export const open = createEvent();

export const save = createEvent();

export const $isLoading = createStore(true);

export const $isDone = createStore(false);

const $dealFields = createStore<object[]>([]);

const $jobFields = createStore<(typeof jobFields)[number][]>([]);

const $keys = createStore<object>({});

const $savedFormValues = createStore({});

const GetDealFieldsFX = createEffect(() => {
  console.log('getDealFieldsFX');
  return dealFieldsService.GetAllDealFields();
});

const AddJobFieldsFX = createEffect((fields: (typeof jobFields)[number][]) => {
  for (const field of fields) {
    dealFieldsService.AddNewDealField(field);
    new Promise((resolve) => setTimeout(resolve, 1010));
  }
});

const AddJobFX = createEffect((data: object) => dealsService.AddDeal(data));

sample({
  clock: open,
  target: GetDealFieldsFX,
});

sample({
  source: GetDealFieldsFX.doneData,
  target: $dealFields,
});

sample({
  source: GetDealFieldsFX.doneData,
  fn: (dealFields) => {
    return jobFields.filter(
      (jobFld) =>
        !dealFields.find(
          (dealFld: any) =>
            dealFld.name === jobFld.name &&
            dealFld.field_type === jobFld.field_type
        )
    );
  },
  target: [$jobFields, AddJobFieldsFX],
});

sample({
  clock: AddJobFieldsFX.doneData,
  fn: () => false,
  target: $isLoading,
});

sample({
  clock: $isLoading,
  filter: (isLoading) => !isLoading,
  fn: () => JSON.parse(localStorage.getItem('formValues') ?? ''),
  target: form.setForm,
});

sample({
  clock: AddJobFieldsFX.doneData,
  source: combine($dealFields, $jobFields, (dealFields, jobFields) =>
    Object.assign(dealFields, jobFields)
  ),
  fn: (dealFields) =>
    jobFields.reduce((keys: any, jobFld) => {
      const dealFld: any = dealFields.find(
        (dealFld: any) => dealFld.name === jobFld.name
      );
      if (dealFld) {
        keys[dealFld.name] = dealFld.key;
      }
      return keys;
    }, {}),
  target: $keys,
});

sample({
  clock: form.formValidated,
  source: $keys,
  fn: (keys: any, values: any) => {
    return {
      title: 'Job',
      [keys['First name']]: values.firstName,
      [keys['Last name']]: values.lastName,
      [keys['Phone']]: values.phone,
      [keys['Email']]: values.email,
      [keys['Address']]: values.address,
      [keys['City']]: values.city,
      [keys['State']]: values.state,
      [keys['Zip code']]: values.zipCode,
      [keys['Area']]: values.area,
      [keys['Job type']]: values.jobType,
      [keys['Job source']]: values.jobSource,
      [keys['Job description']]: values.jobDescription,
      [keys['Start date']]: values.startDate,
      [keys['Start time']]: values.startTime,
      [keys['End time']]: values.endTime,
      [keys['Technician']]: values.technician,
    };
  },
  target: AddJobFX,
});

sample({
  clock: AddJobFX.pending,
  fn: () => true,
  target: $isLoading,
});

sample({
  clock: AddJobFX.done,
  fn: () => true,
  target: $isDone,
});

sample({
  clock: save,
  source: form.$values,
  target: $savedFormValues,
});

persist({
  store: $savedFormValues,
  key: 'formValues',
});
