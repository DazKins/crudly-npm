export type EntityId = string;

export type Entity = {
  [key: string]: any;
};

export type GetEntitiesResponse = {
  entities: Entity[];
  totalCount: number;
  offset: number;
  limit: number;
};
