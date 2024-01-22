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

const SearchFileResult = ({ searchResults }) => {
  const calculateWidth = () => {
    const viewportWidth = window.innerWidth;
    if (viewportWidth >= 1300) {
      return "670px";
    } else if (viewportWidth <= 775) {
      return "320px";
    } else {
      const ratio = (viewportWidth - 1200) / (1200 - 800);
      const width = 600 + 250 * ratio;
      return `${width}px`;
    }
  };
  const [containerWidth, setContainerWidth] = useState(calculateWidth());
  const router = useRouter();
  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(calculateWidth());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
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
  };

  return (
    <div
      className="fixed z-10 bg-white rounded-b-3xl overflow-hidden shadow-lg overflow-y-scroll"
      style={{ width: containerWidth, maxHeight: "550px" }}
    >
      {searchResults?.map((result) => (
        <div
          className="flex flex-col py-3 border-b mx-3 "
          key={`${result.value}-${result.label}`}
        >
          <Link
            className="hover:bg-gray-200 cursor-pointer py-2 text-lg rounded-lg px-2"
            href={{
              pathname: `/${router.query["categoryId"]}/${router.query["chapterId"]}/${router.query["verseId"]}/ChecklistFiles`,
              query: {
                id: router.query["id"],
                highlightBlob: result.value,
              },
            }}
          >
            <FontAwesomeIcon
              icon={extensionToIcon(getFileExtension(result.label))}
              className="mr-2 mt-1"
              color="blue"
            />
            <span className="text-black">{result.label}</span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SearchFileResult;
