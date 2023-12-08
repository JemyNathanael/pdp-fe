import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { BackendApiUrl } from "@/functions/BackendApiUrl";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

const SearchBarNavs = ({setSearchResults}) => {
    const [input, setInput] = useState<string>('');
    const swrFetcher = useSwrFetcherWithAccessToken();

    const handleSearch = async (value: string) => {
        const searchApiUrl = `${BackendApiUrl.getHomeSearch}?search=${value}`;
        if(value != '') {
            try {
                const response = await swrFetcher(searchApiUrl);
                const options = response?.map((item) => ({
                    value: item.id, 
                    label: item.title, 
                    type: item['type'],
                    firstSubCategoryId: item['firstSubCategoryId'],
                    secondSubCategoryId: item['secondSubCategoryId'],
                }));
                setSearchResults(options);
                // console.log(options);
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    const handleChange = (e) => {
        setInput(e.target.value);
        handleSearch(input);
    }

    return (
        <div className="relative">
            <input placeholder='Search' 
                className='py-4 px-5 rounded-full text-black w-96 outline-none' 
                onChange={handleChange}
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