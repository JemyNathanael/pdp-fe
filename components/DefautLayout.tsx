import React from "react";
import { Button } from "antd";
import { faArrowRightFromBracket, faHouse } from '@fortawesome/free-solid-svg-icons'
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
            <nav className="bg-white" style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
                <div className="flex items-center">
                    <div className="flex justify-center p-6 items-center  border-r-2 border-gray-300">
                        <FontAwesomeIcon icon={faHouse} className='text-greyeen text-2xl' />
                    </div>
                    <div className="flex ml-5 text-2xl text-greyeen cursor-pointer font-bold">
                        LOGO
                    </div>
                    <div className="flex flex-1 flex-row-reverse mr-12 items-center">
                        <ul className="lg:flex space-x-4 items-center">
                            <li>
                                <div className="text-black text-sm cursor-pointer font-bold">{`Halo, ${displayUserName}`}</div>
                            </li>
                            {isAdmin &&
                                <li>
                                    <Button onClick={goToManageUserPage} className="hover:bg-slate-500 text-greyeen border-2 border-greyeen rounded-full px-3 py-1 cursor-pointer font-bold">
                                        Manage User
                                    </Button>
                                </li>
                            }
                            <li>
                                <Button onClick={handleLogout} className="hover:bg-slate-500 text-greyeen border-2 gap-2 border-greyeen rounded-full px-3 py-1 cursor-pointer font-bold">
                                    <FontAwesomeIcon className="mr-2" icon={faArrowRightFromBracket} />
                                    Logout
                                </Button>
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
