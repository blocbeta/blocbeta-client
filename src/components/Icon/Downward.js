import * as React from "react";

const Downward = (props) => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <path fill="#fff" fillOpacity={0.01} d="M0 0h24v24H0z" />
      <path
        d="M7 9l5.102 6L17 9"
        stroke="#333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Downward;
