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
        try {
            const response = await swrFetcher(searchApiUrl);
            const options = response?.map((item) => ({value: item.id, label: item.title, type: item.type}));
            console.log(options);
            setData(options || []);
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleChange = (newValue: string) => {
        setValue(newValue);
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
            options={(data || []).map((d) => ({ 
                label: d.label,
                value: d.value,
            }))}
        />
    )
} 

export default SearchBarNav;
