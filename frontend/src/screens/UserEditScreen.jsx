import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { PencilIcon, ArrowLeftIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { fetchUser, updateUser } from '../redux/userEditSlice';
import { colors, components, utils } from '../styles/theme';

export default function UserEditScreen() {
  const { id: userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user, loadingUpdate } = useSelector((state) => state.userEdit);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const userData = { name, email, isAdmin };
      await dispatch(updateUser({ userId, userData })).unwrap();
      toast.success('User updated successfully');
      navigate('/admin/users');
    } catch (error) {
      toast.error(error);
    }
  };

  if (loading) return <div className={components.states.loading}><LoadingBox /></div>;
  if (error) return <div className={components.states.error}><MessageBox variant="danger">{error}</MessageBox></div>;

  return (
    <div className={`${colors.background.primary} min-h-screen`}>
      <Helmet>
        <title>Edit User - EcomStore</title>
      </Helmet>
      
      <div className={components.layout.container}>
        <div className="py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/users')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <div className="flex items-center">
                <PencilIcon className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h1 className={components.typography.h2}>Edit User</h1>
                  <p className={colors.text.secondary}>Update user information and permissions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={submitHandler} className="space-y-6">
                <div className={components.card.base}>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter user's full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="user@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Permissions Section */}
                <div className={components.card.base}>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <ShieldCheckIcon className="w-6 h-6 text-purple-600 mr-3" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Administrator Access</h4>
                            <p className="text-sm text-gray-500">Grant full access to admin dashboard and management features</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      {isAdmin && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <ShieldCheckIcon className="w-5 h-5 text-purple-600 mr-2" />
                            <p className="text-sm text-purple-800 font-medium">Admin Privileges Enabled</p>
                          </div>
                          <p className="text-sm text-purple-700 mt-1">This user will have access to dashboard, orders, products, and user management.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/users')}
                    className={components.button.secondary}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loadingUpdate}
                    className={`${components.button.primary} ${loadingUpdate ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loadingUpdate ? 'Updating...' : 'Update User'}
                  </button>
                </div>
                
                {loadingUpdate && (
                  <div className="flex justify-center">
                    <LoadingBox />
                  </div>
                )}
              </form>
            </div>

            {/* User Preview Sidebar */}
            <div className="lg:col-span-1">
              <div className={`${components.card.base} sticky top-8`}>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Preview</h3>
                  
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {isAdmin ? (
                        <ShieldCheckIcon className="w-10 h-10 text-purple-600" />
                      ) : (
                        <UserIcon className="w-10 h-10 text-blue-600" />
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900">{name || 'User Name'}</h4>
                    <p className="text-sm text-gray-600">{email || 'user@example.com'}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">User ID:</span>
                      <span className="text-sm font-medium text-gray-900">#{userId?.slice(-8)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Role:</span>
                      {isAdmin ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <ShieldCheckIcon className="w-3 h-3 mr-1" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <UserIcon className="w-3 h-3 mr-1" />
                          Customer
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}