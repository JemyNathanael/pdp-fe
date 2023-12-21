import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useState, useEffect } from 'react';

const SearchSubCategoryResultNav = ({ searchResults }) => {
    // console.log(searchResults);

    const calculateWidth = () => {
        const viewportWidth = window.innerWidth;
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
    // console.log(router.query['categoryId']);
    return (
        <div className='fixed z-10 bg-white rounded-b-3xl overflow-hidden shadow-lg'
            style={{ width: containerWidth }}>
            {searchResults?.map((result) => (
                <div className='flex flex-col px-5 py-3 border-b hover:bg-gray-200 cursor-pointer'
                    key={`${result.value}`}>
                    <Link href={`/${router.query['categoryId']}/${router.query['chapterId']}/${result.value}`}>
                        {result.label}
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default SearchSubCategoryResultNav