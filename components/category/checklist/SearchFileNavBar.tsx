import { BackendApiUrl } from "@/functions/BackendApiUrl";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const SearchFileNavBar = ({setSearchResults, searchResults}) => {
const [input, setInput] = useState<string>('');
const [inputResize, setInputResize] = useState<string>('670px');
const inputRef = useRef<HTMLInputElement>(null);
const swrFetcher = useSwrFetcherWithAccessToken();
const router = useRouter();
const checklistId = router.query['id'];

const handleChange = (value: string) => {
    setInput(value);
    handleSearch(value);
}

const handleSearch = async (value: string) => {
    const searchApiUrl = `${BackendApiUrl.getChecklistFileSearch}?search=${value}&checklistId=${checklistId}`;
    // console.log(searchApiUrl);
    try {
        if (value == '') {
            setSearchResults([]);
        }
        else {
            const response = await swrFetcher(searchApiUrl);
            const options = response?.map((item) => ({
                value: item.blobId,
                label: item.fileName,
            }));
            setSearchResults(options);
            // console.log(options);
        }
    }
    catch (error) {
        setSearchResults([]);
    }
}
const calculateInputWidth = () => {
    const viewportWidth = window.innerWidth;
    if (viewportWidth >= 1300) {
        return '670px';
    }
    else if (viewportWidth <= 775) {
        return '320px';
    }
    else {
        const ratio = (viewportWidth - 1200) / (1200 - 800);
        const width = 600 + (250 * ratio);
        return `${width}px`;
    }
};
useEffect(() => {
    const handleResize = () => {
        setInputResize(calculateInputWidth());
    };
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);
// console.log(searchResults);
useEffect(() => {
    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setSearchResults([]);
        }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
        document.removeEventListener('click', handleClickOutside);
    };
}, [setSearchResults]);

return (
    <div className="relative w-full">
            <input
                ref={inputRef}
                placeholder="Search File Name"
                className={`py-4 px-5 rounded-3xl text-black outline-none w-full ${searchResults.length === 0 ? '' : 'rounded-b-none'
                    }`}
                onChange={(e) => handleChange(e.target.value)}
                style={{ paddingRight: '40px', width: inputResize }}
                value={input}
            />
            <FontAwesomeIcon
                icon={faSearch}
                className='absolute right-3 top-4'
                style={{ marginRight: '8px', color: 'gray', fontSize: '1.3rem' }}
            />
    </div>
)};

export default SearchFileNavBar;