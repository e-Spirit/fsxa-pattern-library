export const getCircularReplacer = () => {
  const seen = new WeakMap();
  return (key: any, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        const representation = [`First Occurence: ${seen.get(value)}`];
        value.type && representation.push(`type: ${value.type}`);
        value.id && representation.push(`id: ${value.id}`);

        return `[~circle. ${representation.join(", ")}]`;
      }
      seen.set(value, key);
    }
    return value;
  };
};
