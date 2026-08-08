import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader2, Pill, ShoppingCart, ShieldAlert, Award, FileText } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useAppContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/product/${id}`);
      if (data.success) {
        setProduct(data.product);
      } else {
        toast.error("Could not fetch product detail");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred loading medicine specifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
        <Loader2 className="animate-spin text-emerald-500 h-10 w-10" />
        <span className="text-gray-500 text-sm">Loading medicine details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white border border-gray-100 rounded-2xl shadow-xs">
        <ShieldAlert className="text-red-400 h-12 w-12 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-800">Medicine Not Found</h3>
        <p className="text-gray-500 text-sm mt-1">This product might have been discontinued or out of catalog.</p>
        <Link 
          to="/" 
          className="mt-6 inline-flex items-center gap-1.5 bg-emerald-500 text-white hover:bg-emerald-600 px-4 py-2 rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-emerald-600 text-xs font-semibold mb-8 group transition-colors"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-xs">
        
        {/* Product Image Section */}
        <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/30 flex justify-center items-center p-8 rounded-2xl border border-gray-50 min-h-[300px]">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-h-60 object-contain hover:scale-102 transition-transform duration-300"
            />
          ) : (
            <Pill className="text-emerald-500/20 h-32 w-32" />
          )}
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Category tag */}
            <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </span>

            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price block */}
            <div className="py-2">
              <span className="text-xs text-gray-400 block font-medium">Retail Price</span>
              <span className="text-2xl font-black text-gray-900">${product.price.toFixed(2)}</span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Description & Dosage</span>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <Award className="h-5 w-5 text-emerald-500" />
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Quality</span>
                  <span className="text-xs font-semibold text-gray-700">FDA Certified</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <FileText className="h-5 w-5 text-emerald-500" />
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Requirement</span>
                  <span className="text-xs font-semibold text-gray-700">OTC Approved</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action Blocks */}
          <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
            
            {/* Stock indicator */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium">Availability:</span>
              {product.stock > 0 ? (
                <span className="text-emerald-600 font-semibold">In Stock ({product.stock} units remaining)</span>
              ) : (
                <span className="text-red-500 font-semibold">Out of Stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                {/* Quantity Editor */}
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-3 py-2 text-gray-500 hover:text-emerald-500 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold text-gray-800 w-12 text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    className="px-3 py-2 text-gray-500 hover:text-emerald-500 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-grow flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add {quantity} to Cart
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
