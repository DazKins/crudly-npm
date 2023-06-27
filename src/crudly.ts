import fetch from "node-fetch";
import { CrudlyOptions } from "./model/options";
import { TableName, TableSchema } from "./model/table";
import { Entity, EntityId } from "./model/entity";

class CrudlyUnexpectedError extends Error {
  constructor(message: string) {
    super(`unexpected crudly error: ${message}`)
  }
}

class CrudlyValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class CrudlyEntityNotFoundError extends Error {
  constructor() {
    super("entity not found");
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
    } else if (res.status != 200) {
      throw new CrudlyUnexpectedError(`status: ${res.status}, body: ${await res.text()}`);
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
    } else if (res.status != 200) {
      throw new CrudlyUnexpectedError(`status: ${res.status}, body: ${await res.text()}`);
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
    } else if (res.status != 200) {
      throw new CrudlyUnexpectedError(`status: ${res.status}, body: ${await res.text()}`);
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
      throw new CrudlyEntityNotFoundError();
    } else if (res.status != 200) {
      throw new CrudlyUnexpectedError(`status: ${res.status}, body: ${await res.text()}`);
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
    
    if (res.status != 200) {
      throw new CrudlyUnexpectedError(`status: ${res.status}, body: ${await res.text()}`);
    }

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
    
    if (res.status != 200) {
      throw new CrudlyUnexpectedError(`status: ${res.status}, body: ${await res.text()}`);
    }

    return (await res.json()) as Entity;
  };

  const deleteEntity = async (
    tableName: TableName,
    id: EntityId
  ): Promise<void> => {
    const res = await fetch(`${url}/tables/${tableName}/entities/${id}`, {
      method: "DELETE",
      headers,
    });
    
    if (res.status != 200) {
      throw new CrudlyUnexpectedError(`status: ${res.status}, body: ${await res.text()}`);
    }
  };

  const createTable = async (
    tableName: TableName,
    tableSchema: TableSchema
  ): Promise<void> => {
    const res = await fetch(`${url}/tables/${tableName}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(tableSchema),
    });
    
    if (res.status != 200) {
      throw new CrudlyUnexpectedError(`status: ${res.status}, body: ${await res.text()}`);
    }
  };

  const getTableSchema = async (tableName: TableName): Promise<TableSchema> => {
    const res = await fetch(`${url}/tables/${tableName}`, {
      method: "GET",
      headers,
    });
    
    if (res.status != 200) {
      throw new CrudlyUnexpectedError(`status: ${res.status}, body: ${await res.text()}`);
    }

    return (await res.json()) as TableSchema;
  };

  const getTables = async (): Promise<{ [key: string]: TableSchema }> => {
    const res = await fetch(`${url}/tables`, {
      method: "GET",
      headers,
    });
    
    if (res.status != 200) {
      throw new CrudlyUnexpectedError(`status: ${res.status}, body: ${await res.text()}`);
    }

    return (await res.json()) as { [key: string]: TableSchema };
  };

  const deleteTable = async (tableName: TableName): Promise<void> => {
    const res = await fetch(`${url}/tables/${tableName}`, {
      method: "DELETE",
      headers,
    });

    if (res.status != 200) {
      throw new CrudlyUnexpectedError(`status: ${res.status}, body: ${await res.text()}`);
    }
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
