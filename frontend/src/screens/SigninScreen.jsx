import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { signIn, clearError } from "../redux/userSlice";
import { colors, components, utils } from '../styles/theme';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

function SigninScreen() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { userInfo, status, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
    return () => {
      dispatch(clearError());
    };
  }, [userInfo, redirect, navigate, dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(signIn({ email, password }));
  };

  return (
    <div className={`${colors.background.primary} min-h-screen flex items-center justify-center py-12`}>
      <Helmet>
        <title>Sign In - EcomStore</title>
      </Helmet>
      
      <div className={`${components.card.base} w-full max-w-md p-8`}>
        <div className={`${utils.centerText} mb-8`}>
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl tracking-tight">E</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className={`${colors.text.secondary} mt-2`}>Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-6">
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
              disabled={status === "loading"}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={status === "loading"}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter your password"
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

          <button
            type="submit"
            disabled={status === "loading"}
            className={`${components.button.primary} w-full`}
          >
            {status === "loading" ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <div className={`${utils.centerText} text-sm`}>
            <span className={colors.text.secondary}>Don't have an account? </span>
            <Link 
              to={`/signup?redirect=${redirect}`}
              className={`${colors.text.primary} hover:underline font-medium`}
            >
              Create Account
            </Link>
          </div>
          
          <div className={`${utils.centerText} text-sm`}>
            <Link 
              to="/forget-password"
              className={`${colors.text.secondary} hover:text-emerald-600 transition-colors`}
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SigninScreen;