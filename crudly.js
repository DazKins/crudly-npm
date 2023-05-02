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
}) => {
  const url = `${protocol}${host}:${port}`;

  const createEntity = async (table, entity) => {
    const res = await fetch(`${url}/tables/${table}/entities`, {
      method: "POST",
      headers: {
        "X-PROJECT-ID": projectId,
        "X-PROJECT-KEY": projectKey,
      },
      body: JSON.stringify(entity),
    });

    if (res.status == 400) {
      throw new CrudlyValidationError(await res.text());
    }

    return await res.text();
  };

  const putEntity = async (table, id, entity) => {
    const res = await fetch(`${url}/tables/${table}/entities/${id}`, {
      method: "PUT",
      headers: {
        "X-PROJECT-ID": projectId,
        "X-PROJECT-KEY": projectKey,
      },
      body: JSON.stringify(entity),
    });

    if (res.status == 400) {
      throw new CrudlyValidationError(await res.text());
    }

    return await res.text();
  };

  const getEntityById = async (table, entityId) => {
    const res = await fetch(`${url}/tables/${table}/entities/${entityId}`, {
      headers: {
        "X-PROJECT-ID": projectId,
        "X-PROJECT-KEY": projectKey,
      },
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
      headers: {
        "X-PROJECT-ID": projectId,
        "X-PROJECT-KEY": projectKey,
      },
    });

    return await res.json();
  };

  const updateEntity = async (table, id, entity) => {
    await fetch(`${url}/tables/${table}/entities/${id}`, {
      method: "PATCH",
      headers: {
        "X-PROJECT-ID": projectId,
        "X-PROJECT-KEY": projectKey,
      },
      body: JSON.stringify(entity),
    });
  };

  const deleteEntity = async (table, id) => {
    await fetch(`${url}/tables/${table}/entities/${id}`, {
      method: "DELETE",
      headers: {
        "X-PROJECT-ID": projectId,
        "X-PROJECT-KEY": projectKey,
      },
    });
  };

  const getTables = async () => {
    const res = await fetch(`${url}/tables`, {
      method: "GET",
      headers: {
        "X-PROJECT-ID": projectId,
        "X-PROJECT-KEY": projectKey,
      },
    });

    return await res.json();
  };

  const createTable = async (tableName, tableSchema) => {
    const res = await fetch(`${url}/tables/${tableName}`, {
      method: "PUT",
      headers: {
        "X-PROJECT-ID": projectId,
        "X-PROJECT-KEY": projectKey,
      },
      body: JSON.stringify(tableSchema),
    });

    return await res.json();
  };

  return {
    createEntity,
    putEntity,
    getEntityById,
    getEntities,
    updateEntity,
    deleteEntity,
    getTables,
    createTable,
  };
};

export default {
  createCrudly,
}
