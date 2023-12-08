import React from 'react';

const SearchResultNav = ({searchResults}) => {
    console.log(searchResults);
    const handleClick = (result) => {
        console.log(result);
        if(result.type == 'Category') {
            window.location.href = `/${result.value}`;
        } 
        else if(result.type == 'First Sub-Category') {
            window.location.href = `/${result.value}/${result.firstSubCategoryId}`;
        }
        if(result.type == 'Second Sub-Category') {
            window.location.href = `/${result.value}/${result.firstSubCategoryId}/${result.secondSubCategoryId}`;
        }
    }

    return (
        <div className='w-full bg-white flex rounded-full flex-col overflow-y-scroll'>
            {searchResults?.map((result) => (
                <div className='flex flex-col px-5 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100' 
                    key={`${result.value}-${result.label}`}
                    onClick={() => handleClick(result)}
                >
                    <p className='text-lg text-gray-800'>{result.label}</p>
                </div>
            ))}
        </div>
    )
}

export default SearchResultNav