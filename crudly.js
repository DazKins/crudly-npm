import fetch from "node-fetch";

class CrudlyValidationError extends Error {
  constructor(message) {
    super(message);
  }
}

const createCrudly = ({
  projectId,
  projectKey,
  host = "localhost",
  port = "80",
  protocol = "https://",
  customHeaders = {},
}) => {
  const url = `${protocol}${host}:${port}`;

  const headers = {
    "X-PROJECT-ID": projectId,
    "X-PROJECT-KEY": projectKey,
    ...customHeaders,
  }

  const createEntity = async (table, entity) => {
    const res = await fetch(`${url}/tables/${table}/entities`, {
      method: "POST",
      headers,
      body: JSON.stringify(entity),
    });

    if (res.status == 400) {
      throw new CrudlyValidationError(await res.text());
    }

    return await res.text();
  };

  const createEntities = async (table, entities) => {
    const res = await fetch(`${url}/tables/${table}/entities/batch`, {
      method: "POST",
      headers,
      body: JSON.stringify(entities),
    });

    if (res.status == 400) {
      throw new CrudlyValidationError(await res.text());
    }
  };

  const putEntity = async (table, id, entity) => {
    const res = await fetch(`${url}/tables/${table}/entities/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(entity),
    });

    if (res.status == 400) {
      throw new CrudlyValidationError(await res.text());
    }

    return await res.text();
  };

  const getEntityById = async (table, entityId) => {
    const res = await fetch(`${url}/tables/${table}/entities/${entityId}`, {
      headers,
    });

    if (res.status == 404) {
      return null;
    }

    return await res.json();
  };

  const getEntities = async (table, filters = []) => {
    const queryParams = new URLSearchParams(
      filters.map((filter) => ["filter", filter])
    ).toString();

    const res = await fetch(`${url}/tables/${table}/entities?${queryParams}`, {
      headers,
    });

    return await res.json();
  };

  const updateEntity = async (table, id, entity) => {
    await fetch(`${url}/tables/${table}/entities/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(entity),
    });
  };

  const deleteEntity = async (table, id) => {
    await fetch(`${url}/tables/${table}/entities/${id}`, {
      method: "DELETE",
      headers,
    });
  };

  const createTable = async (tableName, tableSchema) => {
    const res = await fetch(`${url}/tables/${tableName}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(tableSchema),
    });

    return await res.json();
  };

  const getTableSchema = async (tableName) => {
    const res = await fetch(`${url}/tables/${tableName}`, {
      method: "GET",
      headers,
    });

    return await res.json();
  };

  const getTables = async () => {
    const res = await fetch(`${url}/tables`, {
      method: "GET",
      headers,
    });

    return await res.json();
  };

  const deleteTable = async (tableName) => {
    await fetch(`${url}/tables/${tableName}`, {
      method: "DELETE",
      headers,
    });
  }

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

export default {
  createCrudly,
};
