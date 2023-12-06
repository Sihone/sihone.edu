import useSettings from "app/hooks/useSettings";
import React from "react";

const MatxLogo = ({ className }) => {
  const { settings } = useSettings();
  const theme = settings.themes[settings.activeTheme];

  return (
    <img
      src="/assets/images/logo.svg"
      alt="logo"
      className={`matx-logo ${className}`}
      style={{ backgroundColor: theme.palette.primary.main }}
    />  
  );
};

export default MatxLogo;
