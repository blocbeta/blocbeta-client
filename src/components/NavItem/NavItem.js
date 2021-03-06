import React from "react";
import { NavLink } from "react-router-dom";
import "./NavItem.css";

const NavItem = ({ children, to, external, ...rest }) => {
  if (external) {
    return (
      <a
        href={to}
        target="_blank"
        rel={"noopener noreferrer"}
        className="header-nav__item"
      >
        {children}
      </a>
    );
  }

  return (
    <NavLink
      to={to}
      className="header-nav__item"
      activeClassName="header-nav__item--active"
      {...rest}
    >
      {children}
    </NavLink>
  );
};

export { NavItem };
