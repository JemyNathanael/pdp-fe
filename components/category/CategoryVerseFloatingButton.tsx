import React, { useState } from "react";
import { ConfigProvider, FloatButton } from "antd";
import AddSubCategoryModal from "./AddSubCategoryModal";
import UpdateSubCategoryModal from "./UpdateSubCategoryModal";
import DeleteSubCategoryModal from "./DeleteSubCategoryModal";
import {
  faArrowsRotate,
  faBars,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";

interface CategoryVerseFloatingButtonProps {
  categoryId: string;
}

export const CategoryVerseFloatingButton: React.FC<
  CategoryVerseFloatingButtonProps
> = ({ categoryId }) => {
  const [isAddSubCategoryModalOpen, setIsAddSubCategoryModalOpen] =
    useState(false);
  const [isUpdateSubCategoryModalOpen, setIsUpdateSubCategoryModalOpen] =
    useState(false);
  const [isDeleteSubCategoryModalOpen, setIsDeleteSubCategoryModalOpen] =
    useState(false);
  const [backdropVisible, setBackdropVisible] = useState<boolean>(false);
  const [floatButtonGroupVisible, setFloatButtonGroupVisible] =
    useState<boolean>(true);

  const canSeeHamburger = ["Admin", "Reader"];
  const { data: session } = useSession();
  const role = session?.user?.["role"][0];

  const handleBackdrop = () => {
    setBackdropVisible(!backdropVisible);
  };

  const handleUpdateSubCategoryClick = () => {
    setIsUpdateSubCategoryModalOpen(true);
    setFloatButtonGroupVisible(false);
  };

  const handleAddSubCategoryClick = () => {
    setIsAddSubCategoryModalOpen(true);
    setFloatButtonGroupVisible(false);
  };

  const handleDeleteSubCategoryClick = () => {
    setIsDeleteSubCategoryModalOpen(true);
    setFloatButtonGroupVisible(false);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#3788FD",
        },
      }}
    >
      {canSeeHamburger.includes(role) && (
        <div onClick={handleBackdrop}>
          {/* Always visible part */}
          <FloatButton
            type="primary"
            style={{ right: 50, zIndex: 11 }}
            icon={<FontAwesomeIcon icon={faBars} />}
          />

          {floatButtonGroupVisible && (
            <FloatButton.Group
              trigger="click"
              type="primary"
              style={{ right: 50, zIndex: 11 }}
              icon={<FontAwesomeIcon icon={faBars} />}
            >
              <>
                <span
                  style={{
                    zIndex: 0,
                    position: "absolute",
                    width: "200px",
                    right: "0",
                    top: "6px",
                    fontWeight: "bolder",
                    color: "white",
                  }}
                  onClick={handleUpdateSubCategoryClick}
                >
                  Update Sub-Category
                </span>
                <FloatButton
                  className="z-[1]"
                  type="primary"
                  icon={<FontAwesomeIcon icon={faArrowsRotate} />}
                  onClick={handleUpdateSubCategoryClick}
                />
              </>
              <>
                <span
                  style={{
                    zIndex: 0,
                    position: "absolute",
                    width: "180px",
                    right: "0",
                    top: "62px",
                    fontWeight: "bolder",
                    color: "white",
                  }}
                  onClick={handleAddSubCategoryClick}
                >
                  Add Sub-Category
                </span>
                <FloatButton
                  className="z-[1]"
                  type="primary"
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={handleAddSubCategoryClick}
                />
              </>
              <>
                <span
                  style={{
                    zIndex: 0,
                    position: "absolute",
                    width: "100px",
                    right: "0",
                    top: "120px",
                    fontWeight: "bold",
                    color: "white",
                  }}
                  onClick={handleDeleteSubCategoryClick}
                >
                  Delete
                </span>
                <FloatButton
                  className="z-[1]"
                  type="primary"
                  icon={<FontAwesomeIcon icon={faMinus} />}
                  onClick={handleDeleteSubCategoryClick}
                />
              </>
            </FloatButton.Group>
          )}
        </div>
      )}

      {backdropVisible && (
        <div
          className="h-screen w-screen fixed p-0 backdrop-blur bg-black/20"
          style={{ left: 300, top: 65, zIndex:1 }}
          onClick={handleBackdrop}
        ></div>
      )}

      <AddSubCategoryModal
        isModalOpen={isAddSubCategoryModalOpen}
        setIsModalOpen={(value) => {
          setIsAddSubCategoryModalOpen(value);
          setFloatButtonGroupVisible(true);
        }}
        categoryId={categoryId}
      />
      <UpdateSubCategoryModal
        isModalOpen={isUpdateSubCategoryModalOpen}
        setIsModalOpen={(value) => {
          setIsUpdateSubCategoryModalOpen(value);
          setFloatButtonGroupVisible(true);
        }}
        categoryId={categoryId}
      />
      <DeleteSubCategoryModal
        isModalOpen={isDeleteSubCategoryModalOpen}
        setIsModalOpen={(value) => {
          setIsDeleteSubCategoryModalOpen(value);
          setFloatButtonGroupVisible(true);
        }}
        categoryId={categoryId}
      />
    </ConfigProvider>
  );
};
