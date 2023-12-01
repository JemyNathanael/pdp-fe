import React from 'react';
import { Title } from '../components/Title';
import { Page } from '../types/Page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faArrowRightFromBracket, faCalendar, faHandshake, faLaptop, faPeopleArrows, faPeopleGroup, faServer, faSigning, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { signIn, signOut, useSession } from 'next-auth/react';
import nProgress from 'nprogress';
import { Authorize } from '@/components/Authorize';
import useSWR from 'swr';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { useRouter } from 'next/router';

interface CategoryHomeApiModel {
    id: string,
    title: string,
    // description: string
}

const Home: React.FC = () => {
    const { data: session, status } = useSession();
    const displayUserName = session?.user?.name;
    const role = session?.user?.['role'][0];

    const router = useRouter();

    const swrFetcher = useSwrFetcherWithAccessToken();

    const { data, isValidating } = useSWR<CategoryHomeApiModel[]>(BackendApiUrl.getCategories, swrFetcher);

    const onClickCategory = (categoryId: string) => {
        router.push(`/${categoryId}`)
    }

    function getRelatedIcon(title: string): IconDefinition {
        title = title.toLowerCase()

        if (title.includes('persetujuan')) {
            return faHandshake
        } else if (title.includes('kebocoran')) {
            return faLaptop
        } else if (title.includes('transfer')) {
            return faPeopleArrows
        } else if (title.includes('ketiga')) {
            return faPeopleGroup
        } else if (title.includes('hak')) {
            return faServer
        } else if (title.includes('retensi')) {
            return faCalendarDays
        } else {
            return faCalendar
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
                padding: '24px',
                borderBottom: 'solid rgba(255, 255, 255, 0.15) 4px'
            }}>
                <div style={{ flexGrow: 1 }}>
                    <img src="release.png" alt="logo" style={{ maxWidth: '50px' }} />
                </div>

                {
                    status === 'authenticated' ?
                        <div style={{ margin: '0 16px', fontWeight: '600' }}>Hello, {displayUserName}</div>
                        :
                        <div></div>
                }
                {
                    role === "Admin" &&
                    <div className='mr-2'>
                        <button onClick={() => router.push('/ManageUser')}>
                            <div style={{
                                border: 'solid white 2px',
                                padding: '4px 12px',
                                borderRadius: '16px',
                                fontSize: '18px',
                                fontWeight: '600'
                            }}>
                                Manage User
                            </div>
                        </button>
                    </div>
                }
                {
                    status === 'authenticated' ?
                        <div>
                            <button onClick={() => {
                                nProgress.start();
                                signOut({
                                    callbackUrl: '/api/end-session'
                                });
                            }}>
                                <div style={{
                                    border: 'solid white 2px',
                                    padding: '4px 12px',
                                    borderRadius: '16px',
                                    fontSize: '18px',
                                    fontWeight: '600'
                                }}>
                                    <FontAwesomeIcon icon={faArrowRightFromBracket}></FontAwesomeIcon> Logout
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
                                    fontWeight: '600'
                                }}>
                                    <FontAwesomeIcon icon={faSigning}></FontAwesomeIcon> Login
                                </div>
                            </button>
                        </div>
                }
            </nav>

            <div>
                <div className="flex justify-center">
                    <div className="grid grid-cols-12">
                        {
                            data?.map((Q, index) => {
                                return (
                                    <div key={'category#' + index} className='col-span-12 lg:col-span-6 xl:col-span-4'>
                                        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }} className='cursor-pointer'>
                                            <div className='border border-white border-solid rounded-md min-w-[400px] text-center m-4 min-h-[200px] relative max-w-[400px]' onClick={() => onClickCategory(Q.id)}>
                                                <div className='categoryTitleHome'>
                                                    <FontAwesomeIcon icon={getRelatedIcon(Q.title)} style={{ width: '50px', height: '50px' }}></FontAwesomeIcon>
                                                    <br />
                                                    {Q.title}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div >
                </div>
            </div>

            <footer style={{
                marginLeft: '24px',
                marginRight: '24px',
                fontSize: '14px',
                fontWeight: '600',
                position: "fixed",
                bottom: 16,
                left: 0
            }}>Copyright @ PT. Accelist Lentera Indonesia</footer>

        </div>
    );
};

const HomePage: Page = () => {
    return (
        <Authorize>
            <div className='green-gradient-bg'
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