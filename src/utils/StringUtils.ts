export const prependStrRecursively = (char: string, str: string, size: number): string => {
  return (size > str.length) ? prependStrRecursively(char, char + str, size) : str;
};
