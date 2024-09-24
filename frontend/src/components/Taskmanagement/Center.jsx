import { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import Column from "./Column";
import { useSelector } from "react-redux";
import AddEditBoardModal from "../../modals/AddEditBoardModal";
import EmptyBoard from "./EmptyBoard";

function Center({ boardModalOpen, setBoardModalOpen }) {
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive === true);
  const columns = board.columns;

  return (
    <div
      className={
        windowSize[0] >= 768 && isSideBarOpen
          ? " bg-[#f4f7fd]  scrollbar-hide h-screen flex dark:bg-[#20212c]  overflow-x-scroll gap-6  ml-[261px]"
          : "bg-[#f4f7fd]  scrollbar-hide h-screen flex    dark:bg-[#20212c] overflow-x-scroll gap-6 "
      }
    >
      {windowSize[0] >= 768 && (
        <Sidebar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen} />
      )}

      {/* Columns Section */}

      {columns.length > 0 ? (
        <>
      {
      columns.map((col, index) => (
        <Column key={index} colIndex={index} />

      ))}
          <div
            onClick={() => {
              setBoardModalOpen(true);
            }}
            className=" h-screen dark:bg-[#2b2c3740] flex justify-center items-center font-bold text-2xl hover:text-[#635FC7] transition duration-300 cursor-pointer bg-[#E9EFFA] scrollbar-hide mb-2   mx-5 pt-[90px] min-w-[280px] text-[#828FA3] mt-[135px] rounded-lg "
          >
            + New Column
          </div>

        
        </>
      ) :
      <>
      <EmptyBoard type="edit" />
      </>
    }
     {boardModalOpen && (
        <AddEditBoardModal
          type="edit"
          setBoardModalOpen={setBoardModalOpen}
        />
      )}



      
    </div>
  )
}

export default Center