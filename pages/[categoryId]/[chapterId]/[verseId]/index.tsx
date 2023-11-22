import React, { useEffect, useState } from 'react';
import { Title } from '../../../../components/Title';
import { Page } from '../../../../types/Page';
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { CategoryVerseContent } from '@/components/category/CategoryVerseContent';
import { CategoryButton } from '@/components/category/CategoryButton';
import { Authorize } from '@/components/Authorize';
import { useRouter } from 'next/router';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR from 'swr';
import { BackendApiUrl, GetChecklistList } from '@/functions/BackendApiUrl';
import { DefaultOptionType } from 'antd/es/select';
import { useSession } from 'next-auth/react';

interface ChecklistList {
    id: string;
    description: string;
    uploadStatusId: number;
    blobList: string[];
}

interface ChecklistModel {
    successStatus: boolean;
    checklistList: ChecklistList[];
}

interface UploadStatusDropdownModel {
    id: number;
    status: string;
}

const VersePage: Page = () => {

    const router = useRouter();
    const verseId = router.query['verseId']?.toString() ?? '';
    const [checklist, setChecklist] = useState<ChecklistList[]>()
    const [uploadStatusDropdown, setUploadStatusDropdown] = useState<DefaultOptionType[]>()

    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data: checklistData } = useSWR<ChecklistModel>(GetChecklistList(verseId), swrFetcher);
    const { data: dropdownUploadStatusData } = useSWR<UploadStatusDropdownModel[]>(BackendApiUrl.getUploadStatus, swrFetcher);

    const canEditUploadStatusRole = ['Admin', 'Auditor'];
    const { data: session } = useSession();
    const role = session?.user?.['role'][0];

    const isRoleGrantedEditUploadStatus = canEditUploadStatusRole.includes(role) ? true : false;

    useEffect(() => {
        // map upload status dropdown from API to DefaultOptionType from ant design
        const uploadStatusDropdownMap = dropdownUploadStatusData?.map((currentStatus) => {
            const tempDropdown: DefaultOptionType = {
                label: currentStatus.status,
                value: currentStatus.id
            }
            return tempDropdown;
        })

        setUploadStatusDropdown(uploadStatusDropdownMap);
        setChecklist(checklistData?.checklistList);
    }, [checklistData?.checklistList, dropdownUploadStatusData])

    // May need adjustment after integration
    function removeFileFromChecklist(checklistIndex: number, fileIndex: number) {
        if (checklist) {
            // Iterate every checklist, store it in tmpChecklist
            const tempChecklist = checklist.map((checklist, cIndex) => {
                // on every checklist iteration, filter out the removed file
                const tempFiles = checklist.blobList?.filter((files, fIndex) => {
                    if (cIndex !== checklistIndex || fIndex !== fileIndex) {
                        return true;
                    } else {
                        return false;
                    }
                })
                // return the new checklist with the filtered out files
                const newChecklist: ChecklistList = {
                    id: checklist.id,
                    description: checklist.description,
                    uploadStatusId: checklist.uploadStatusId,
                    blobList: tempFiles,
                }
                return newChecklist
            })
            // set the checklist state with the new checklist
            setChecklist(tempChecklist);
        }
    }

    return (
        <Authorize>
            <Title>Ayat</Title>
            <div className='mb-10 bg-red-50'>
                {(checklist && uploadStatusDropdown) &&
                    checklist.map((checklist, i) =>
                        <div key={i} className='mb-16'>
                            <CategoryVerseContent
                                checklistId={checklist.id}
                                title={checklist.description}
                                uploadStatus={checklist.uploadStatusId}
                                blobList={checklist.blobList}
                                removeFileFromChecklist={removeFileFromChecklist}
                                checklistIndex={i}
                                dropdownOptions={uploadStatusDropdown}
                                canUpdateStatus={isRoleGrantedEditUploadStatus}
                            />
                        </div>
                    )
                }
            </div>
            <div className='flex flex-row-reverse mr-5'>
                <CategoryButton text='Save' className='px-10' />
            </div>
        </Authorize>
    );
}

VersePage.layout = WithCategoryLayout;
export default VersePage;
