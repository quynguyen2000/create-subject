export const expiration = (expiration_time: number): boolean => {
  const currentTime = new Date().getTime();
  const expirationTime = currentTime + expiration_time;
  if (currentTime >= expirationTime) {
    return true;
  }
  return false;
};
