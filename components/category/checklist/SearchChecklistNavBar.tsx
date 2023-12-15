import { BackendApiUrl } from "@/functions/BackendApiUrl";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const SearchChecklistNavBar = ({setSearchResults, searchResults}) => {
    // console.log('🔥🔥')
    // // console.log(searchResults);
    // console.log(setSearchResults);
const [input, setInput] = useState<string>('');
const inputRef = useRef<HTMLInputElement>(null);
const swrFetcher = useSwrFetcherWithAccessToken();
const router = useRouter();
const secondSubCategoryId = router.query['verseId'];
// console.log(secondSubCategoryId);

const handleChange = (value: string) => {
    setInput(value);
    handleSearch(value);
}

// console.log(searchResults);
const handleSearch = async (value: string) => {
    const searchApiUrl = `${BackendApiUrl.getChecklistSearch}?search=${value}&secondSubCategoryId=${secondSubCategoryId}`;
    // console.log(searchApiUrl);
    try {
        if (value == '') {
            setSearchResults([]);
        }
        else {
            const response = await swrFetcher(searchApiUrl);
            // console.log(response);
            const options = response?.map((item) => ({
                value: item.checklistId,
                label: (item.description.length > 100) ? `${item.description.slice(0, 100)}...` : item.description,
                blobDatas: item.blobDatas,
            }));
            // console.log(options);
            console.log(options);
            setSearchResults(options);
            // console.log(input);
        }
    }
    catch (error) {
        console.log(error);
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
const [containerWidth, setContainerWidth] = useState(calculateInputWidth());
useEffect(() => {
    const handleResize = () => {
        setContainerWidth(calculateInputWidth());
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, [setSearchResults]);

return (
    <div className="relative w-full">
            <input
                ref={inputRef}
                placeholder="Search Checklist Description or File Name"
                className={`py-4 px-5 rounded-3xl text-black outline-none w-full ${searchResults.length === 0 ? '' : 'rounded-b-none'
                    }`}
                onChange={(e) => handleChange(e.target.value)}
                style={{ paddingRight: '40px', width: containerWidth }}
                value={input}
            />
            <FontAwesomeIcon
                icon={faSearch}
                className='absolute right-3 top-4'
                style={{ marginRight: '8px', color: 'gray', fontSize: '1.3rem' }}
            />
        </div>
)};

export default SearchChecklistNavBar;