import { IconDefinition, faFile, faFileExcel, faFileImage, faFilePdf, faFileWord, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const SearchChecklistResult = ({searchResults}) => {   
    // console.log(searchResults);
    const calculateWidth = () => {
        const viewportWidth = window.innerWidth;
        if (viewportWidth >= 1300) {
            return '670px';
        } else if (viewportWidth <= 775) {
            return '320px';
        } 
        else {
            const ratio = (viewportWidth - 1200) / (1200 - 800);
            const width = 600 + (250 * ratio);
            return `${width}px`;
        }
    };
    const [containerWidth, setContainerWidth] = useState(calculateWidth());
    function extensionToIcon(fileExtension: string): IconDefinition {
        if (fileExtension === 'pdf') {
            return faFilePdf;
        } else if (fileExtension === 'png') {
            return faFileImage;
        } else if (fileExtension === 'xlx' || fileExtension === 'xlsx') {
            return faFileExcel;
        } else if (fileExtension === 'doc' || fileExtension === 'docx') {
            return faFileWord;
        } else {
            return faFile
        }
    }
    const getFileExtension = (filename) => {    
        const parts = filename.split('.');
        return parts.length > 1 ? parts[parts.length - 1] : '';
    }

    useEffect(() => {
        const handleResize = () => {
            setContainerWidth(calculateWidth());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // console.log(searchResults)

    const handleClick = (result) => {
        console.log(result);
    }
    return (
        <div className='fixed z-10 bg-white rounded-b-3xl overflow-hidden shadow-lg'
          style={{ width: containerWidth }}>
          {searchResults?.map((result) => (
            <>
                <div className="border">
                    <div className='flex flex-col px-5 py-2'
                    key={`${result.value}-${result.label}`}
                    onClick={() => handleClick(result)}>
                        <div className="cursor-pointer hover:bg-gray-200 px-3 py-1 rounded-lg">
                            <p className='text-lg text-gray-800'>{result.label}</p>     
                        </div>
                    </div>
                    {result.blobDatas?.map((blobData) => (
                        <div className='flex flex-col px-12'
                        key={`${result.value}-${result.label}-${blobData.blobName}`}
                        onClick={() => handleClick(result)}>
                            <div className="py-1">
                                <div className="absolute top left mt-1">
                                    <FontAwesomeIcon icon={faArrowRight}/>
                                    <FontAwesomeIcon className='text-[#3788FD] text-[20px] mx-3' 
                                        icon={extensionToIcon(getFileExtension(blobData.fileName))} />
                                </div>
                                <div className="">
                                    <p className='text-lg text-gray-800 ml-11 cursor-pointer hover:bg-gray-200 rounded-md px-1'>{blobData.fileName}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
          ))}
        </div>
      );

}

export default SearchChecklistResult;