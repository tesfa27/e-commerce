import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import ConfirmDialog from '../components/ConfirmDialog';
import { fetchProductList, createProduct, clearCreatedProduct, deleteProduct } from '../redux/productListSlice';
import { colors, components, utils } from '../styles/theme';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CubeIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

export default function ProductListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, products, pages, loadingCreate, loadingDelete, createdProduct } = useSelector((state) => state.productList);
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  useEffect(() => {
    dispatch(fetchProductList(page));
  }, [dispatch, page]);

  const createHandler = () => {
    navigate('/admin/product/create');
  };

  const deleteHandler = (product) => {
    setProductToDelete(product);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteProduct(productToDelete._id)).unwrap();
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error(error);
    }
    setShowConfirm(false);
    setProductToDelete(null);
  };

  if (loading) return <div className={components.states.loading}><LoadingBox /></div>;
  if (error) return <div className={components.states.error}><MessageBox variant="danger">{error}</MessageBox></div>;

  return (
    <div className={`${colors.background.primary} min-h-screen`}>
      <Helmet>
        <title>Admin Products - EcomStore</title>
      </Helmet>
      
      <div className={components.layout.container}>
        <div className="py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <CubeIcon className="w-8 h-8 text-emerald-600 mr-3" />
              <div>
                <h1 className={components.typography.h2}>Products Management</h1>
                <p className={colors.text.secondary}>Manage your store products</p>
              </div>
            </div>
            
            <button
              onClick={createHandler}
              disabled={loadingCreate}
              className={`${components.button.primary} flex items-center`}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              {loadingCreate ? 'Creating...' : 'Create Product'}
            </button>
          </div>

          {/* Loading States */}
          {(loadingCreate || loadingDelete) && (
            <div className="mb-4">
              <LoadingBox />
            </div>
          )}

          {/* Products Table */}
          {products.length === 0 ? (
            <div className={`${components.card.base} p-12 ${utils.centerText}`}>
              <CubeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
              <p className={`${colors.text.secondary} mb-6`}>Create your first product to get started</p>
              <button 
                onClick={createHandler}
                className={components.button.primary}
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Product
              </button>
            </div>
          ) : (
            <div className={components.card.base}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{product._id.slice(-8)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-lg border border-gray-200 mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">SKU: {product.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            ${product.price.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.brand}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            product.countInStock > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/product/${product.slug}`)}
                              className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                            >
                              <EyeIcon className="w-3 h-3 mr-1" />
                              View
                            </button>
                            <button
                              onClick={() => navigate(`/admin/product/${product._id}`)}
                              className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                            >
                              <PencilIcon className="w-3 h-3 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteHandler(product)}
                              className="inline-flex items-center px-2 py-1 border border-red-300 shadow-sm text-xs leading-4 font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            >
                              <TrashIcon className="w-3 h-3 mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex justify-center">
                    <div className="flex space-x-2">
                      {[...Array(pages).keys()].map((x) => (
                        <Link
                          key={x + 1}
                          to={`/admin/products?page=${x + 1}`}
                          className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                            Number(page) === x + 1
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {x + 1}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}