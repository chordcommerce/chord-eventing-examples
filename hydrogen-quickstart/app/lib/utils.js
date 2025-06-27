export const getCookie = (name) => {
  if (typeof document === 'undefined') return undefined;
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
};

export const combineCartAttributes = (a, b) => {
  const prop = 'key';

  try {
    return Object.values(
      [...a, ...b].reduce((acc, v) => {
        if (v[prop]) {
          acc[v[prop]] = acc[v[prop]] ? {...acc[v[prop]], ...v} : {...v};
        }
        return acc;
      }, {}),
    );
  } catch {
    return [];
  }
};
