import React from 'react'
import Logo from '../assets/images/logo.svg'
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';

export default function Sidebar() {
  const usePathname = () => {
    const location = useLocation();
    return location.pathname;
  }
  const currentPath = usePathname();
  return (
    <div className="w-72 bg-[#0E0F1B] lg:relative absolute flex top-0 left-0 hidden lg:block">
      <div className="overflow-y-auto mt-16 ml-12 font-blender font-bold uppercase text-2xl text-[#8A8B91]">
        <Link to="/" className="mt-[-61px] flex items-center pl-2.5 mb-5 absolute w-[249px] h-[146px] bg-swello-dark  left-0 right-0 ">
          <img
            src={Logo}
            className="h-6 mr-3 sm:h-7 ml-[50px]"
            alt="Flowbite Logo"
          />
        </Link>
        <ul className="space-y-12 mt-[116px]">
          <li>
            <Link
              to="/"
              className={`flex items-center p-2 rounded-lg hover:text-white ${currentPath === "/" ? "text-white" : ""}`}
            >
              <span className="ml-3">Wallet</span>
            </Link>
          </li>

          <li>
            <Link
              to="/dashboard"
              className={`flex items-center p-2 rounded-lg hover:text-white ${currentPath === "/dashboard" ? "text-white" : ""}`}
            >
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>

          <li>
            <Link
              to="/calculator"
              className={`flex items-center p-2 rounded-lg hover:text-white  ${currentPath === "/calculator" ? "text-white" : ""}`}
            >
              <span className="ml-3">Calculator</span>
            </Link>
          </li>

          <li>
            <Link
              to="/buysell"
              className={`flex items-center p-2 rounded-lg hover:text-white  ${currentPath === "/buysell" ? "text-white" : ""}`}
            >
              <span className="ml-3">Buy / Sell </span>
            </Link>
          </li>

          <li>
            <a
              href="https://docs.swello.finance"
              className={`flex items-center p-2 rounded-lg hover:text-white  ${currentPath === "/docs" ? "text-white" : ""}`}
              target="_blank"
            >
              <span className="ml-3">Docs</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="social-links flex ml-12 pl-3">
        <div className="pl-2.5 mt-[151px] ms-50 w-[155px] h-[52px]" >
          <a href="https://swello.medium.com/" target="_blank" className="inline-block mt-[10px]" >
            <svg width="30" height="30" viewBox="-1 -4 23 23" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" className="jam jam-medium-square"><path d='M6.186 7.632a.392.392 0 0 0-.126-.33L5.126 6.17V6h2.9l2.24 4.952L12.236 6H15v.17l-.798.77a.236.236 0 0 0-.089.226v5.668a.236.236 0 0 0 .089.225l.78.772V14H11.06v-.17l.807-.79c.08-.08.08-.103.08-.225V8.234L9.7 13.981h-.303L6.783 8.234v3.852a.534.534 0 0 0 .145.442l1.05 1.284v.17H5v-.17l1.05-1.284a.515.515 0 0 0 .136-.442V7.632z' fill="white" /><path d='M4 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm0-2h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z' fill="white" fillOpacity="0.9" />
            </svg>
          </a>
          <a href="https://twitter.com/swello_finance?s=21&t=dEgdBWul4QZ0gMmrbq5y4w" target="_blank" className="inline-block mx-[15px]">
            <svg width="40" height="21" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.9525 3.98316C17.9647 4.15675 17.9647 4.33034 17.9647 4.50553C17.9647 9.84359 13.8371 16 6.28966 16V15.9968C4.06013 16 1.8769 15.3712 0 14.1857C0.324193 14.2241 0.65001 14.2433 0.97664 14.2441C2.82429 14.2457 4.61913 13.6354 6.07272 12.5114C4.31688 12.4786 2.77717 11.3515 2.23928 9.706C2.85436 9.82279 3.48812 9.79879 4.09181 9.6364C2.17753 9.25563 0.800325 7.59973 0.800325 5.67665C0.800325 5.65905 0.800325 5.64225 0.800325 5.62545C1.37071 5.93824 2.00934 6.11182 2.6626 6.13102C0.859638 4.9447 0.30388 2.58325 1.39265 0.736963C3.47593 3.2608 6.54966 4.79511 9.84928 4.9575C9.51859 3.55439 9.97034 2.08408 11.0364 1.09774C12.689 -0.431763 15.2882 -0.353368 16.8418 1.27293C17.7607 1.09454 18.6415 0.762562 19.4475 0.292192C19.1412 1.22733 18.5001 2.02168 17.6437 2.52645C18.457 2.43206 19.2517 2.21767 20 1.89049C19.4491 2.70324 18.7552 3.41119 17.9525 3.98316Z" fill="white" fillOpacity="0.9" />
            </svg>
          </a>
          <a href="https://discord.gg/UfgQsVQAKw" target="_blank" className="inline-block">
            <svg width="40" height="21" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M16.9419 1.34C15.6473 0.714 14.263 0.259052 12.8157 0C12.638 0.332095 12.4304 0.77877 12.2872 1.1341C10.7487 0.894993 9.22445 0.894993 7.7143 1.1341C7.57116 0.77877 7.35879 0.332095 7.17947 0C5.73067 0.259052 4.3448 0.715672 3.05016 1.34331C0.438869 5.42136 -0.269009 9.39811 0.0849305 13.3184C1.81688 14.655 3.49534 15.467 5.14548 15.9984C5.55291 15.4189 5.91628 14.8028 6.22931 14.1536C5.63313 13.9195 5.06211 13.6306 4.52256 13.2952C4.6657 13.1856 4.80571 13.071 4.94098 12.9531C8.23183 14.5438 11.8074 14.5438 15.0589 12.9531C15.1958 13.071 15.3358 13.1856 15.4774 13.2952C14.9362 13.6322 14.3637 13.9211 13.7675 14.1553C14.0805 14.8028 14.4423 15.4205 14.8513 16C16.503 15.4687 18.183 14.6567 19.915 13.3184C20.3303 8.77378 19.2056 4.83355 16.9419 1.34ZM6.6777 10.9074C5.68982 10.9074 4.87968 9.95426 4.87968 8.79362C4.87968 7.63297 5.67252 6.67822 6.6777 6.67822C7.6829 6.67822 8.49302 7.6313 8.47572 8.79362C8.47728 9.95426 7.6829 10.9074 6.6777 10.9074ZM11.5243 8.79362C11.5243 9.95426 12.3344 10.9074 13.3223 10.9074C14.3275 10.9074 15.1203 9.95426 15.1203 8.79362C15.1376 7.6313 14.3275 6.67822 13.3223 6.67822C12.3171 6.67822 11.5243 7.63297 11.5243 8.79362Z" fill="white" fillOpacity="0.9" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
