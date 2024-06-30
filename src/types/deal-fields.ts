const fieldTypes = ['date', 'phone', 'time', 'varchar'];

export type DealFieldData = {
  field_type: (typeof fieldTypes)[number];
  name: string;
};
