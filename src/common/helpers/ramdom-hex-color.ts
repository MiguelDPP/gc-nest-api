export const ramdomHexColor = () => {
  const r = Math.floor(Math.random() * 156 + 100);
  const g = Math.floor(Math.random() * 156 + 100);
  const b = Math.floor(Math.random() * 156 + 100);

  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
};
