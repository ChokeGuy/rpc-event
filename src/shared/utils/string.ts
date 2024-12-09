export const upperCaseToCamelCase = (input: string): string => {
    return input
        .toLowerCase() // Convert the entire string to lowercase
        .replace(/[_\s](\w)/g, (_, letter) => letter.toUpperCase());
};
