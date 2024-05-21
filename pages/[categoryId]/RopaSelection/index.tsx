import React from 'react';
import { Authorize } from '@/components/Authorize';
import { Page } from '@/types/Page';
import { Title } from '@/components/Title';
import { WithCategoryLayout } from '@/components/CategoryLayout';
import router from 'next/router';

const RopaSelection: React.FC = () => {
    const onClickCategory = (id: number) => {
        if(id === 1)
        {
            router.push(`/${router.query['categoryId']}/DataMapping`);
        }
        else
        {
            router.push(`/${router.query['categoryId']}/RopaList`);
        }

    }
    return (
        <div>
            <div>
                <div className='text-left font-bold pb-5 text-xl text-blue-500'>
                    Selection
                </div>
                <div className='justify-center text-center mt-4 font-bold pb-5 text-4xl text-black' >
                    Pilih Activity
                </div>
                <div className="flex flex-col lg:flex-row justify-center items-center gap-4">
                    <div className="rounded-md min-w-[300px] lg:min-w-[400px] text-center m-4 min-h-[180px] max-h-[180px] relative max-w-[400px] bg-[#3788FD] p-5 flex flex-col justify-center items-center"
                        onClick={() => onClickCategory(1)}
                        style={{
                            transition: 'background-color 0.3s, color 0.3s, transform 0.3s, box-shadow 0.3s',
                            backgroundColor: '#3788FD',
                            color: 'white',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
                            borderColor: '#3788FD',
                            borderStyle: 'solid',
                            borderWidth: '1.5px',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = '#3788FD';
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            const img = e.currentTarget.querySelector('img') as HTMLImageElement;
                            if (img) {
                                img.style.filter = 'saturate(100%) invert(62%) sepia(100%) saturate(600%) hue-rotate(185deg) contrast(120%)';
                            }
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#3788FD';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'translateY(0)';
                            const img = e.currentTarget.querySelector('img') as HTMLImageElement;
                            if (img) {
                                img.style.filter = 'none';
                            }
                        }}
                    >
                        <div className="pb-5">
                            <img src="/data-mapping-logo.png" alt="Data Mapping Logo" className="w-12 h-12" />
                        </div>
                        <div className="text-2xl font-bold">
                            Data Mapping
                        </div>
                    </div>

                    <div className="rounded-md min-w-[300px] lg:min-w-[400px] text-center m-4 min-h-[180px] max-h-[180px] relative max-w-[400px] bg-[#3788FD] p-5 flex flex-col justify-center items-center"
                        onClick={() => onClickCategory(2)}
                        style={{
                            transition: 'background-color 0.3s, color 0.3s, transform 0.3s, box-shadow 0.3s',
                            backgroundColor: '#3788FD',
                            color: 'white',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
                            borderColor: '#3788FD',
                            borderStyle: 'solid',
                            borderWidth: '1.5px',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = '#3788FD';
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            const img = e.currentTarget.querySelector('img') as HTMLImageElement;
                            if (img) {
                                img.style.filter = 'saturate(100%) invert(62%) sepia(100%) saturate(600%) hue-rotate(185deg) contrast(120%)';
                            }
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#3788FD';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'translateY(0)';
                            const img = e.currentTarget.querySelector('img') as HTMLImageElement;
                            if (img) {
                                img.style.filter = 'none';
                            }
                        }}
                    >
                        <div className="pb-5">
                            <img src="/ropa-logo.png" alt="ROPA Logo" className="w-12 h-12" />
                        </div>
                        <div className="text-2xl font-bold">
                            ROPA
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const RopaSelectionPage: Page = () => {
    return (
        <Authorize>
            <div className='bg'
                style={{
                    minHeight: '100vh',
                    color: 'white'
                }}>
                <Title>Ropa Selection</Title>
                <RopaSelection></RopaSelection>
            </div>
        </Authorize>
    );
}

RopaSelectionPage.layout = WithCategoryLayout;
export default RopaSelectionPage;