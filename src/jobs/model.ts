import { createGate } from 'effector-react';
import { combine, createEffect, createStore, sample } from 'effector';
import { dealFieldsService } from '../services/DealFieldsServise.ts';
import { jobFields } from '../types/jobs.ts';
import { createForm } from 'effector-forms';
import { dealsService } from '../services/DealsService.ts';

export const form = createForm({
  fields: {
    firstName: {
      init: '',
    },
    lastName: {
      init: '',
    },
    phone: {
      init: '',
    },
    email: {
      init: '',
    },
    address: {
      init: '',
    },
    city: {
      init: '',
    },
    state: {
      init: '',
    },
    zipCode: {
      init: '',
    },
    area: {
      init: '',
    },
    jobType: {
      init: '',
    },
    jobSource: {
      init: '',
    },
    jobDescription: {
      init: '',
    },
    startDate: {
      init: '',
    },
    startTime: {
      init: '',
    },
    endTime: {
      init: '',
    },
    technician: {
      init: '',
    },
  },
});

export const gate = createGate();

const $dealFields = createStore<object[]>([]);

const $jobFields = createStore<(typeof jobFields)[number][]>([]);

const $keys = createStore<object[]>([]);

const GetDealFieldsFX = createEffect(() =>
  dealFieldsService.GetAllDealFields()
);

const AddJobFieldsFX = createEffect((fields: (typeof jobFields)[number][]) => {
  for (const field of fields) dealFieldsService.AddNewDealField(field);
});

const AddJobFX = createEffect((data: object) => dealsService.AddDeal(data));

sample({
  clock: gate.open,
  target: GetDealFieldsFX,
});

sample({
  source: GetDealFieldsFX.doneData,
  target: $dealFields,
});

sample({
  source: GetDealFieldsFX.doneData,
  fn: (dealFields) =>
    jobFields.filter(
      (jobFld) =>
        !dealFields.some(
          (dealFld: any) =>
            dealFld.name === jobFld.name &&
            dealFld.field_type === jobFld.field_type
        )
    ),
  target: [$jobFields, AddJobFieldsFX],
});

sample({
  clock: AddJobFieldsFX.doneData,
  source: combine($dealFields, $jobFields),
  fn: (dealFields: any) =>
    jobFields.map((jobFld) => {
      const { name, key } = dealFields.find(
        (dealFld: any) => dealFld.name === jobFld.name
      );
      return { [name]: key };
    }),
  target: $keys,
});

sample({
  clock: form.formValidated,
  source: $keys,
  fn: (keys: any, values: any) => {
    return {
      title: 'Job',
      [keys[0]['First name']]: values.firstName,
      [keys[1]['Last name']]: values.lastName,
      [keys[2]['Phone']]: values.phone,
      [keys[3]['Email']]: values.email,
      [keys[4]['Address']]: values.address,
      [keys[5]['City']]: values.city,
      [keys[6]['State']]: values.state,
      [keys[8]['Zip code']]: values.zipCode,
      [keys[7]['Area']]: values.area,
      [keys[9]['Job type']]: values.jobType,
      [keys[10]['Job source']]: values.jobSource,
      [keys[11]['Job description']]: values.jobDescription,
      [keys[12]['Start date']]: values.startDate,
      [keys[13]['Start time']]: values.startTime,
      [keys[14]['End time']]: values.endTime,
      [keys[15]['Technician']]: values.technician,
    };
  },
  target: AddJobFX,
});
