export const parseDbField = (field: any): any[] => {
  if (Array.isArray(field)) {
    return field;
  }
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch (error) {
      console.warn("Failed to parse field:", field, error);
      return [];
    }
  }
  return [];
};
