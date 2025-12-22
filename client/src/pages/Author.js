import React, { useEffect, useRef, useState } from "react";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { FaUserShield, FaPhoneAlt } from "react-icons/fa";

import "./Author.css";

export default function Author() {
  const called = useRef(false);
  const [profile, setProfile] = useState("");

  useEffect(() => {
    if (called.current) return;
    called.current = true;   
    const fetchAuthor = async () => {

    const token = localStorage.getItem("token");
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const usern = params.get("username");

      const response = await fetch(`http://localhost:5000/auth/author?username=${usern}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      const userdata = data.user || data.admin;
      setProfile(userdata);
    };

    fetchAuthor();
  }, []);

  return(
    <div className="author-div">
      <div className="author-header">
        <h2>User Information</h2>
      </div>
      <div className="author-information">
        <div className="author-image">
                    <img
                      src={`http://localhost:5000${profile.profilImage}`}
                      alt="Profile"
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        objectFit: "cover"
                      }}
                    />
                    <h3>{profile.username}</h3>
        </div>
        <div className="author-meta">
            <div className="author-icon-list">
                <ul>
                    <li>
                        <MdEmail className="icon" />
                        <span>{profile.email}</span>
                    </li>

                    <li>
                        <FaUserShield className="icon" />
                        <span>{profile.role}</span>
                    </li>

                    <li>
                        <MdLocationOn className="icon" />
                        <span>{profile.address || "N/A"}</span>
                    </li>

                    <li>
                        <FaPhoneAlt className="icon" />
                        <span>{profile.phone || "N/A"}</span>
                    </li>
                </ul>
            </div>
        </div>

      </div>
      <div className="author-bio">
        <h4>About</h4>
        <p>{profile.information || "No information available."}</p>
      </div>
    </div>
  );
}
