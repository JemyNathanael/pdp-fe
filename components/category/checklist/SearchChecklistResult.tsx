import {
  IconDefinition,
  faFile,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFileWord,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SearchChecklistResult = ({searchResults }) => {
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

  const handleResultClick = (result) => {
    const checklistId = result.value;
    const checklistElement = document.getElementById(`${checklistId}`);
    if (checklistElement) {
      const navbarHeight = 10;
      const paddingAdjustment = -95;
      const targetScrollPosition = checklistElement.getBoundingClientRect().top + window.scrollY - navbarHeight + paddingAdjustment;

      window.scrollTo({
        top: targetScrollPosition,
        behavior: "smooth",
      });
      // Add Tailwind CSS classes for background color change and fade in
      checklistElement.classList.add("bg-gray-300", "ease-in", "duration-1000", "bg-opacity-0");

      // Remove fade in class after a short delay
      setTimeout(() => {
        checklistElement.classList.remove("bg-opacity-0");
      }, 100);

      // Remove the classes after 5 seconds for a smoother fade out
      setTimeout(() => {
        checklistElement.classList.add("bg-opacity-0");
      }, 4000); // Use a longer delay if you want a slower fade out

      setTimeout(() => {
        checklistElement.classList.remove("bg-gray-300", "ease-in", "duration-1000", "bg-opacity-0");
      }, 5000); // 5-second total duration
    }
  }
  // console.log(router)
  return (
    <div className='fixed z-10 bg-white rounded-b-3xl overflow-hidden shadow-lg overflow-y-scroll' 
        style={{ width: containerWidth, maxHeight: '550px' }}>
      {searchResults?.map((result) => (
        <div 
          className='flex flex-col py-3 border-b' 
          key={`${result.value}-${result.label}`}>
            <div className="hover:bg-gray-200 cursor-pointer rounded-lg mx-3 px-2 py-1"
              onClick={() => handleResultClick(result)}>
              <p className='text-lg text-gray-800'>{result.label.length > 150 ? `${result.label.slice(0, 120)}...` : result.label}</p>
            </div>
            {result.blobDatas?.map((blobData) => (
              <div className="flex flex-col px-5 py-1" key={blobData.blobId}>
                    <Link href={`${router.asPath}/ChecklistFiles?id=${result.value}&highlightBlob=${blobData.blobId}`}
                      className="rounded-lg px-2 py-1 hover:bg-gray-200 text-lg mx-5">
                        <FontAwesomeIcon icon={extensionToIcon(getFileExtension(blobData.fileName))} className="mr-2" color="blue" />
                        <span className="text-black">{blobData.fileName}</span>
                    </Link>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
  

}

export default SearchChecklistResult;