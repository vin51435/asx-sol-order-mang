'use client';

import { logoutUser } from '@/libs/logout.api';
import { useAppSelector } from '@/redux/hook';
import { Button } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const pathname = usePathname();

  const isAuthPage =
    pathname === '/admin/login' || pathname === '/admin/register';

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <nav className="bg-white px-6 py-3 shadow-sm flex items-center justify-between">
      <Link href="/" className="text-lg font-semibold text-gray-800">
        Order
      </Link>

      {!isAuthPage && (
        <div className="flex items-center gap-4">
          <Link href="/admin/register">
            <Button type="primary">Register</Button>
          </Link>
          {!isLoggedIn ? (
            <>
              <Link href="/admin/login">
                <Button type="default">Login</Button>
              </Link>
            </>
          ) : (
            <Button danger onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

