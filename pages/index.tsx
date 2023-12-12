import React, { useState } from 'react';
import { Title } from '../components/Title';
import { Page } from '../types/Page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faArrowRightFromBracket, faUserGear, faHandshake, faLaptop, faPeopleArrows, faPeopleGroup, faServer, faSigning, faCalendarDays, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { signIn, signOut, useSession } from 'next-auth/react';
import nProgress from 'nprogress';
import { Authorize } from '@/components/Authorize';
import useSWR from 'swr';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { useRouter } from 'next/router';
import SearchBarNavs from '@/components/category/SearchBarNavs';
import InformationModal from '@/components/InformationModal';
import SearchResultNav from '@/components/category/SearchResultNav';

interface CategoryHomeApiModel {
    id: string,
    title: string,
    // description: string
}

const Home: React.FC = () => {
    const { data: session, status } = useSession();
    const [informationModal, setInformationModal] = useState<boolean>(false);
    const [category, setCategory] = useState<string>('');
    const displayUserName = session?.user?.name;
    const role = session?.user?.['role'][0];
    const [searchResults, setSearchResults] = useState([]); // Search Bar Result
    const router = useRouter();

    const swrFetcher = useSwrFetcherWithAccessToken();

    const { data, isValidating } = useSWR<CategoryHomeApiModel[]>(BackendApiUrl.getCategories, swrFetcher);

    const onClickCategory = (categoryId: string) => {
        router.push(`/${categoryId}`)
    }

    const handleIconModal = (categoryId: string) => {
        setInformationModal(true);
        setCategory(categoryId);
    }

    function handleCancel() {
        setInformationModal(false);
        router.push('/')
    }
    function getRelatedIcon(title: string): IconDefinition {
        title = title.toLowerCase()
        
        if(title.includes('hak')){
            return faServer
        } else if(title.includes('hukum')){
            return faHandshake
        } else if(title.includes('keamanan')) {
            return faPeopleGroup
        } else if(title.includes('pemrosesan')) {
            return faLaptop
        } else if(title.includes('akuntabilitas')) {
            return faCalendarDays
        } else if(title.includes('transfer')) {
            return faPeopleArrows
        } else {
            return faHandshake
        }
    }

    if (isValidating) {
        nProgress.start()
    }

    return (
        <div>
            <nav style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px',
                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#3788FD',
                position: 'fixed',
                top: 0,
                zIndex: 1000
            }}>
                <div className="hidden lg:block">
                    <img src="adaptist-white-logo.png" alt="logo" style={{ maxWidth: '200px', margin:'0px 0px 0px 40px' }} />
                </div>
                <div style={{ maxWidth: '100%' }} className='mr-2'>
                    <SearchBarNavs setSearchResults={setSearchResults} searchResults={searchResults} />
                    <SearchResultNav searchResults={searchResults} />
                </div>
                <div className="flex items-center">
                    {status === 'authenticated' ?
                        <div className="hidden lg:block" style={{ margin: '0 px', fontWeight: '600' }}>Halo, {displayUserName}</div>
                        : <div></div>
                    }
                    {role === "Admin" &&
                        <div className='ml-8'>
                            <button onClick={() => router.push('/ManageUser')}>
                                <div style={{
                                    padding: '4px 8px 3px',
                                    fontSize: '20px',
                                    fontWeight: '600',
                                }}>
                                    <FontAwesomeIcon icon={faUserGear} />
                                </div>
                            </button>
                        </div>
                    }
                    {status === 'authenticated' ?
                        <div className='pl-6'>
                            <button onClick={() => {
                                nProgress.start();
                                signOut({
                                    callbackUrl: '/api/end-session'
                                });
                            }}>
                                <div style={{
                                    padding: '4px 8px 3px',
                                    marginRight: '8px',
                                    fontSize: '20px',
                                    fontWeight: '600',
                                }}>
                                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                                </div>
                            </button>
                        </div>
                        :
                        <div>
                            <button onClick={() => {
                                nProgress.start();
                                signIn('oidc');
                            }}>
                                <div style={{
                                    border: 'solid white 2px',
                                    padding: '4px 12px',
                                    borderRadius: '16px',
                                    fontSize: '18px',
                                    fontWeight: '600',
                                }}>
                                    <FontAwesomeIcon icon={faSigning}></FontAwesomeIcon> Login
                                </div>
                            </button>
                        </div>
                    }
                </div>

            </nav>

            <div style={{ paddingTop: '100px', paddingBottom: '10px' }}>
                <div className='justify-center text-center mt-4 font-bold' style={{ fontSize: '34px', color: 'black' }}>
                    Sistem Evaluasi Kepatuhan UU No. 27 Tahun 2022 <br></br>
                    (Perlindungan Data Pribadi)
                </div>
                <div className="flex justify-center">
                    <div className="grid grid-cols-12">
                        {data?.map((Q, index) => (
                            <React.Fragment key={'category#' + index}>
                                {category && <InformationModal onCancel={handleCancel} categoryId={category} visible={informationModal} />}
                                <div className='col-span-12 lg:col-span-6 xl:col-span-4'>
                                    <div style={{ display: 'flex', justifyContent: 'center', margin: '5px' }} className='cursor-pointer'>
                                        <div className='rounded-md min-w-[400px] text-center m-4 min-h-[180px] max-h-[180px] relative max-w-[400px]  bg-[#3788FD] p-5'
                                            onClick={() => onClickCategory(Q.id)}
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
                                                const infoIcon = e.currentTarget.querySelector('.info-icon') as HTMLElement;
                                                if (infoIcon) {
                                                    infoIcon.style.color = '#3788FD';
                                                }
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.backgroundColor = '#3788FD';
                                                e.currentTarget.style.color = 'white';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                const infoIcon = e.currentTarget.querySelector('.info-icon') as HTMLElement;
                                                if (infoIcon) {
                                                    infoIcon.style.color = 'white';
                                                }
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faInfoCircle}
                                                size='lg'
                                                className='info-icon'
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    cursor: 'pointer',
                                                    transition: 'color 1s',
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleIconModal(Q.id);
                                                }}
                                            />
                                            <div className='categoryTitleHome'>
                                                <FontAwesomeIcon icon={getRelatedIcon(Q.title)} style={{ width: '50px', height: '50px' }}></FontAwesomeIcon>
                                                <br />
                                                {Q.title}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
            <footer style={{
                marginLeft: '24px',
                marginRight: '24px',
                fontSize: '14px',
                fontWeight: '600',
                position: "fixed",
                bottom: 16,
                left: 0,
                color: '#3788FD'
            }}>Copyright @ PT. Accelist Lentera Indonesia</footer>
        </div>
    );
};

const HomePage: Page = () => {
    return (
        <Authorize>
            <div className='bg'
                style={{
                    minHeight: '100vh',
                    color: 'white'
                }}>
                <Title>Home</Title>
                <Home></Home>
            </div>
        </Authorize>
    );
}

export default HomePage;