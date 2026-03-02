import React from 'react'
import { Link } from 'react-router-dom'
import { navItems } from '../../static/data'
import styles from '../../styles/styles'

const Navbar = ({ active }) => {
  return (
    <div className={`block 800px:${styles.noramlFlex}`}>
      {
        navItems && navItems.map((i, index) => (
          <div className="flex" key={i.url || index}>
            <Link to={i.url}
              className={`${active === index + 1 ? "text-[#10B981] font-[600]" : "text-black 800px:text-white"} pb-[30px] 800px:pb-0 font-[500] px-2 800px:text-[14px] 1000px:text-[15px] 1000px:px-3 1200px:px-5 cursor-pointer hover:text-[#10B981] transition-colors whitespace-nowrap`}
            >
              {i.title}
            </Link>
          </div>
        ))
      }
    </div>
  )
}

export default Navbar
