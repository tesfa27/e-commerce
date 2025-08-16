import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import axios from 'axios';
import { PlusIcon, ArrowLeftIcon, CloudArrowUpIcon, PhotoIcon } from '@heroicons/react/24/outline';
import LoadingBox from '../components/LoadingBox';
import { createProduct, clearCreatedProduct } from '../redux/productListSlice';
import { colors, components, utils } from '../styles/theme';

export default function CreateProductScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    setSlug(generateSlug(newName));
  };
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [loadingUpload, setLoadingUpload] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name,
        slug,
        price: Number(price),
        image,
        category,
        brand,
        countInStock: Number(countInStock),
        description,
      };
      await dispatch(createProduct(productData)).unwrap();
      toast.success('Product created successfully');
      dispatch(clearCreatedProduct());
      navigate('/admin/products');
    } catch (error) {
      toast.error(error);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      setLoadingUpload(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setLoadingUpload(false);
      toast.success('Image uploaded successfully');
      setImage(data.secure_url);
    } catch (error) {
      setLoadingUpload(false);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className={`${colors.background.primary} min-h-screen`}>
      <Helmet>
        <title>Create Product - EcomStore</title>
      </Helmet>
      
      <div className={components.layout.container}>
        <div className="py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/products')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <div className="flex items-center">
                <PlusIcon className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h1 className={components.typography.h2}>Create New Product</h1>
                  <p className={colors.text.secondary}>Add a new product to your store</p>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={handleNameChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter product name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Slug (Auto-generated)</label>
                        <input
                          type="text"
                          value={slug}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                          placeholder="product-slug"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="0.00"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stock Count</label>
                        <input
                          type="number"
                          value={countInStock}
                          onChange={(e) => setCountInStock(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <input
                          type="text"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Electronics, Clothing, Books..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                        <input
                          type="text"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Nike, Apple, Samsung..."
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Product description..."
                      />
                    </div>
                  </div>
                </div>

                {/* Image Section */}
                <div className={components.card.base}>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h3>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors mb-3"
                        placeholder="https://example.com/image.jpg"
                      />
                      
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                          <CloudArrowUpIcon className="w-5 h-5 mr-2 text-gray-600" />
                          <span className="text-sm text-gray-700">Upload Image</span>
                          <input type="file" className="hidden" onChange={uploadFileHandler} accept="image/*" />
                        </label>
                        {loadingUpload && <div className="text-sm text-blue-600">Uploading...</div>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/products')}
                    className={components.button.secondary}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={components.button.primary}
                  >
                    Create Product
                  </button>
                </div>
              </form>
            </div>

            {/* Preview Sidebar */}
            <div className="lg:col-span-1">
              <div className={`${components.card.base} sticky top-8`}>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                  
                  {image ? (
                    <img
                      src={image}
                      alt={name || 'Product preview'}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200 mb-4"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  {!image && (
                    <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                      <div className="text-center">
                        <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No image selected</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">{name || 'Product Name'}</h4>
                    <p className="text-2xl font-bold text-blue-600">${price || '0.00'}</p>
                    <p className="text-sm text-gray-600">{brand || 'Brand'} • {category || 'Category'}</p>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {countInStock > 0 ? `${countInStock} in stock` : 'Out of stock'}
                    </div>
                    {description && (
                      <p className="text-sm text-gray-600 mt-3">{description.substring(0, 100)}...</p>
                    )}
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