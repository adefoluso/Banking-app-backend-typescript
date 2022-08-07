export const transform = (message: string) => {
	const result = message.split(`\"`).join('');
  return result;
};
