export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export function getPropertySlug(property: {
  id: string;
  name: string;
}): string {
  return createSlug(property.name); // Just use the property name as slug
}

export function getPropertyNameFromSlug(slug: string): string {
  // Convert slug back to searchable name format
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
