import { Authorize } from "@/components/Authorize";
import { Button, Form, Input, Row, Select, } from 'antd';
import { BackendApiUrl } from "@/functions/BackendApiUrl";
import { Title } from '@/components/Title';
import { Page } from "@/types/Page";
import { WithCategoryLayout } from '@/components/CategoryLayout';
import { useFetchWithAccessToken } from "@/functions/useFetchWithAccessToken";
import { useRouter } from "next/router";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import useSWR from 'swr';

interface AddRopa {
    activityName: string;
    activityDetail: string;
    departmentId: string;
    dataOwner: string;
    processingPurpose: string;
    thirdPartyProcessorName: string;
    thirdPartyProcessorEmail: string;
    thirdPartyLinkAgreement: string;
    jointControllerName: string;
    jointControllerEmail: string;
    jointControllerLinkAgreement: string;
    lawfulBasisId: string;
    dataSource: string;
    dataLocation: string;
    thirdCountriesDataTransferred: string;
    thirdCountriesDataTransferSafeGuard: string;
    individualCategoryId: string;
    personalDataCategoryId: string;
    recipientCategory: string;
    retentionPeriod: string;
    securityMeasure: string;
    individualAvailableRights: string;
    consentRecordLink: string;
    isPiaNeeded: string;
    piaProgress: string;
}

interface DropdownModel {
    id: number,
    name: string
}

