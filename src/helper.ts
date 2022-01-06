export const sleep = async (time: number) => {
  return new Promise((resolve, _) => setTimeout(resolve, time));
};
