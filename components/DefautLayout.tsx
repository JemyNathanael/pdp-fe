import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { faBars, faArrowRightFromBracket, faHouse } from '@fortawesome/free-solid-svg-icons'
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
    const [isMobile, setIsMobile] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    const handleToggle = () => {
        setIsHidden(prevState => !prevState);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Initial check on mount
        handleResize();

        // Event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <nav className="bg-white p-4" style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
                <div className="items-center justify-between">
                    <div className="flex items-center justify-between p-2">
                        <div className="flex items-center cursor-pointer px-5">
                            <FontAwesomeIcon icon={faHouse} className='text-greyeen text-xl' />
                            <div className="ml-5 text-2xl text-greyeen cursor-pointer font-bold">LOGO</div>
                        </div>
                        <div className="lg:hidden cursor-pointer relative" onClick={handleToggle}>
                            <FontAwesomeIcon icon={faBars} className="text-greyeen text-xl" />

                            {isHidden && (
                                <div className="absolute top-0 right-0 mt-10 bg-white border border-greyeen rounded-lg p-4 shadow-md max-w-md">
                                    <ul className="flex flex-col space-y-2">
                                        <li>
                                            <div className="text-black text-sm cursor-pointer font-bold">
                                                {`Halo, ${displayUserName}`}
                                            </div>
                                        </li>
                                        {isAdmin &&
                                            <li>
                                                <Button onClick={goToManageUserPage} className="hover:bg-slate-500 text-greyeen border-none text-sm cursor-pointer font-bold">
                                                    Manage User
                                                </Button>
                                            </li>
                                        }
                                        <li>
                                            <Button onClick={handleLogout} className="hover:bg-slate-500 text-greyeen border-none text-sm cursor-pointer font-bold">
                                                Logout
                                            </Button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <ul className={`lg:flex space-x-4 items-center ${isMobile || isHidden ? 'hidden' : ''}`}>
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
                                <Button onClick={handleLogout} className="hover:bg-slate-500 text-greyeen border-2 border-greyeen rounded-full px-3 py-1 cursor-pointer font-bold">
                                    <FontAwesomeIcon icon={faArrowRightFromBracket} /> Logout
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav >
            <div className="mx-auto px-10 py-4">
                {children}
            </div>
        </>
    );
}

export const WithDefaultLayout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>;
