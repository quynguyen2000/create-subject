export const expiration = (expiration_time: number): boolean => {
  const currentTime = new Date().getTime();

  if (expiration_time - currentTime > 0) {
    return false;
  } else {
    return true;
  }
};
