export type CrudlyOptions = {
  projectId: string;
  projectKey: string;
  host: string | undefined;
  port: string | undefined;
  protocol: string | undefined;
  customHeaders?: { [key: string]: string };
};
