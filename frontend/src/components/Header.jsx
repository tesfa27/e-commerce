import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Transition } from '@headlessui/react';
import { ShoppingCartIcon, UserIcon, ChevronDownIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { signOut } from '../redux/userSlice';

const Header = ({ sidebarIsOpen, setSidebarIsOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);

  const signoutHandler = () => {
    dispatch(signOut());
    navigate('/signin');
  };

  const cartItemsCount = cartItems.reduce((a, c) => a + c.quantity, 0);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button & Logo */}
          <div className="flex items-center space-x-4">

            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-xl tracking-tight">E</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">EcomStore</span>
                <span className="text-xs text-gray-500 font-medium tracking-wide -mt-1">PREMIUM SHOPPING</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
              Products
            </Link>
            <Link to="/orderhistory" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
              Orders
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors group">
              <ShoppingCartIcon className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {userInfo ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="hidden md:block font-medium">{userInfo.name}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </Menu.Button>
                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`flex items-center px-4 py-2 text-sm transition-colors ${
                            active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          Profile
                        </Link>
                      )}
                    </Menu.Item>
                    {!userInfo.isAdmin && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/orderhistory"
                            className={`flex items-center px-4 py-2 text-sm transition-colors ${
                              active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            Order History
                          </Link>
                        )}
                      </Menu.Item>
                    )}
                    {userInfo.isAdmin && (
                      <>
                        <hr className="my-2 border-gray-200" />
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/admin/dashboard"
                              className={`flex items-center px-4 py-2 text-sm transition-colors ${
                                active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                              }`}
                            >
                              Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/admin/orders"
                              className={`flex items-center px-4 py-2 text-sm transition-colors ${
                                active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                              }`}
                            >
                              Orders
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/admin/products"
                              className={`flex items-center px-4 py-2 text-sm transition-colors ${
                                active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                              }`}
                            >
                              Products
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/admin/users"
                              className={`flex items-center px-4 py-2 text-sm transition-colors ${
                                active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                              }`}
                            >
                              Users
                            </Link>
                          )}
                        </Menu.Item>
                      </>
                    )}
                    <hr className="my-2 border-gray-200" />
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={signoutHandler}
                          className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                            active ? 'bg-red-50 text-red-600' : 'text-gray-700'
                          }`}
                        >
                          Sign Out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link
                to="/signin"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;