interface Response {
    success: string;
}
const CreateRopa: React.FC = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { fetchPOST } = useFetchWithAccessToken();

    const { data: departments } = useSWR<DropdownModel[]>(BackendApiUrl.getDepartments, swrFetcher);
    const departmentOptions = departments?.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    const { data: personalDataCategories } = useSWR<DropdownModel[]>(BackendApiUrl.getPersonalDataCategories, swrFetcher);
    const personalDataCategoriesOptions = personalDataCategories?.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    const { data: individualCategories } = useSWR<DropdownModel[]>(BackendApiUrl.getIndividualCategories, swrFetcher);
    const individualCategoriesOptions = individualCategories?.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    const { data: recipientCategories } = useSWR<DropdownModel[]>(BackendApiUrl.getRecipientCategoriesDropdown, swrFetcher);
    const recipientCategoriesOptions = recipientCategories?.map((item) => ({
        label: item.name,
        value: item.id,
    }))

    const { data: lawfulBasis } = useSWR<DropdownModel[]>(BackendApiUrl.getLawfulBases, swrFetcher);
    const lawfulBasisOptions = lawfulBasis?.map((item) => ({
        label: item.name,
        value: item.id,
    }));
    
    const onFinish = async (values: AddRopa) => {
        const payload = {
            activityName: values.activityName,
            activityDetail: values.activityDetail,
            departmentId: values.departmentId,
            dataOwner: values.dataOwner,
            processingPurpose: values.processingPurpose,
            thirdPartyProcessorName: values.thirdPartyProcessorName,
            thirdPartyProcessorEmail: values.thirdPartyProcessorEmail,
            thirdPartyLinkAgreement: values.thirdPartyLinkAgreement,
            jointControllerName: values.jointControllerName,
            jointControllerEmail: values.jointControllerEmail,
            jointControllerLinkAgreement: values.jointControllerLinkAgreement,
            lawfulBasisId: values.lawfulBasisId,
            dataSource: values.dataSource,
            dataLocation: values.dataLocation,
            thirdCountriesDataTransferred: values.thirdCountriesDataTransferred,
            thirdCountriesDataTransferSafeGuard: values.thirdCountriesDataTransferSafeGuard,
            individualCategoryId: values.individualCategoryId,
            personalDataCategoryId: values.personalDataCategoryId,
            recipientCategory: values.recipientCategory,
            retentionPeriod: values.retentionPeriod,
            securityMeasure: values.securityMeasure,
            individualAvailableRights: values.individualAvailableRights,
            consentRecordLink: values.consentRecordLink
        };
        const response = await fetchPOST<Response>(BackendApiUrl.createRopa, payload);
        if (response.data) {
            form.resetFields();
            router.push(`/${router.query['categoryId']}/RopaList`)
        }
    };

    return (
        <div>
            <Form
                labelCol={{ span: 16, offset: 0 }}
                layout="vertical"
                labelWrap
                labelAlign="left"
                form={form}
                style={{ marginBottom: 55 }}
                onFinish={onFinish}
            >

                <Form.Item id="activityName" name="activityName"
                    label={<span className="font-bold">Activity Name <span className="text-red-500">*</span></span>}
                    className="w-full font-bold"
                >
                    <Input />
                </Form.Item>
                <Form.Item name="activityDetail" label="Activity Detail" className="font-bold">
                    <Input.TextArea />
                </Form.Item>

                <div className="flex justify-between">
                    <Form.Item name="departmentId" label={<span className="font-bold">Department / Business Function <span className="text-red-500">*</span></span>} className="w-full mr-5">
                        <Select
                            options={departmentOptions}>
                        </Select>
                    </Form.Item>
                    <Form.Item name="dataOwner"label={<span className="font-bold">Data Owner <span className="text-red-500">*</span></span>} className="w-full">
                        <Input />
                    </Form.Item>
                </div>
                <Form.Item name="processingPurpose" label={<span className="font-bold">Purpose of Processing <span className="text-red-500">*</span></span>} className="font-bold">
                    <Input.TextArea rows={2} />
                </Form.Item>

                <div className="flex justify-between">
                    <Form.Item name="thirdPartyProcessorName" label={<span className="font-bold">Name of 3&apos;rd Party Processor</span>} className="w-full mr-5">
                        <Input />
                    </Form.Item>
                    <Form.Item name="thirdPartyProcessorEmail" label={<span className="font-bold">Email of 3&apos;rd Party Processor</span>} className="w-full mr-5">
                        <Input />
                    </Form.Item>
                    <Form.Item name="thirdPartyLinkAgreement" label={<span className="font-bold">Link of 3&apos;rd Party Processor</span>} className="w-full">
                        <Input />
                    </Form.Item>
                </div>

                <div className="flex justify-between">
                    <Form.Item name="jointControllerName" label={<span className="font-bold">Name of Join Controller</span>} className="w-full mr-5">
                        <Input />
                    </Form.Item>
                    <Form.Item name="jointControllerEmail" label={<span className="font-bold">Email of Join Controller</span>} className="w-full mr-5">
                        <Input />
                    </Form.Item>
                    <Form.Item name="jointControllerLinkAgreement" label={<span className="font-bold">Link of Join Controller</span>} className="w-full">
                        <Input />
                    </Form.Item>
                </div>

                <div className="flex justify-between">
                    <Form.Item name="lawfulBasisId" label={<span className="font-bold">Lawful Basis <span className="text-red-500">*</span></span>}className="w-full mr-5">
                        <Select
                            options={lawfulBasisOptions}>
                        </Select>
                    </Form.Item>
                    <Form.Item name="dataSource" label={<span className="font-bold">Data Source</span>} className="w-full mr-5">
                        <Input />
                    </Form.Item>
                    <Form.Item name="dataLocation" label={<span className="font-bold">Data Location</span>} className="w-full">
                        <Input />
                    </Form.Item>
                </div>

                <Form.Item name="thirdCountriesDataTransferred" label={<span className="font-bold">Names of 3&apos;rd Countries that Personal Data are Transferred to</span>} className="w-full">
                    <Input />
                </Form.Item>

                <Form.Item name="thirdCountriesDataTransferSafeGuard" label={<span className="font-bold">Safeguards for Exceptional Transfer of Personal Data to 3rd Countries</span>} className="w-full">
                    <Input />
                </Form.Item>

                <Form.Item name="individualCategoryId" label={<span className="font-bold">Categories of individuals <span className="text-red-500">*</span></span>} className="font-bold">
                    <Select
                        options={individualCategoriesOptions}>
                    </Select>
                </Form.Item>

                <div className="flex justify-between">
                    <Form.Item name="personalDataCategoryId" label={<span className="font-bold">Categories of Personal Data <span className="text-red-500">*</span></span>} className="w-full mr-5">
                        <Select
                            options={personalDataCategoriesOptions}>
                        </Select>
                    </Form.Item>
                    <Form.Item name="recipientCategory" label={<span className="font-bold">Categories of Recipient</span>} className="w-full">
                        <Select
                            options={recipientCategoriesOptions}>
                        </Select>
                    </Form.Item>
                </div>

                <div className="flex justify-between">
                    <Form.Item name="retentionPeriod" label={<span className="font-bold">Retention Period</span>} className="w-full mr-5">
                        <Input />
                    </Form.Item>
                    <Form.Item name="securityMeasure" label={<span className="font-bold">Security Measures</span>} className="w-full">
                        <Input />
                    </Form.Item>
                </div>

                <div className="flex justify-between">
                    <Form.Item name="individualAvailableRights" label={<span className="font-bold">Rights Available to Individuals</span>} className="w-full mr-5">
                        <Input />
                    </Form.Item>
                    <Form.Item name="consentRecordLink" label={<span className="font-bold">Link to Record of Consent</span>} className="w-full">
                        <Input />
                    </Form.Item>
                </div>
                <div className="fixed bottom-0 left-0 right-0 bg-gray-100">
                    <div className='flex justify-end px-5 py-3'>
                        <Form.Item>
                            <Button size="middle" className="bg-blue-500 text-white w-32 mb-4" htmlType="submit">Add Data</Button>
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </div>
    );
}

const CreateRopaPage: Page = () => {
    return (
        <Authorize>
            <Title>Add Ropa</Title>
            <div>
                <Row className="mb-4">
                    <p className="text-base font-semibold text-gray-500"> (ROPA) Record of Processing Activity / ROPA List</p>
                    <p className="text-base font-semibold text-blue-500 ml-1"> / Add Data</p>
                </Row>
                <CreateRopa></CreateRopa>
            </div>
        </Authorize>
    );
}

CreateRopaPage.layout = WithCategoryLayout;
export default CreateRopaPage;