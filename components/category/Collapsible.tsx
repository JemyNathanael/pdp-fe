import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

interface IProps {
  open?: boolean;
  title: string;
  childrenItem?: ChildProps[];
  routePath: string;
  currentIndex: number;
  changeCollapseStatus: (index: number, state: boolean) => void;
  resetToggle: () => void;
  toggledFlag: boolean;
}

interface ChildProps {
    title: string;
    routePath: string;
}

const Child: React.FC<ChildProps> = ({ routePath, title }) => {
    const router = useRouter();

    const handleTitleRouting = () => {
        router.push(routePath);
    }

    let bgClassName = 'px-3 py-1';
    let textClassName = 'ml-12 font-semibold text-left text-white';

    if (router.asPath === routePath){
        bgClassName = 'bg-[#FBF8E0] px-3 py-1';
        textClassName = 'ml-12 font-semibold text-left text-[#3B5250]';
    }
    
    return (
        <div className={bgClassName}>
            <div className="py-1 flex justify-content-between flex-1 items-center">
                <button className="flex-1" onClick={handleTitleRouting}>
                    <p className={textClassName}>{title}</p>
                </button>
            </div>
        </div>
    )
}

const Collapsible: React.FC<IProps> = ({ open, title, childrenItem, routePath, currentIndex, changeCollapseStatus, toggledFlag, resetToggle }) => {
  const [isOpen, setIsOpen] = useState(open);
  const router = useRouter();

  useEffect(() => {
    if(toggledFlag) {
        if(open) {
            setIsOpen(open);
            changeCollapseStatus(currentIndex, true);
        } else {
            setIsOpen(false);
            changeCollapseStatus(currentIndex, false);
        }
        resetToggle();
    }
  }, [changeCollapseStatus, currentIndex, open, resetToggle, toggledFlag])
  

  const handleFilterOpening = () => {
    setIsOpen((prev) => !prev);
    changeCollapseStatus(currentIndex, !isOpen);
  };

  const handleTitleRouting = () => {
    router.push(routePath);
  }

  let bgClassName = 'px-3';
  let iconClassName = 'text-white'
  let textClassName = 'font-semibold text-left text-white';

  if (router.asPath === routePath){
    bgClassName = 'bg-[#FBF8E0] px-3';
    iconClassName = 'text-[#3B5250]';
    textClassName = 'font-semibold text-left text-[#3B5250]';
  }

  return (
    <>
        <div className={bgClassName}>
            <div className="py-1 flex justify-content-between flex-1 items-center">
                <button type="button" className="p-1 mr-2" onClick={handleFilterOpening}>
                {!isOpen ? (
                  <FontAwesomeIcon icon={faChevronRight} className={`fa-fw ${iconClassName}`} />
                ) : (
                  <FontAwesomeIcon icon={faChevronDown} className={`fa-fw ${iconClassName}`} />
                )}
                </button>
                <button className="flex-1" onClick={handleTitleRouting}>
                    <p className={textClassName}>{title}</p>
                </button>
            </div>
        </div>

        <div>
          <div>{(isOpen && childrenItem) &&
            childrenItem.map((childProps, i) => 
                <Child title={childProps.title} routePath={childProps.routePath} key={i}/>
            )
          }</div>
        </div>
    </>
  );
};

export default Collapsible;