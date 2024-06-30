const fieldTypes = [
  'address',
  'date',
  'daterange',
  'double',
  'enum',
  'monetary',
  'org',
  'people',
  'phone',
  'set',
  'text',
  'time',
  'timerange',
  'user',
  'varchar',
  'varchar_auto',
  'visible_to',
];

export type DealFieldData = {
  field_type: (typeof fieldTypes)[number];
  name: string;
};
