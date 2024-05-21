import { Authorize } from "@/components/Authorize";
import { Form, Input, Row, } from 'antd';
import { BackendApiUrl } from "@/functions/BackendApiUrl";
import { Title } from '@/components/Title';
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { Page } from "@/types/Page";
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { useRouter } from "next/router";
import useSWR from 'swr';

interface RopaDetail {
    id: string;
    activityName: string;
    activityDetail: string;
    departmentName: string;
    dataOwner: string;
    processingPurpose: string;
    thirdPartyProcessorName: string;
    thirdPartyProcessorEmail: string;
    thirdPartyLinkAgreement: string;
    jointControllerName: string;
    jointControllerEmail: string;
    jointControllerLinkAgreement: string;
    lawfulBasisName: string;
    dataSource: string;
    dataLocation: string;
    thirdCountriesDataTransferred: string;
    thirdCountriesDataTransferSafeGuard: string;
    individualCategoryName: string;
    personalDataCategoryName: string;
    recipientCategoryName: string;
    retentionPeriod: string;
    securityMeasure: string;
    individualAvailableRights: string;
    consentRecordLink: string;
}

const RopaDetail: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data } = useSWR<RopaDetail>(`${BackendApiUrl.getRopaDetail}?Id=${id}`, swrFetcher);

    return (
        <div>
            <Form
                labelCol={{ span: 6, offset: 0 }}
                layout="vertical"
                labelWrap
                labelAlign="left"
                style={{ marginBottom: 55 }}
            >
                <Form.Item className="w-full">
                    <span className="font-bold">Activity Name <span className="text-red-500">*</span></span>
                    <Input disabled value={data?.activityName} className="disabled-input" />
                </Form.Item>

                <Form.Item label="Activity Detail" className="font-bold">
                    <Input.TextArea disabled rows={4} value={data?.activityDetail} className="disabled-input" />
                </Form.Item>

                <div className="flex justify-between">
                    <Form.Item className="w-full mr-5">
                        <span className="font-bold">Department / Business Function <span className="text-red-500">*</span></span>
                        <Input disabled value={data?.departmentName} className="disabled-input" />
                    </Form.Item>
                    <Form.Item className="w-full">
                        <span className="font-bold">Data Owner</span>
                        <Input disabled value={data?.dataOwner} className="disabled-input" />
                    </Form.Item>
                </div>

                <Form.Item label="Purpose of Processing" className="font-bold">
                    <Input.TextArea disabled rows={2} value={data?.processingPurpose} className="disabled-input" />
                </Form.Item>

                <div className="flex justify-between">
                    <Form.Item className="w-full mr-5">
                        <span className="font-bold">Name of 3&apos;rd Party Processor</span>
                        <Input disabled value={data?.thirdPartyProcessorName} className="disabled-input" />
                    </Form.Item>
                    <Form.Item className="w-full mr-5">
                        <span className="font-bold">Email of 3&apos;rd Party Processor</span>
                        <Input disabled value={data?.thirdPartyProcessorEmail} className="disabled-input" />
                    </Form.Item>
                    <Form.Item className="w-full">
                        <span className="font-bold">Link of 3&apos;rd Party Processor</span>
                        <Input disabled value={data?.thirdPartyLinkAgreement} className="disabled-input" />
                    </Form.Item>
                </div>

                <div className="flex justify-between">
                    <Form.Item className="w-full mr-5">
                        <span className="font-bold">Name of Join Controller</span>
                        <Input disabled value={data?.jointControllerName} className="disabled-input" />
                    </Form.Item>
                    <Form.Item className="w-full mr-5">
                        <span className="font-bold">Email of Join Controller</span>
                        <Input disabled value={data?.jointControllerEmail} className="disabled-input" />
                    </Form.Item>
                    <Form.Item className="w-full">
                        <span className="font-bold">Link of Join Controller</span>
                        <Input disabled value={data?.jointControllerLinkAgreement} className="disabled-input" />
                    </Form.Item>
                </div>

                <div className="flex justify-between">
                    <Form.Item className="w-full mr-5">
                        <span className="font-bold">Lawful Basis <span className="text-red-500">*</span></span>
                        <Input disabled value={data?.lawfulBasisName} className="disabled-input" />
                    </Form.Item>
                    <Form.Item className="w-full mr-5">
                        <span className="font-bold">Data Source</span>
                        <Input disabled value={data?.dataSource} className="disabled-input" />
                    </Form.Item>
                    <Form.Item className="w-full">
                        <span className="font-bold">Data Location</span>
                        <Input disabled value={data?.dataLocation} className="disabled-input" />
                    </Form.Item>
                </div>

                <Form.Item className="w-full">
                    <span className="font-bold">Names of 3&apos;rd Countries that Personal Data are Transferred to</span>
                    <Input disabled value={data?.thirdCountriesDataTransferred} className="disabled-input" />
                </Form.Item>

                <Form.Item className="w-full">
                    <span className="font-bold">Safeguards for Exceptional Transfer of Personal Data to 3rd Countries</span>
                    <Input disabled value={data?.thirdCountriesDataTransferSafeGuard} className="disabled-input" />
                </Form.Item>

                <Form.Item label="Categories of individuals" className="font-bold">
                    <Input disabled value={data?.individualCategoryName} className="disabled-input" />
                </Form.Item>

                <div className="flex justify-between">
                    <Form.Item className="w-full mr-5">
                        <span className="font-bold">Categories of Personal Data</span>
                        <Input disabled value={data?.personalDataCategoryName} className="disabled-input" />
                    </Form.Item>
                    <Form.Item className="w-full">
                        <span className="font-bold">Categories of Recipient</span>
                        <Input disabled value={data?.recipientCategoryName} className="disabled-input" />
                    </Form.Item>
                </div>

                <div className="flex justify-between">
                    <Form.Item className="w-full mr-5">
                        <span className="font-bold">Retention Period</span>
                        <Input disabled value={data?.retentionPeriod} className="disabled-input" />
                    </Form.Item>
                    <Form.Item className="w-full">
                        <span className="font-bold">Security Measures</span>
                        <Input disabled value={data?.securityMeasure} className="disabled-input" />
                    </Form.Item>
                </div>

                <div className="flex justify-between">
                    <Form.Item className="w-full mr-5">
                        <span className="font-bold">Rights Available to Individuals</span>
                        <Input disabled value={data?.individualAvailableRights} className="disabled-input" />
                    </Form.Item>
                    <Form.Item className="w-full">
                        <span className="font-bold">Link to Record of Consent</span>
                        <Input disabled value={data?.consentRecordLink} className="disabled-input" />
                    </Form.Item>
                </div>
            </Form>

            <div className="fixed bottom-0 left-0 right-0 bg-gray-100">
                <hr style={{ margin: '20px 0' }} />
                <div className='flex justify-end px-5 py-3'>
                    <button className={`bg-[#3788FD] text-white px-5 py-2 rounded w-[100px]'} mr-5`} onClick={() => router.push(`/${router.query['categoryId']}/RopaList/${id}/editRopa`)}>Edit</button>
                    <button className={`bg-[#3788FD] text-white px-5 py-2 rounded w-[100px]'} mr-2`} onClick={() => router.push(`/${router.query['categoryId']}/RopaList`)}>Return to List</button>
                </div>
            </div>
        </div>
    );
}

const RopaDetailPage: Page = () => {
    return (
        <Authorize>
            <Title>ROPA List</Title>
            <div>
                <Row className="mb-4">
                    <p className="text-base font-semibold text-gray-500"> (ROPA) Record of Processing Activity / ROPA List</p>
                    <p className="text-base font-semibold text-blue-500 ml-1"> / Detail</p>
                </Row>
                <RopaDetail></RopaDetail>
            </div>
        </Authorize>
    );
}

RopaDetailPage.layout = WithCategoryLayout;
export default RopaDetailPage;