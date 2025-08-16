import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { updateProfile, resetUpdateStatus } from '../redux/userSlice';
import { colors, components, utils } from '../styles/theme';
import { UserIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { userInfo, updateStatus, updateError } = useSelector((state) => state.user);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
      return;
    }
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo, navigate]);

  useEffect(() => {
    if (updateStatus === 'succeeded') {
      toast.success('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
      dispatch(resetUpdateStatus());
    } else if (updateStatus === 'failed' && updateError) {
      toast.error(updateError);
      dispatch(resetUpdateStatus());
    }
  }, [updateStatus, updateError, dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    dispatch(updateProfile({ name, email, password }));
  };

  return (
    <div className={`${colors.background.primary} min-h-screen`}>
      <Helmet>
        <title>Profile - EcomStore</title>
      </Helmet>
      
      <div className={components.layout.container}>
        <div className="py-8">
          <div className="max-w-2xl mx-auto">
            <div className={`${components.card.base} overflow-hidden`}>
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-8">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                    <UserIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">My Profile</h1>
                    <p className="text-emerald-100 mt-1">Manage your account information</p>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="p-6">
                <form onSubmit={submitHandler} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={updateStatus === 'loading'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={updateStatus === 'loading'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                    <p className={`${colors.text.secondary} text-sm mb-4`}>
                      Leave blank to keep your current password
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={updateStatus === 'loading'}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                            ) : (
                              <EyeIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={updateStatus === 'loading'}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showConfirmPassword ? (
                              <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                            ) : (
                              <EyeIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={updateStatus === 'loading'}
                      className={`${components.button.primary} w-full`}
                    >
                      {updateStatus === 'loading' ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating Profile...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <CheckCircleIcon className="w-5 h-5 mr-2" />
                          Update Profile
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Account Info Card */}
            <div className={`${components.card.base} mt-6 p-6`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="text-gray-900">
                    {userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Status</p>
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-green-700 font-medium">Active</span>
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