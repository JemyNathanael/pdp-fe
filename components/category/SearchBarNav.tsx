import { BackendApiUrl } from "@/functions/BackendApiUrl";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select, SelectProps } from "antd";
import React, { useState } from 'react';

const SearchBarNav : React.FC<{placeholder: string, style: React.CSSProperties }> = (props) => {
    const [data, setData] = useState<SelectProps['options']>([]);
    const [value, setValue] = useState<string>();
    const swrFetcher = useSwrFetcherWithAccessToken();

    const handleSearch = async (newValue: string) => {
        const searchApiUrl = `${BackendApiUrl.getHomeSearch}?search=${newValue}`;
        if(newValue != '') {
            try {
                const response = await swrFetcher(searchApiUrl);
                const options = response?.map((item) => ({
                    value: item.id, 
                    label: item.title, 
                    type: item['type'],
                    firstSubCategoryId: item['firstSubCategoryId'],
                    secondSubCategoryId: item['secondSubCategoryId'],
                }));
                console.log(options);
                setData(options || []);
            }
            catch (error) {
                console.log(error);
            }
        }
    };

    const handleChange = (newValue: string) => {
        setValue(newValue);
    }

    const handleSelect = (selectedValue, selectedData) => {
        console.log("wtf ", selectedValue);
        console.log("wtf asdsad", selectedData);
        // console.log(data?.map((d) => ({
        //     key: `${d.value}-${d.label}`,
        //     label: d.label,
        //     value: d.value,
        //     type: d['type'],
        //     firstSubCategoryId: d['firstSubCategoryId'],
        //     secondSubCategoryId: d['secondSubCategoryId'],
        //     })) || []);
        if(selectedData.type == 'Category') {
            window.location.href = `/${selectedData.value}`;
        } else if(selectedData.type == 'First Sub-Category') {
            window.location.href = `/${selectedData.key}/${selectedData.value}`;
        }
        if(selectedData.type == 'Second Sub-Category') {
            window.location.href = `/${selectedData.key}/${selectedData.firstSubCategoryId}/${selectedData.value}`;
        }
    }


    return (
        <Select
            style={props.style}
            showSearch
            value={value}
            placeholder={props.placeholder}
            defaultActiveFirstOption={false}
            suffixIcon={<FontAwesomeIcon icon={faSearch} className="cursor-pointer" style={{ fontSize: '20px' }} />}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            onSelect={handleSelect}
            options={(data || []).map((d) => {
                // Jika data yang diselect type Category
                let valueOfType = d.value;
                // Jika data yang diselect type First Sub-Category
                if(d['type'] == 'First Sub-Category') {
                    valueOfType = d['firstSubCategoryId'];
                }
                // Jika data yang diselect type Second Sub-Category
                if(d['type'] == 'Second Sub-Category') {
                    valueOfType = d['secondSubCategoryId'];
                }
                return{
                    key: `${d.value}`, // Ini CategoryId
                    label: d.label,
                    value: valueOfType, // Ini SubCategoryId
                    type: d['type'],
                    firstSubCategoryId: d['firstSubCategoryId'],
                }
            })}
            // options={(data || []).map((d) => ({ 
            //     key: `${d.value}-${d.label}`,
            //     label: d.label,
            //     value: d.value,
            //     type: d['type'],
            //     firstSubCategoryId: d['firstSubCategoryId'],
            //     secondSubCategoryId: d['secondSubCategoryId'],
            // }))}
        />
    )
} 

export default SearchBarNav;
