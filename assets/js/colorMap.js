const colorMap = {
  aliceBlue: "#F0F8FF",
  black: "#000000",
  white: "#FFFFFF",
  red: "#FF4D4F",
  green: "#52C41A",
  blue: "#1890FF",
  yellow: "#FFC107",
  orange: "#FA8C16",
  purple: "#722ED1",
  gray: "#8C8C8C",
  success: "#52C41A",
  info: "#1890FF",
  warning: "#FAAD14",
  danger: "#FF4D4F",
};

export function getColor(name, fallback = "#000000") {
  return colorMap[name] || fallback;
}

export default colorMap;
