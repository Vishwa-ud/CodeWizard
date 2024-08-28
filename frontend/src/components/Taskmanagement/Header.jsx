import { useState } from "react";
import Logo from '../../assets/logo-mobile.svg'
import iconDown from "../../assets/icon-chevron-down.svg";
import iconUp from "../../assets/icon-chevron-up.svg";
import elipsis from "../../assets/icon-vertical-ellipsis.svg";
import HeaderDropDown from "./HeaderDropDown";

import AddEditBoardModal from "../../modals/AddEditBoardModal";
import { useDispatch, useSelector  } from "react-redux";

function Header ({ setBoardModalOpen , boardModalOpen }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [boardType, setBoardType] = useState("add");

  const dispatch = useDispatch();

  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive);

  return (
    <div className=" p-4 fixed left-0 bg-white dark:bg-[#2b2c37] z-50 right-0 ">
      <header className=" flex justify-between dark:text-white items-center  ">
      
      {/* Left Side */}
      <div className=" flex items-center space-x-2  md:space-x-4">
      <img src={Logo} alt=" Logo " className=" h-6 w-6" />
      <h3 className=" md:text-4xl  hidden md:inline-block font-bold  font-sans">
            kanban
      </h3>
      <div className=" flex items-center ">
          <h3 className=" truncate max-w-[200px] md:text-2xl text-xl font-bold md:ml-20 font-sans  ">
            {board.name}
          </h3>
          <img
              src={openDropdown ? iconUp : iconDown}
              alt=" dropdown icon"
              className=" w-3 ml-2 md:hidden"
              onClick={() => setOpenDropdown(state => !state)}
          />

      </div>
      </div>

      {/* Right Side */}
      <div className=" flex space-x-4 items-center md:space-x-6 ">
          <button
          className=" buttont hidden md:block "
          >
            + Add New Task
          </button>
          <button
            className=" buttont py-1 px-3 md:hidden "
          >
            +
          </button>

          <img
            src={elipsis}
            alt="elipsis"
            className=" cursor-pointer h-6"
          />

      </div>

      

      </header>
      {openDropdown && <HeaderDropDown setBoardModalOpen = {setBoardModalOpen} setOpenDropdown=
      {setOpenDropdown}/>}

      {
        boardModalOpen && 
        <AddEditBoardModal type={boardType} setBoardModalOpen = {setBoardModalOpen}/>
        
      }

    </div>
  )
}

export default Header