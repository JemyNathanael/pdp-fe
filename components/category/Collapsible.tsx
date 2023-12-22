import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { Tooltip } from "antd";
import { Collapse } from "antd";

const { Panel } = Collapse;

interface IProps {
  open?: boolean;
  title: string;
  childrenItem?: ChildProps[];
  routePath: string;
  currentIndex: number;
  selectedIndex: number;
  changeCollapseStatus: (index: number, state: boolean) => void;
  resetToggle: () => void;
  toggledFlag: boolean;
  searchRoutePath?: string;
  setSearchRoutePath: () => void;
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

  let bgClassName = "px-0 py-1";
  let textClassName =
    "ml-12 font-semibold text-left text-black moveLeftSubcategory";

  if (router.asPath === routePath) {
    bgClassName = "px-0 py-1";
    textClassName =
      "ml-12 font-semibold text-left text-[#3788FD] moveLeftSubcategory";
  }

  return (
    <div className={bgClassName}>
      <div className="py-1 flex justify-content-between flex-1 items-center">
        <button className="flex-1" onClick={handleTitleRouting}>
          {isOpen && router.asPath === routePath ? (
            <Tooltip title={title} placement="right">
              <p className={textClassName} style={{ fontSize: "110%" }}>
                <FontAwesomeIcon icon={faCircle} size="2xs" display={"block"} />{" "}
                {title}
              </p>
            </Tooltip>
          ) : (
            <Tooltip title={title} placement="right">
              <p className={textClassName}>{title}</p>
            </Tooltip>
          )}
        </button>
      </div>
    </div>
  );
};

const Collapsible: React.FC<IProps> = ({
  open,
  title,
  childrenItem,
  routePath,
  currentIndex,
  selectedIndex,
  changeCollapseStatus,
  toggledFlag,
  resetToggle,
  searchRoutePath,
  setSearchRoutePath
}) => {
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
    }
  }, [
    changeCollapseStatus,
    currentIndex,
    open,
    resetToggle,
    toggledFlag,
    selectedIndex,
  ]);

  useEffect(() => {

    if (searchRoutePath !== '' && searchRoutePath !== undefined) {

      if (searchRoutePath.includes(routePath)) {
        setIsOpen(true);
        changeCollapseStatus(currentIndex, true);
        setSearchRoutePath();
      }
    }
  }, [changeCollapseStatus, currentIndex, isOpen, routePath, searchRoutePath, setSearchRoutePath])

  const handleFilterOpening = () => {
    setIsOpen((prev) => !prev);
    changeCollapseStatus(currentIndex, !isOpen);
  };

  const handleTitleRouting = () => {
    setIsOpen(true);
    changeCollapseStatus(currentIndex, true);
    router.push(routePath);
  };

  let bgClassName = "px-0";
  let iconClassName = "text-[#DBDBDB]";
  let textClassName = "font-semibold text-left text-black moveLeftSubcategory";

  if (router.asPath.includes(routePath)) {
    bgClassName = "px-0";
    iconClassName = "text-[#3788FD]";
    textClassName =
      "font-semibold text-left text-[#3788FD] text-base moveLeftSubcategory";
  }

  return (
    <Collapse
      className="p-0"
      bordered={false}
      activeKey={isOpen ? ["1"] : []} // Menggunakan activeKey daripada defaultActiveKey
      onChange={(keys) => {
        const newState = keys.length > 0;
        changeCollapseStatus(currentIndex, newState);
        if (toggledFlag) {
          resetToggle();
        }
      }}
      expandIcon={() => null}
    >
      <Panel
        header={
          <div className={bgClassName}>
            <div className="py-1 flex justify-content-between flex-1 items-center">
              <button
                type="button"
                className="p-0 mr-2"
                onClick={handleFilterOpening}
              >
                {isOpen ? (
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`fa-fw ${iconClassName}`}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className={`fa-fw ${iconClassName}`}
                  />
                )}
              </button>

              <Tooltip style={{}} title={title} placement="right">
                <p onClick={handleTitleRouting} className={textClassName}>
                  {title}
                </p>
              </Tooltip>
            </div>
          </div>
        }
        key="1"
      >
        <div>
          {isOpen &&
            childrenItem &&
            childrenItem.map((childProps, i) => (
              <div key={i}>
                <Child
                  title={childProps.title}
                  routePath={childProps.routePath}
                  isOpen={isOpen}
                />
              </div>
            ))}
        </div>
      </Panel>
    </Collapse>
  );
};

export default Collapsible;
