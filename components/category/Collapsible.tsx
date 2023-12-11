import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight, faCircle } from "@fortawesome/free-solid-svg-icons";
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
  isOpen: boolean;
}

const Child: React.FC<ChildProps> = ({ routePath, title, isOpen }) => {
  const router = useRouter();

  const handleTitleRouting = () => {
    router.push(routePath);
  };

  let bgClassName = 'px-3 py-1';
  let textClassName = 'ml-12 font-semibold text-left text-black';

  if (router.asPath === routePath) {
    bgClassName = 'px-3 py-1';
    textClassName = 'ml-4 font-semibold text-left text-[#3788FD] text-base';

    if (title.length > 1 && isOpen && router.asPath === routePath) {
      textClassName += ' moveLeftSubCategory';
    }
  }

  return (
    <div className={bgClassName}>
      <div className="py-1 flex justify-content-between flex-1 items-center overflow-hidden">
        <button className="flex-1" onClick={handleTitleRouting}>
          {isOpen && router.asPath === routePath ? (
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
              <FontAwesomeIcon icon={faCircle} size="2xs" color="#3788FD" />
              <p className={textClassName} style={{ fontSize: '110%' }}>{title}</p>
            </div>
          ) : (
            <p className={textClassName}>{title}</p>
          )}
        </button>
      </div>
    </div>
  );
};

const Collapsible: React.FC<IProps> = ({ open, title, childrenItem, routePath, currentIndex, changeCollapseStatus, toggledFlag, resetToggle }) => {
  const [isOpen, setIsOpen] = useState(open);
  const router = useRouter();

  useEffect(() => {
    if (toggledFlag) {
      if (open) {
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
  let iconClassName = 'text-[#DBDBDB]';
  let textClassName = 'font-semibold text-left text-black';

  if (router.asPath.includes(routePath)) {
    bgClassName = 'px-3';
    iconClassName = 'text-[#3788FD]';
    textClassName = 'font-semibold text-left text-[#3788FD] text-base';

    if (title.length > 1) {
      textClassName += ' moveLeftCategory';
    }
  }

  return (
    <>
      <div className={bgClassName}>
        <div className="py-1 flex justify-content-between flex-1 items-center overflow-hidden">
          <button type="button" className="p-1 mr-2" onClick={handleFilterOpening}>
            {!isOpen ? (
              <FontAwesomeIcon icon={faChevronRight} className={`fa-fw ${iconClassName}`} />
            ) : (
              <FontAwesomeIcon icon={faChevronDown} className={`fa-fw ${iconClassName}`} />
            )}
          </button>
          <p onClick={handleTitleRouting} className={textClassName}>{title}</p>
        </div>
      </div>

      <div>
        <div>
          {(isOpen && childrenItem) &&
            childrenItem.map((childProps, i) =>
              <div key={i}>
                <Child title={childProps.title} routePath={childProps.routePath} isOpen={isOpen} />
              </div>
            )
          }
        </div>
      </div>
    </>
  );
};

export default Collapsible;