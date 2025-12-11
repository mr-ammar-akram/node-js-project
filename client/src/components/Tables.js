// src/components/Tables.js

import React from "react";
import "./table.css";

export default function Tables() {
  return (
    <div className="table-box">
      <h3>Recent Users</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Joined</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>John</td>
            <td>john@gmail.com</td>
            <td>Jan 12</td>
          </tr>

          <tr>
            <td>Sarah</td>
            <td>sarah@gmail.com</td>
            <td>Jan 14</td>
          </tr>

          <tr>
            <td>Ammar</td>
            <td>ammar@gmail.com</td>
            <td>Jan 18</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
