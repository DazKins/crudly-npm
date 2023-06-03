import fetch from "node-fetch";
import { CrudlyOptions } from "./model/options";
import { TableName, TableSchema } from "./model/table";
import { Entity, EntityId } from "./model/entity";

class CrudlyValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

const CrudlyOptionsDefaults = {
  host: "localhost",
  port: ":80",
  protocol: "http://",
};

export const createCrudly = (options: CrudlyOptions) => {
  const protocol = options.protocol ?? CrudlyOptionsDefaults.protocol;
  const host = options.host ?? CrudlyOptionsDefaults.host;
  const port = options.port ?? CrudlyOptionsDefaults.port;

  const url = `${protocol}${host}:${port}`;

  const headers = {
    "X-PROJECT-ID": options.projectId,
    "X-PROJECT-KEY": options.projectKey,
    ...options.customHeaders,
  };

  const createEntity = async (
    tableName: TableName,
    entity: Entity
  ): Promise<EntityId> => {
    const res = await fetch(`${url}/tables/${tableName}/entities`, {
      method: "POST",
      headers,
      body: JSON.stringify(entity),
    });

    if (res.status == 400) {
      throw new CrudlyValidationError(await res.text());
    }

    return await res.text();
  };

  const createEntities = async (
    tableName: TableName,
    entities: Entity[]
  ): Promise<void> => {
    const res = await fetch(`${url}/tables/${tableName}/entities/batch`, {
      method: "POST",
      headers,
      body: JSON.stringify(entities),
    });

    if (res.status == 400) {
      throw new CrudlyValidationError(await res.text());
    }
  };

  const putEntity = async (
    tableName: TableName,
    id: EntityId,
    entity: Entity
  ): Promise<EntityId> => {
    const res = await fetch(`${url}/tables/${tableName}/entities/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(entity),
    });

    if (res.status == 400) {
      throw new CrudlyValidationError(await res.text());
    }

    return await res.text();
  };

  const getEntityById = async (
    tableName: TableName,
    id: EntityId
  ): Promise<Entity> => {
    const res = await fetch(`${url}/tables/${tableName}/entities/${id}`, {
      headers,
    });

    if (res.status == 404) {
      throw new Error("not found");
    }

    return (await res.json()) as Entity;
  };

  const getEntities = async (
    tableName: TableName,
    filters: Filter[] = []
  ): Promise<Entity[]> => {
    const queryParams = new URLSearchParams(
      filters.map((filter) => ["filter", filter])
    ).toString();

    const res = await fetch(
      `${url}/tables/${tableName}/entities?${queryParams}`,
      {
        headers,
      }
    );

    return (await res.json()) as any[];
  };

  const updateEntity = async (
    tableName: TableName,
    id: EntityId,
    entity: Entity
  ): Promise<Entity> => {
    const res = await fetch(`${url}/tables/${tableName}/entities/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(entity),
    });

    return (await res.json()) as Entity;
  };

  const deleteEntity = async (
    tableName: TableName,
    id: EntityId
  ): Promise<void> => {
    await fetch(`${url}/tables/${tableName}/entities/${id}`, {
      method: "DELETE",
      headers,
    });
  };

  const createTable = async (
    tableName: TableName,
    tableSchema: TableSchema
  ): Promise<void> => {
    await fetch(`${url}/tables/${tableName}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(tableSchema),
    });
  };

  const getTableSchema = async (tableName: TableName): Promise<TableSchema> => {
    const res = await fetch(`${url}/tables/${tableName}`, {
      method: "GET",
      headers,
    });

    return (await res.json()) as TableSchema;
  };

  const getTables = async (): Promise<{ [key: string]: TableSchema }> => {
    const res = await fetch(`${url}/tables`, {
      method: "GET",
      headers,
    });

    return (await res.json()) as { [key: string]: TableSchema };
  };

  const deleteTable = async (tableName: TableName): Promise<void> => {
    await fetch(`${url}/tables/${tableName}`, {
      method: "DELETE",
      headers,
    });
  };

  return {
    createEntity,
    createEntities,
    putEntity,
    updateEntity,
    getEntityById,
    getEntities,
    deleteEntity,

    createTable,
    getTableSchema,
    getTables,
    deleteTable,
  };
};
