export const expiration = (expiration_time: number) => {
  const currentTime = new Date().getTime();
  const expirationTime = currentTime + expiration_time;
  if (currentTime > expirationTime) {
    console.log("currentTime > expirationTime", currentTime > expirationTime);
    return true;
  }
  console.log("chưa hết hạn");
  return false;
};
