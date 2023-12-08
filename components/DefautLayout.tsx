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
            <nav className="bg-[#3788FD]" style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
                <div className="flex items-center">
                    <div onClick={() => router.push('/')} style={{ flexGrow: 1, }}>
                        <img src="adaptist-white-logo.png" alt="logo" style={{ maxWidth: '160px', margin:'8px' }} />
                    </div>
                    <div className="flex flex-1 flex-row-reverse mr-12 items-center">
                        <ul className="lg:flex space-x-4 items-center">
                            <li>
                                <div className="text-white text-sm cursor-pointer font-bold">{`Halo, ${displayUserName}`}</div>
                            </li>
                            {isAdmin &&
                                <li>
                                    <button onClick={goToManageUserPage} style={{ color: 'white' }}>
                                        <FontAwesomeIcon icon={faUserGear} />
                                    </button>
                                </li>
                            }
                            <li>
                                <button onClick={handleLogout} className="pl-1" style={{ color: 'white' }}>
                                    <FontAwesomeIcon className="pr-0.5" icon={faArrowRightFromBracket} />
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="mx-auto px-10 py-4">
                {children}
            </div>
        </>
    );
}

export const WithDefaultLayout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>;
