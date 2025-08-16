import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, clearError } from "../redux/cartSlice";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import Rating from "../components/Rating";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { colors, components, utils } from '../styles/theme';
import { StarIcon } from '@heroicons/react/24/solid';
import { getDetailImage, getThumbnailImage } from '../utils/imageOptimization';

function ProductScreen() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error: cartError } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);
  
  const reviewsRef = useRef();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [loadingCreateReview, setLoadingCreateReview] = useState(false);

  const {
    data: product,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => (await axios.get(`/api/products/slug/${slug}`)).data,
    retry: 3,
  });

  useEffect(() => {
    if (product?.name) {
      document.title = product.name;
    }
  }, [product]);

  useEffect(() => {
    if (cartError) {
      const timer = setTimeout(() => dispatch(clearError()), 3000);
      return () => clearTimeout(timer);
    }
  }, [cartError, dispatch]);

  const handleAddToCart = async () => {
    try {
      await dispatch(addToCart({ product, quantity: 1 })).unwrap();
      navigate("/cart");
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      setLoadingCreateReview(true);
      await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setLoadingCreateReview(false);
      toast.success('Review submitted successfully');
      setRating(0);
      setComment('');
      window.location.reload();
    } catch (error) {
      setLoadingCreateReview(false);
      toast.error(getError(error));
    }
  };

  if (isLoading) return <div className={components.states.loading}><LoadingBox /></div>;
  if (queryError) return <div className={components.states.error}><MessageBox variant="danger">{getError(queryError)}</MessageBox></div>;

  return (
    <div className={`${colors.background.primary} min-h-screen`}>
      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      
      {cartError && <MessageBox variant="danger">{cartError}</MessageBox>}
      
      <div className={components.layout.container}>
        {/* Breadcrumb */}
        <nav className="py-4">
          <Link to="/" className={`${colors.text.secondary} hover:${colors.text.primary} ${utils.transition}`}>
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className={colors.text.dark}>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-8">
          {/* Product Images */}
          <div>
            <div className={`${components.card.base} p-4 mb-4`}>
              <img 
                src={getDetailImage(selectedImage || product.image)} 
                alt={product.name} 
                className="w-full h-96 object-cover object-top rounded-lg"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {[product.image, ...(product.images || [])].map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`${components.card.base} p-2 hover:ring-2 hover:ring-emerald-600 ${utils.transition}`}
                >
                  <img 
                    src={getThumbnailImage(image)} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover object-top rounded"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className={`${components.typography.h1} ${colors.text.dark}`}>
              {product.name}
            </h1>
            
            <div className="flex items-center mb-4">
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </div>

            <div className="text-3xl font-bold text-gray-900 mb-6">
              ${product.price?.toFixed(2)}
            </div>

            <div className={`${components.card.base} p-6 mb-6`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status:</span>
                  {product.countInStock > 0 ? (
                    <span className={components.states.inStock}>In Stock</span>
                  ) : (
                    <span className={components.states.outOfStock}>Out of Stock</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Brand:</span>
                  <span className={colors.text.secondary}>{product.brand}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Category:</span>
                  <span className={colors.text.secondary}>{product.category}</span>
                </div>
              </div>
              
              {product.countInStock > 0 && (
                <button
                  onClick={handleAddToCart}
                  disabled={status === "loading"}
                  className={`${components.button.primary} w-full mt-6`}
                >
                  Add to Cart
                </button>
              )}
            </div>

            <div className={`${components.card.base} p-6`}>
              <h3 className={`${components.typography.h3} mb-4`}>Description</h3>
              <p className={colors.text.secondary}>{product.description}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="py-12">
          <h2 ref={reviewsRef} className={`${components.typography.h2} mb-8`}>
            Customer Reviews
          </h2>
          
          {product.reviews?.length === 0 ? (
            <div className={`${components.card.base} p-8 ${utils.centerText}`}>
              <p className={colors.text.secondary}>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-6 mb-8">
              {product.reviews?.map((review) => (
                <div key={review._id} className={`${components.card.base} p-6 hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-semibold text-sm">
                          {review.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* Write Review */}
          <div className={`${components.card.base} p-6`}>
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <h3 className={`${components.typography.h3} mb-6`}>Write a Review</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`w-8 h-8 transition-colors ${
                          star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        } hover:text-yellow-400`}
                      >
                        <StarIcon className="w-full h-full fill-current" />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-2 text-sm text-gray-600">
                        {rating === 1 && 'Poor'}
                        {rating === 2 && 'Fair'}
                        {rating === 3 && 'Good'}
                        {rating === 4 && 'Very Good'}
                        {rating === 5 && 'Excellent'}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                    placeholder="Share your thoughts about this product..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loadingCreateReview}
                  className={components.button.primary}
                >
                  {loadingCreateReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className={utils.centerText}>
                <p className={colors.text.secondary}>
                  Please{' '}
                  <Link 
                    to={`/signin?redirect=/product/${product.slug}`}
                    className={`${colors.text.primary} hover:underline`}
                  >
                    sign in
                  </Link>{' '}
                  to write a review
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductScreen;