import { useRouter } from 'next/router';
import React from 'react';
import { useState, useEffect } from 'react';

const SearchResultNav = ({ onClick, searchResults }) => {
    // console.log(searchResults);

    const calculateWidth = () => {
        const viewportWidth = 1920;
        if (viewportWidth >= 1300) {
            return '670px';
        } else if (viewportWidth <= 775) {
            return '300px';
        }
        else {
            const ratio = (viewportWidth - 1200) / (1200 - 800);
            const width = 600 + (250 * ratio);
            return `${width}px`;
        }
    };

    const [containerWidth, setContainerWidth] = useState(calculateWidth());
    const router = useRouter();

    useEffect(() => {
        const handleResize = () => {
            setContainerWidth(calculateWidth());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    const handleClick = async (result) => {
        // console.log("console log di category search", result);
        if (result.type == 'Category') {
            // <Link href={`/${result.value}`}/>
            onClick(`/${result.value}`);
            await delay(500);
            router.push(`/${result.value}`);
        }
        else if (result.type == 'First Sub-Category') {
            // <Link href={`/${result.value}/${result.firstSubCategoryId}`} />
            // window.location.href = `/${result.value}/${result.firstSubCategoryId}`;
            onClick(`/${result.value}/${result.firstSubCategoryId}`);
            await delay(500);
            router.push({
                pathname: `/${result.value}/${result.firstSubCategoryId}`,
                query: { query: `/${result.value}/${result.firstSubCategoryId}`},
            },`/${result.value}/${result.firstSubCategoryId}`)
        }
        if (result.type == 'Second Sub-Category') {
            // <Link href={`/${result.value}/${result.firstSubCategoryId}/${result.secondSubCategoryId}`} />
            // window.location.href = `/${result.value}/${result.firstSubCategoryId}/${result.secondSubCategoryId}`;
            await delay(500);
            router.push({
                pathname: `/${result.value}/${result.firstSubCategoryId}/${result.secondSubCategoryId}`,
                query: { query: `/${result.value}/${result.firstSubCategoryId}/${result.secondSubCategoryId}` },
            }, `/${result.value}/${result.firstSubCategoryId}/${result.secondSubCategoryId}`);
            // router.push(`/${result.value}/${result.firstSubCategoryId}/${result.secondSubCategoryId}`);
            // onClick(`/${result.value}/${result.firstSubCategoryId}/${result.secondSubCategoryId}`);
        }
    }
    // console.log("ini halaman search category, ", searchResults);

    return (
        <div className='fixed z-10 bg-white rounded-b-3xl overflow-hidden shadow-lg'
            style={{ width: containerWidth }}>
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