export function trimObject(obj: object) {
  return Object.keys(obj).reduce((acc, curr) => {
    if (!obj[curr]) {
      return acc;
    }

    acc[curr] = obj[curr];

    return acc;
  }, {});
}
