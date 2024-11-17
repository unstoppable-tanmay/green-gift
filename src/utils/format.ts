export function getInitials(name: string): string {
  if (!name) return "";

  const words = name.split(" ");
  const initials = words.map((word) => word.charAt(0).toUpperCase()).join("");

  return initials.length > 2 ? initials.slice(0, 2) : initials;
}
