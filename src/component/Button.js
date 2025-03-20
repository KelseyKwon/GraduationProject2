import React from "react";
import { FaCalendar } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import "./../styles/Button.css";

const Button = ({ children, onClick }) => {
  return (
    <div className="button-container" onClick={onClick}>
      {children}
    </div>
  );
};

export const MenuButton = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <IoMenu size={20} color="black" /> {/* 햄버거 메뉴 아이콘 */}
    </Button>
  );
};

export const CalendarButton = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <FaCalendar size={20} color="black" />
    </Button>
  );
};

export default Button;
