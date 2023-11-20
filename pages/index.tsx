import React, { useState, useEffect } from 'react';
import { Title } from '../components/Title';
import { Page } from '../types/Page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faArrowRightFromBracket, faCalendar, faHandshake, faLaptop, faPeopleArrows, faPeopleGroup, faServer, faSigning } from '@fortawesome/free-solid-svg-icons';
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
    description: string
}

interface CategoryHomeModel extends CategoryHomeApiModel {
    icon: IconDefinition
}

interface CategoryHomeListModel {
    first: CategoryHomeModel,
    second: CategoryHomeModel
}

const Home: React.FC = () => {

    const [categoryList, setCategoryList] = useState<CategoryHomeListModel[]>([])

    const { data: session, status } = useSession();
    const displayUserName = session?.user?.name;

    const router = useRouter();

    const swrFetcher = useSwrFetcherWithAccessToken();

    const { data, error, isValidating } = useSWR<CategoryHomeApiModel[]>(BackendApiUrl.getCategories, swrFetcher);

    const onClickCategory = (categoryId: string) => {
        router.push(`/${categoryId}`)
    }
    
    useEffect(() => {
        if (!data) {
            if (error) {
                console.error(error)
            }
            return
        }

        setCategoryList([])
        const categoryListTemp: CategoryHomeListModel[] = []
        let title = ''
        for (let i = 0; i < data.length; i++) {
            // First column
            if (i % 2 === 0) {
                title = data[i]?.title ?? ''
                categoryListTemp.push({
                    first: {
                        id: data[i]?.id ?? '',
                        title: title,
                        description: data[i]?.description ?? '',
                        icon: getRelatedIcon(title)
                    },
                    second: {
                        id: data[i]?.id ?? '',
                        title: '',
                        description: '',
                        icon: faLaptop
                    }
                })
            }
            // Second column
            else {
                title = data[i]?.title ?? ''
                if (categoryListTemp.length >= 1) {
                    const prevFirstCol = categoryListTemp[categoryListTemp.length - 1]?.first
                    categoryListTemp[categoryListTemp.length - 1] = {
                        first: {
                            id: prevFirstCol?.id ?? '',
                            title: prevFirstCol?.title ?? '',
                            description: prevFirstCol?.description ?? '',
                            icon: prevFirstCol?.icon ?? faCalendar
                        },
                        second: {
                            id: data[i]?.id ?? '',
                            title: title,
                            description: data[i]?.description ?? '',
                            icon: getRelatedIcon(title)
                        }
                    }
                }
            }
        }

        setCategoryList(categoryListTemp)
    }, [data, error])

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
                {
                    categoryList.map((Q, idx) => {
                        return (
                            <div key={'category#' + idx} style={{ display: 'flex', justifyContent: 'center', margin: '20px' }} className='cursor-pointer'>

                                <div className='categoryHome' onClick={() => onClickCategory(Q.first.id)}>
                                    <div className='categoryTitleHome'>
                                        <FontAwesomeIcon icon={Q.first.icon} style={{ width: '50px', height: '50px' }}></FontAwesomeIcon>
                                        <br />
                                        {Q.first.title}
                                    </div>
                                    <div className='categoryDescriptionHome'>
                                        <div style={{
                                            padding: '16px',
                                            position: 'relative',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate3d(-50%,-50%,0)',
                                        }}>
                                            {Q.first.description}
                                        </div>
                                    </div>
                                </div>


                                {
                                    !Q.second.title && !Q.second.description ?
                                        <div></div>
                                        :
                                        <div className='categoryHome' onClick={() => onClickCategory(Q.second.id)}>
                                            <div className='categoryTitleHome'>
                                                <FontAwesomeIcon icon={Q.second.icon} style={{ width: '50px', height: '50px' }}></FontAwesomeIcon>
                                                <br />
                                                {Q.second.title}
                                            </div>
                                            <div className='categoryDescriptionHome'>
                                                <div style={{
                                                    padding: '16px',
                                                    position: 'relative',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate3d(-50%,-50%,0)',
                                                }}>
                                                    {Q.second.description}
                                                </div>
                                            </div>
                                        </div>
                                }

                            </div>
                        )
                    })
                }
            </div>

            <footer style={{
                marginLeft: '24px',
                marginRight: '24px',
                fontSize: '14px',
                fontWeight: '600'
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
