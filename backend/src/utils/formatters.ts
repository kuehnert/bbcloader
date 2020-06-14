function titleCase(str: string) {
  return str.replace(/(^|\s)\S/g, function (t: string) {
    return t.toUpperCase();
  });
}

export function formatCategories(categories: string[]) {
  return categories.map((c) => {
    return titleCase(c.replace(/-/g, ' '));
  });
}
