import React from 'react';
import { Modal } from 'antd';
import { GetInformation } from '@/functions/BackendApiUrl';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR from 'swr';

interface InformationModalProps {
    onCancel: () => void;
    visible: boolean;
    categoryId: string;
}

interface InformationModel {
    id: string,
    title: string,
    description?: string,
    verses: {
        id: string,
        title: string,
        description: string,
    }[]
}


const InformationModal: React.FC<InformationModalProps> = ({ onCancel, visible, categoryId }) => {

    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data: informationData } = useSWR<InformationModel[]>(GetInformation(categoryId), swrFetcher);

    return (
        <>
            <Modal
                open={visible}
                centered
                mask={false}
                onCancel={onCancel}
                footer={null}
            >
                <div className='p-5'>
                    {informationData && informationData.map((info, i) =>
                        <div key={i}>
                            <h4 className='text-md sm:text-lg font-body font-bold mb-2 sm:mb-3'>
                                {info.title}
                            </h4>
                            <p className='sm:text-md font-body mb-2 sm:mb-3'>{info.description}</p>
                            <ol type="1" className='sm:text-md font-body mb-2 sm:mb-3'>
                                {info.verses?.map((verse, q) =>
                                    <>
                                        <li key={`${i}-${q}`}> {`(${q + 1})  ${verse.description}`}</li>
                                    </>
                                )}

                            </ol>
                        </div>
                    )
                    }
                </div>
            </Modal>
        </>

    );
};

export default InformationModal;