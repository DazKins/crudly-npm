export type TableName = string;

export enum FieldType {
  Id,
  Integer,
  String,
  Boolean,
  Time,
  Enum,
}

export type FieldSchema = {
  type: FieldType;
  isOptional: boolean;
};

export type TableSchema = { [key: string]: FieldSchema };
