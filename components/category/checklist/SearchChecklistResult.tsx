import {
  IconDefinition,
  faFile,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFileWord,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const SearchChecklistResult = ({searchResults}) => {
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
  useEffect(() => {
    const handleResize = () => {
        setContainerWidth(calculateWidth());
    };

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  function extensionToIcon(fileExtension: string): IconDefinition {
    if (fileExtension === "pdf") {
      return faFilePdf;
    } else if (fileExtension === "png") {
      return faFileImage;
    } else if (fileExtension === "xlx" || fileExtension === "xlsx") {
      return faFileExcel;
    } else if (fileExtension === "doc" || fileExtension === "docx") {
      return faFileWord;
    } else {
      return faFile;
    }
  }

  const getFileExtension = (filename) => {
    const parts = filename.split(".");
    return parts.length > 1 ? parts[parts.length - 1] : "";
  }
  
  const handleClick = (result) => {
    console.log("asdkasdkasddas", result);
  }
  // console.log("ini halaman search checklist, ", searchResults);
  return (
    <div className='fixed z-10 bg-white rounded-b-3xl overflow-hidden shadow-lg' style={{ width: containerWidth }}>
      {searchResults?.map((result) => (
        <div 
          className='flex flex-col py-3 border-b' 
          key={`${result.value}-${result.label}`} 
          onClick={() => handleClick(result)}>
            <div className="hover:bg-gray-200 cursor-pointer rounded-lg mx-3 px-2 py-1">
              <p className='text-lg text-gray-800'>{result.label.length > 150 ? `${result.label.slice(0, 120)}...` : result.label}</p>
            </div>
            {result.blobDatas?.map((blobData) => (
              <div className="flex flex-col px-5 py-1" key={blobData.blobId}>
                <div className="mx-5">
                  <p className='text-lg text-gray-800 cursor-pointer hover:bg-gray-200 px-2 rounded-lg'>
                    <FontAwesomeIcon icon={extensionToIcon(getFileExtension(blobData.fileName))} className="mr-2" color="blue" />
                    {blobData.fileName}
                  </p>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
  

}

export default SearchChecklistResult;