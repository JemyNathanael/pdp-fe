import React from "react";
import { faArrowRightFromBracket, faUserGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import nProgress from "nprogress";

const DefaultLayout: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {

    const router = useRouter();
    const { data: session, status } = useSession();

    const goToManageUserPage = () => {
        router.push('/ManageUser');
    }

    const handleLogout = () => {
        if (status === 'authenticated') {
            nProgress.start();
            signOut({
                callbackUrl: '/api/end-session',
            });
        }
    }

    const displayUserName = session?.user?.name;

    const userRole = session?.user?.['role'][0];

    const isAdmin = userRole === "Admin";

    return (
        <>
            <nav className="bg-[#3788FD]" style={{
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                padding: '10px',
                position: 'fixed',
                width: '100%',
                top: 0,
                zIndex: 2
            }}>
                <div className="flex flex-1 items-center">
                    <div onClick={() => router.push('/')} style={{ flexGrow: 1, }}>
                        <img src="adaptist-white-logo.png" alt="logo" style={{ maxWidth: '200px', margin: '0px 0px 0px 40px' }} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-auto lg:grid-flow-col lg:grid-rows-1 items-center">
                        <div className="grid grid-cols-1 lg:grid-cols-auto lg:grid-flow-col lg:grid-rows-1 items-center">
                            <ul className="lg:flex space-x-4 items-center">
                                <li className="flex items-center" >
                                    <div className="text-white text-base cursor-pointer font-semibold fontWeight: '600'">
                                        {`Halo, ${displayUserName}`}
                                    </div>
                                    {isAdmin && (
                                        <div className='ml-8'>
                                            <button
                                                onClick={goToManageUserPage}
                                                className="text-white"
                                            >
                                                <div style={{
                                                    padding: '4px 8px 3px',
                                                    fontSize: '20px',
                                                    fontWeight: '600',
                                                }}>
                                                    <FontAwesomeIcon icon={faUserGear} />
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                    <div className='pl-6'>
                                        <button
                                            onClick={handleLogout}
                                            className="text-white"
                                        >
                                            <div style={{
                                                padding: '4px 8px 3px',
                                                marginRight: '8.5px',
                                                fontSize: '20px',
                                                fontWeight: '600',
                                            }}>
                                                <FontAwesomeIcon icon={faArrowRightFromBracket} />
                                            </div>
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="mx-auto px-10 py-4" style={{ paddingTop: 100 }}>
                {children}
            </div>
        </>
    );
}

export const WithDefaultLayout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>;