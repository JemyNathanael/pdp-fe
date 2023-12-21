import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { BackendApiUrl } from "@/functions/BackendApiUrl";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

const SearchSubCategoryNavBar = ({ setSearchResults, searchResults }) => {
    const [input, setInput] = useState<string>('');
    const [inputResize, setInputResize] = useState<string>('670px');
    const swrFetcher = useSwrFetcherWithAccessToken();
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const firstSubCategoryId = router.query['chapterId'];

    const handleSearch = async (value: string) => {
        const searchApiUrl = `${BackendApiUrl.getSubCategorySearch}?search=${value}&categoryId=${firstSubCategoryId}`;
        try {
            if (value == '') {
                setSearchResults([]);
            }
            else {
                const response = await swrFetcher(searchApiUrl);
                const options = response?.map((item) => ({
                    value: item.id,
                    label: item.title,
                }));
                setSearchResults(options);
                console.log(options);
                console.log(input);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    const handleChange = (value: string) => {
        setInput(value);
        handleSearch(value);
    }


    const calculateInputWidth = () => {
        const viewportWidth = window.innerWidth;
        if (viewportWidth >= 1300) {
            return '670px';
        }
        else if (viewportWidth <= 775) {
            return '300px';
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
                placeholder="Search"
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
    );
}

export default SearchSubCategoryNavBar;