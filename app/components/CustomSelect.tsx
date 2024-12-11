import { MdKeyboardArrowDown } from "react-icons/md";
import { useState } from "react";

const CustomSelect = ({
  title,
  className,
  children,
}: {
  title: string;
  className: string;
  children: React.ReactNode;
}) => {
  const [isActive, setisActive] = useState<boolean>(false);

  const handleClick = (e: React.MouseEvent) => {
    const clickedElement = e.target as HTMLElement;

    // change active on any click, except when clicking a button or anchor inside the opened div
    if (
      !clickedElement.closest(".opened") ||
      clickedElement.tagName === "BUTTON" ||
      clickedElement.tagName === "A"
    )
      setisActive((prev) => !prev);
  };

  return (
    <>
      {
        <div
          className={
            className +
            " font-bold cursor-pointer flex gap-x-1 relative items-center z10000"
          }
          onClick={handleClick}
        >
          <p className="h-max">{title}</p>
          <MdKeyboardArrowDown className="!h-5 !w-5" />
          {isActive && (
            <div
              className={
                title +
                " opened absolute left-1/2 top-full -translate-x-1/2 flex flex-col items-start gap-y-1 p-1 cursor-default"
              }
            >
              {children}
            </div>
          )}
        </div>
      }
      {isActive && <div className="wrapper" onClick={handleClick}></div>}
    </>
  );
};

export default CustomSelect;
