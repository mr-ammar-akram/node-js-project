// src/components/Widgets.js

import React from "react";
import "./widgets.css";

export default function Widgets() {
  return (
    <div className="widgets-box">
      <div className="widget">
        <h3>Total Users</h3>
        <p>124</p>
      </div>

      <div className="widget">
        <h3>Total Sales</h3>
        <p>$8,240</p>
      </div>

      <div className="widget">
        <h3>Active Admins</h3>
        <p>3</p>
      </div>
    </div>
  );
}
