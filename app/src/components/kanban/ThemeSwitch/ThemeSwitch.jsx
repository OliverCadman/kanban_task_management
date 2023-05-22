import React from "react";
import { ReactComponent as DarkIcon } from "../../../assets/svgs/icon-dark-theme.svg";
import { ReactComponent as LightIcon } from "../../../assets/svgs/icon-light-theme.svg";

const ThemeSwitch = ({ handleCheck, checked }) => {
  return (
    <div className="theme-switcher--container pt-2 pb-2">
      <LightIcon />
      <label htmlFor="theme-switcher" className="theme-switcher ml-2 mr-2">
        <input
          type="checkbox"
          id="theme-switcher"
          checked={checked}
          onChange={handleCheck}
        />
        <span className="slider"></span>
      </label>
      <DarkIcon />
    </div>
  );
};

export default ThemeSwitch;
