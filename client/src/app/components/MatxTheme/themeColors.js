const textLight = {
  primary: "rgba(52, 49, 76, 1)",
  hint: "rgba(52, 49, 76, 0.38)",
  secondary: "rgba(52, 49, 76, 0.54)",
  disabled: "rgba(52, 49, 76, 0.38)",
};

const textDark = {
  primary: "#fff",
  hint: "rgba(255, 255, 255, 0.64)",
  secondary: "rgba(255, 255, 255, 0.7)",
  disabled: "rgba(255, 255, 255, 0.64)",
};

const secondaryColor = {
  main: "#ff9e43",
  dark: "#ff932e",
  light: "#f9a352",
  contrastText: textLight.primary,
};

const errorColor = { main: "#FF3D57" };

export const themeShadows = [
  "none",
  "0px 2px 1px -1px rgba(0, 0, 0, 0.06),0px 1px 1px 0px rgba(0, 0, 0, 0.042),0px 1px 3px 0px rgba(0, 0, 0, 0.036)",
  "0px 3px 1px -2px rgba(0, 0, 0, 0.06),0px 2px 2px 0px rgba(0, 0, 0, 0.042),0px 1px 5px 0px rgba(0, 0, 0, 0.036)",
  "0px 3px 3px -2px rgba(0, 0, 0, 0.06),0px 3px 4px 0px rgba(0, 0, 0, 0.042),0px 1px 8px 0px rgba(0, 0, 0, 0.036)",
  "0px 2px 4px -1px rgba(0, 0, 0, 0.06),0px 4px 5px 0px rgba(0, 0, 0, 0.042),0px 1px 10px 0px rgba(0, 0, 0, 0.036)",
  "0px 3px 5px -1px rgba(0, 0, 0, 0.06),0px 5px 8px 0px rgba(0, 0, 0, 0.042),0px 1px 14px 0px rgba(0, 0, 0, 0.036)",
  "0px 3px 5px -1px rgba(0, 0, 0, 0.06),0px 6px 10px 0px rgba(0, 0, 0, 0.042),0px 1px 18px 0px rgba(0, 0, 0, 0.036)",
  "0px 4px 5px -2px rgba(0, 0, 0, 0.06),0px 7px 10px 1px rgba(0, 0, 0, 0.042),0px 2px 16px 1px rgba(0, 0, 0, 0.036)",
  "0px 5px 5px -3px rgba(0, 0, 0, 0.06),0px 8px 10px 1px rgba(0, 0, 0, 0.042),0px 3px 14px 2px rgba(0, 0, 0, 0.036)",
  "0px 5px 6px -3px rgba(0, 0, 0, 0.06),0px 9px 12px 1px rgba(0, 0, 0, 0.042),0px 3px 16px 2px rgba(0, 0, 0, 0.036)",
  "0px 6px 6px -3px rgba(0, 0, 0, 0.06),0px 10px 14px 1px rgba(0, 0, 0, 0.042),0px 4px 18px 3px rgba(0, 0, 0, 0.036)",
  "0px 6px 7px -4px rgba(0, 0, 0, 0.06),0px 11px 15px 1px rgba(0, 0, 0, 0.042),0px 4px 20px 3px rgba(0, 0, 0, 0.036)",
  "0px 7px 8px -4px rgba(0, 0, 0, 0.06),0px 12px 17px 2px rgba(0, 0, 0, 0.042),0px 5px 22px 4px rgba(0, 0, 0, 0.036)",
  "0px 7px 8px -4px rgba(0, 0, 0, 0.06),0px 13px 19px 2px rgba(0, 0, 0, 0.042),0px 5px 24px 4px rgba(0, 0, 0, 0.036)",
  "0px 7px 9px -4px rgba(0, 0, 0, 0.06),0px 14px 21px 2px rgba(0, 0, 0, 0.042),0px 5px 26px 4px rgba(0, 0, 0, 0.036)",
  "0px 8px 9px -5px rgba(0, 0, 0, 0.06),0px 15px 22px 2px rgba(0, 0, 0, 0.042),0px 6px 28px 5px rgba(0, 0, 0, 0.036)",
  "0px 8px 10px -5px rgba(0, 0, 0, 0.06),0px 16px 24px 2px rgba(0, 0, 0, 0.042),0px 6px 30px 5px rgba(0, 0, 0, 0.036)",
  "0px 8px 11px -5px rgba(0, 0, 0, 0.06),0px 17px 26px 2px rgba(0, 0, 0, 0.042),0px 6px 32px 5px rgba(0, 0, 0, 0.036)",
  "0px 9px 11px -5px rgba(0, 0, 0, 0.06),0px 18px 28px 2px rgba(0, 0, 0, 0.042),0px 7px 34px 6px rgba(0, 0, 0, 0.036)",
  "0px 9px 12px -6px rgba(0, 0, 0, 0.06),0px 19px 29px 2px rgba(0, 0, 0, 0.042),0px 7px 36px 6px rgba(0, 0, 0, 0.036)",
  "0px 10px 13px -6px rgba(0, 0, 0, 0.06),0px 20px 31px 3px rgba(0, 0, 0, 0.042),0px 8px 38px 7px rgba(0, 0, 0, 0.036)",
  "0px 10px 13px -6px rgba(0, 0, 0, 0.06),0px 20px 31px 3px rgba(0, 0, 0, 0.042),0px 8px 38px 7px rgba(0, 0, 0, 0.036)",
  "0px 10px 13px -6px rgba(0, 0, 0, 0.06),0px 20px 31px 3px rgba(0, 0, 0, 0.042),0px 8px 38px 7px rgba(0, 0, 0, 0.036)",
  "0px 10px 13px -6px rgba(0, 0, 0, 0.06),0px 20px 31px 3px rgba(0, 0, 0, 0.042),0px 8px 38px 7px rgba(0, 0, 0, 0.036)",
  "0px 10px 13px -6px rgba(0, 0, 0, 0.06),0px 20px 31px 3px rgba(0, 0, 0, 0.042),0px 8px 38px 7px rgba(0, 0, 0, 0.036)",
];

