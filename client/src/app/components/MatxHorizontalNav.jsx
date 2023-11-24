import { Icon, styled } from "@mui/material";
import { navigations } from "app/navigations";
import { NavLink } from "react-router-dom";

const StyledIcon = styled(Icon)(() => ({
  fontSize: "18px",
  verticalAlign: "middle",
}));

const MatxHorizontalNav = ({ max }) => {
  // let navigation = useSelector(({ navigations }) => navigations);
  if (navigations.length === 0) {
    return null;
  }

  let updateNavigation = [];

  if (max && navigations.length > max) {
    let childItem = {
      name: "More",
      icon: "more_vert",
      children: navigations.slice(max, navigations.length),
    };

    updateNavigation = navigations.slice(0, max);
    updateNavigation.push(childItem);
  }

  function renderLevels(levels) {
    return levels.map((item, key) => {
      if (item.type === "label") return null;

      if (item.children) {
        return (
          <li key={key}>
            <a href="/">
              {item.icon && <StyledIcon>{item.icon}</StyledIcon>}
              {item.name}
            </a>
            <ul>{renderLevels(item.children)}</ul>
          </li>
        );
      } else {
        return (
          <li key={key}>
            <NavLink to={item.path}>
              {item.icon && <StyledIcon>{item.icon}</StyledIcon>}
              {item.name}
            </NavLink>
          </li>
        );
      }
    });
  }

  return (
    <div className="horizontal-nav">
      <ul className="menu">{renderLevels(updateNavigation)}</ul>
    </div>
  );
};

export default MatxHorizontalNav;
