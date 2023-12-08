import React from 'react';

const SearchResultNav = ({searchResults}) => {
    // console.log(searchResults);
    const handleClick = (result) => {
        console.log(result);
        if(result.type == 'Category') {
            // <Link href={`/${result.value}`}/>
            window.location.href = `/${result.value}`;
        } 
        else if(result.type == 'First Sub-Category') {
            // <Link href={`/${result.value}/${result.firstSubCategoryId}`} />
            window.location.href = `/${result.value}/${result.firstSubCategoryId}`;
        }
        if(result.type == 'Second Sub-Category') {
            // <Link href={`/${result.value}/${result.firstSubCategoryId}/${result.secondSubCategoryId}`} />
            window.location.href = `/${result.value}/${result.firstSubCategoryId}/${result.secondSubCategoryId}`;
        }
    }

    return (
        <div className='w-96 fixed z-10 bg-white rounded-b-3xl overflow-hidden shadow-lg'>
            {searchResults?.map((result) => (
                <div className='flex flex-col px-5 py-3 border-b hover:bg-gray-200 cursor-pointer' 
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