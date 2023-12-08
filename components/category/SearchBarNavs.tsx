import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { BackendApiUrl } from "@/functions/BackendApiUrl";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

const SearchBarNavs = ({setSearchResults, searchResults}) => {
    const [input, setInput] = useState<string>('');
    const swrFetcher = useSwrFetcherWithAccessToken();

    const handleSearch = async (value: string) => {
        const searchApiUrl = `${BackendApiUrl.getHomeSearch}?search=${value}`;
        try {
            if(value == '')
            {
                setSearchResults([]);
            }
            else{
                const response = await swrFetcher(searchApiUrl);
                const options = response?.map((item) => ({
                    value: item.id, 
                    label: item.title, 
                    type: item['type'],
                    firstSubCategoryId: item['firstSubCategoryId'],
                    secondSubCategoryId: item['secondSubCategoryId'],
                }));
                setSearchResults(options);
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

    return (
        <div className="relative">
            <input placeholder='Search' 
                className={`py-4 px-5 rounded-3xl text-black w-96 outline-none ${
                    searchResults.length === 0 ? '' : 'rounded-b-none'
                }`}
                onChange={(e) => handleChange(e.target.value)}
            />
            <FontAwesomeIcon
                icon={faSearch}
                className='absolute right-3 top-4'
                style={{ color: 'gray', fontSize: '1.3rem'}}
            />
        </div>
    );
}

export default SearchBarNavs