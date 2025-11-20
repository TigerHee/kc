import { Task, Schedule } from 'src/utils/schedule';
describe('Task and Schedule', () => {
  test('should execute tasks in sequence', async () => {
    const results = [];

    const task1 = new Task({
      func: () => new Promise((resolve) => setTimeout(() => resolve('task1'), 100)),
      key: 'task1',
      onSuccess: (key, res) => results.push(res),
      onError: (key, err) => results.push(err),
    });

    const task2 = new Task({
      func: () => new Promise((resolve) => setTimeout(() => resolve('task2'), 100)),
      key: 'task2',
      onSuccess: (key, res) => results.push(res),
      onError: (key, err) => results.push(err),
    });

    const schedule = new Schedule(50);
    schedule.push(task1);
    schedule.push(task2);


    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(results).toEqual(['task1', 'task2']);
  });

  test('should cache results and reuse them', async () => {
    const results = [];

    const task1 = new Task({
      func: () => new Promise((resolve) => setTimeout(() => resolve('task1'), 100)),
      key: 'task1',
      onSuccess: (key, res) => results.push(res),
      onError: (key, err) => results.push(err),
    });

    const task2 = new Task({
      func: () => new Promise((resolve) => setTimeout(() => resolve('task2'), 100)),
      key: 'task2',
      onSuccess: (key, res) => results.push(res),
      onError: (key, err) => results.push(err),
    });

    const task3 = new Task({
      func: () => new Promise((resolve) => setTimeout(() => resolve('task1'), 100)),
      key: 'task1',
      onSuccess: (key, res) => results.push(res),
      onError: (key, err) => results.push(err),
    });
    const schedule = new Schedule(50);
    schedule.push(task1);
    schedule.push(task2);
    schedule.push(task3);

    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(results).toEqual(['task1', 'task2', 'task1']);
  });

  test('should clear cache correctly', async () => {
    const results = [];

    const task1 = new Task({
      func: () => new Promise((resolve) => setTimeout(() => resolve('task1'), 100)),
      key: 'task1',
      onSuccess: (key, res) => results.push(res),
      onError: (key, err) => results.push(err),
    });

    const schedule = new Schedule(50);

    schedule.push(task1);
    await new Promise((resolve) => setTimeout(resolve, 200));
    schedule.clear();
    const task2 = new Task({
      func: () => new Promise((resolve) => setTimeout(() => resolve('task2'), 100)),
      key: 'task2',
      onSuccess: (key, res) => results.push(res),
      onError: (key, err) => results.push(err),
    });

    schedule.push(task2);
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(results).toEqual(['task1', 'task2']);
  });
});
