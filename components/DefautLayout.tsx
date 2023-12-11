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
                zIndex: 1
            }}>
                <div className="flex flex-1 items-center">
                    <div onClick={() => router.push('/')} style={{ flexGrow: 1, }}>
                        <img src="adaptist-white-logo.png" alt="logo" style={{ maxWidth: '200px', margin:'0px 0px 0px 40px' }} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-auto lg:grid-flow-col lg:grid-rows-1 mr-4 items-center">
                        <div className="grid grid-cols-1 lg:grid-cols-auto lg:grid-flow-col lg:grid-rows-1 mr-2 items-center">
                            <ul className="lg:flex space-x-4 items-center">
                                <li className="flex items-center">
                                    <div className="text-white text-md cursor-pointer font-semibold pr-7 fontWeight: '600', paddingLeft:'2px'">
                                        {`Halo, ${displayUserName}`}
                                    </div>
                                    {isAdmin && (
                                        <button
                                            onClick={goToManageUserPage}
                                            className="text-white text-lg pr-3 ml-4 mr-1"
                                        >
                                            <FontAwesomeIcon icon={faUserGear} />
                                        </button>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="text-white text-lg pl-4 mt-1"
                                    >
                                        <FontAwesomeIcon className="mr-1 pb-0.5" icon={faArrowRightFromBracket} />
                                    </button>
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