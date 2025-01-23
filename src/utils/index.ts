export const catchError = (error: string | unknown) => {
  throw new Error(`${error}`);
};
