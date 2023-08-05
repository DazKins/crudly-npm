export type TableName = string;

export enum FieldType {
  Id = "id",
  Integer = "integer",
  String = "string",
  Boolean = "boolean",
  Time = "time",
  Enum = "enum",
}

export type FieldSchema = {
  type: FieldType;
  isOptional: boolean;
  values?: string[];
};

export type TableSchema = { [key: string]: FieldSchema };