export const themeColors = {
  whitePurple: {
    shadows: themeShadows,
    palette: {
      type: "light",
      text: textLight,
      error: errorColor,
      background: { paper: "#fff", default: "#fafafa" },
      secondary: { main: "#7467ef", contrastText: "#ffffff" },
      primary: { main: "#ffffff", contrastText: textLight.primary },
    },
  },

  whiteBlue: {
    shadows: themeShadows,
    palette: {
      type: "light",
      text: textLight,
      background: { paper: "#fff", default: "#fafafa" },
      secondary: { main: "#1976d2", contrastText: "#ffffff" },
      primary: { main: "#ffffff", contrastText: textLight.primary },
    },
  },

  slateDark1: {
    shadows: themeShadows,
    palette: {
      type: "dark",
      text: textDark,
      error: errorColor,
      background: { paper: "#222A45", default: "#1a2038" },
      primary: { main: "#222A45", contrastText: "#ffffff" },
      secondary: { main: "#ff9e43", contrastText: textLight.primary },
    },
  },

  slateDark2: {
    shadows: themeShadows,
    palette: {
      type: "dark",
      text: textDark,
      error: errorColor,
      background: { paper: "#222A45", default: "#1a2038" },
      primary: { main: "#1a2038", contrastText: "#ffffff" },
      secondary: { main: "#ff9e43", contrastText: textLight.primary },
    },
  },

  purple1: {
    shadows: themeShadows,
    palette: {
      type: "light",
      text: textLight,
      error: errorColor,
      secondary: secondaryColor,
      background: { paper: "#fff", default: "#fafafa" },
      primary: { main: "#7467ef", contrastText: "#ffffff" },
    },
  },

  purple2: {
    shadows: themeShadows,
    palette: {
      type: "light",
      text: textLight,
      error: errorColor,
      background: { paper: "#fff", default: "#fafafa" },
      primary: { main: "#6a75c9", contrastText: "#ffffff" },
      secondary: { main: "#ff9e43", contrastText: textLight.primary },
    },
  },

  purpleDark1: {
    shadows: themeShadows,
    palette: {
      type: "dark",
      text: textDark,
      error: errorColor,
      background: { paper: "#222A45", default: "#1a2038" },
      primary: { main: "#7467ef", contrastText: "#ffffff" },
      secondary: { main: "#ff9e43", contrastText: textLight.primary },
    },
  },

  purpleDark2: {
    shadows: themeShadows,
    palette: {
      type: "dark",
      text: textDark,
      error: errorColor,
      background: { paper: "#222A45", default: "#1a2038" },
      primary: { main: "#6a75c9", contrastText: "#ffffff" },
      secondary: { main: "#ff9e43", contrastText: textLight.primary },
    },
  },

  blue: {
    shadows: themeShadows,
    palette: {
      type: "light",
      text: textLight,
      error: errorColor,
      background: { paper: "#fff", default: "#fafafa" },
      primary: { main: "#1976d2", contrastText: "#ffffff" },
      secondary: { main: "#FFAF38", contrastText: textLight.primary },
    },
  },

  blueDark: {
    shadows: themeShadows,
    palette: {
      type: "dark",
      text: textDark,
      error: errorColor,
      background: { paper: "#222A45", default: "#1a2038" },
      primary: { main: "#1976d2", contrastText: "#ffffff" },
      secondary: { main: "#FF4F30", contrastText: textLight.primary },
    },
  },

  red: {
    shadows: themeShadows,
    palette: {
      type: "dark",
      text: textDark,
      error: errorColor,
      primary: { main: "#e53935", contrastText: "#ffffff" },
      secondary: { main: "#FFAF38", contrastText: textLight.primary },
    },
  },
};
