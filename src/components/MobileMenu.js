import React from 'react'
import Icon1 from "../assets/images/icon-1.svg"
import Icon2 from "../assets/images/icon-2.svg"
import Icon3 from "../assets/images/icon-3.svg"
import Icon4 from "../assets/images/icon-4.svg"
import ActiveIcon1 from "../assets/images/icon-1-active.svg"
import ActiveIcon2 from "../assets/images/icon-2-active.svg"
import ActiveIcon3 from "../assets/images/icon-3-active.svg"
import ActiveIcon4 from "../assets/images/icon-4-active.svg"
import IconMain from "../assets/images/icon-main.svg"

import { Link, useLocation } from "react-router-dom";

export default function MobileMenu() {

  const usePathname = () => {
    const location = useLocation();
    return location.pathname;
  }
  const currentPath = usePathname();

  return (
    <div className="flex items-center justify-evenly fixed h-24 bottom-0 bg-[#0F0F13] z-10 w-full pb-6 lg:hidden">
      <Link to="/dashboard">
        <img src={currentPath === "/dashboard" ? ActiveIcon1 : Icon1} alt="" />
      </Link>
      <Link to="/calculator" className="mr-10">
        <img src={currentPath === "/calculator" ? ActiveIcon2 : Icon2} alt="" />
      </Link>
      <Link to="/" className='absolute'>
        <img src={IconMain} alt="" />
      </Link>
      <a href="https://discord.gg/UfgQsVQAKw" target="_blank" className="ml-10">
        <img src={currentPath === "/buysell" ? ActiveIcon3 : Icon3} alt="" />
      </a>
      <Link to="/">
        <img src={currentPath === "/" ? ActiveIcon4 : Icon4} alt="" />
      </Link>
    </div>
  )
}
