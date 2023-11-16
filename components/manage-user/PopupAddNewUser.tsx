import React, { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

interface PopupAddNewUserProps {
    onGoToHome: () => void;
}

const PopupAddNewUser: FC<PopupAddNewUserProps> = ({ onGoToHome }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-10 bg-secondary-100 backdrop-filter backdrop-blur-md" onClick={onGoToHome}>
            <div className="flex flex-col p-6 sm:p-12 border items-center justify-center">
                <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#4f7471", fontSize: "64px", marginBottom: "8px" }} />
                <div className="w-full h-4 sm:h-8" />
                <h3 className="text-xl sm:text-2xl text-accent-100 font-body font-bold mt-4 sm:mt-6 mb-4 sm:mb-8">Successfully Added a New User!</h3>
            </div>
        </div>
    );
};

export default PopupAddNewUser;
