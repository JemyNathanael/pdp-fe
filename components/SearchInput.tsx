import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "antd";

export default function SearchInput({ onSearch, placeholder }) {
    return (
        <div>
            <div className="my-5">
                    <div className="w-80">
                        <Input
                            className="text-center border border-[#A3A3A3] rounded"
                            onChange={onSearch}
                            placeholder={placeholder}
                            suffix={<FontAwesomeIcon className="px-2" icon={faMagnifyingGlass} color="#A3A3A3" />}
                        />
                    </div>
                </div>
            </div>
    );
}

