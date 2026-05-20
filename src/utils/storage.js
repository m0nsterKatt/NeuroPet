const SELECTED_CATEGORY_KEY = "neuropet_selected_category";

export function getSelectedCategory() {
  const category = localStorage.getItem(SELECTED_CATEGORY_KEY);

  return category ? JSON.parse(category) : null;
}

export function saveSelectedCategory(category) {
  localStorage.setItem(
    SELECTED_CATEGORY_KEY,
    JSON.stringify(category)
  );
}

export function clearSelectedCategory() {
  localStorage.removeItem(SELECTED_CATEGORY_KEY);
}