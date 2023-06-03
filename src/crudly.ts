import fetch from "node-fetch";
import { CrudlyOptions } from "./model/options";
import { TableSchema } from "./model/table";

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
    tableName: string,
    entity: any
  ): Promise<string> => {
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
    tableName: string,
    entities: any[]
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
    tableName: string,
    id: string,
    entity: any
  ): Promise<string> => {
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
    tableName: string,
    entityId: string
  ): Promise<any> => {
    const res = await fetch(`${url}/tables/${tableName}/entities/${entityId}`, {
      headers,
    });

    if (res.status == 404) {
      return null;
    }

    return await res.json();
  };

  const getEntities = async (
    tableName: string,
    filters: string[] = []
  ): Promise<any[]> => {
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
    tableName: string,
    id: string,
    entity: any
  ): Promise<any> => {
    const res = await fetch(`${url}/tables/${tableName}/entities/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(entity),
    });

    return await res.json();
  };

  const deleteEntity = async (tableName: string, id: string): Promise<void> => {
    await fetch(`${url}/tables/${tableName}/entities/${id}`, {
      method: "DELETE",
      headers,
    });
  };

  const createTable = async (
    tableName: string,
    tableSchema: TableSchema
  ): Promise<any> => {
    const res = await fetch(`${url}/tables/${tableName}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(tableSchema),
    });

    return await res.json();
  };

  const getTableSchema = async (tableName: string): Promise<TableSchema> => {
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

  const deleteTable = async (tableName: string): Promise<void> => {
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
