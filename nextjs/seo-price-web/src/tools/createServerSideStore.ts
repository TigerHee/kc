type ServerSideFn<T = any> = () => Promise<T>;
type Key = string;

type TaskTuple =
  | [fn: ServerSideFn, key: Key]
  | [fn: ServerSideFn, key: Key, autoMerge: boolean]
  | [fn: ServerSideFn, key: Key, autoMerge: boolean, fallback: any];

export default async function createServerSideStore(...tasks: TaskTuple[]) {
  const results = await Promise.allSettled(tasks.map(([fn]) => fn()));

  const data: Record<string, any> = {};

  results.forEach((result, i) => {
    const [ , key, autoMerge = true, fallback = null ] = tasks[i];
    const value = result.status === 'fulfilled' ? result.value : fallback;

    if (autoMerge && typeof value === 'object' && value !== null) {
      for (const [k, v] of Object.entries(value)) {
        data[`${key}_${k}`] = v;
      }
    } else {
      data[key] = value;
    }
  });
  return data;
}
