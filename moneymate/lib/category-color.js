// /lib/category-colors.js
export const colorArray = [
  "#F87171", // Red
  "#FBBF24", // Yellow
  "#34D399", // Green
  "#60A5FA", // Blue
  "#A78BFA", // Purple
  "#F472B6", // Pink
  "#FB923C", // Orange
];

export const getCategoryColor = (category, categoryList) => {
  const index = categoryList.indexOf(category);
  if (index === -1) return "#6b7280"; // fallback gray
  return colorArray[index % colorArray.length];
};
