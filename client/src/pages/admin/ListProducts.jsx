import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Pill, Trash2, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ListProducts = () => {
  const { products, fetchProducts, loading } = useAppContext();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Simple catalog deletion simulation/mock (In production, write a DELETE /api/product/:id endpoint)
  const handleDeleteMock = (name) => {
    toast.success(`${name} marked for removal from catalog`);
  };

  return (
    <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-xs">
      <div className="flex justify-between items-center border-b border-gray-50 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Pill className="h-6 w-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-gray-800">Inventory Stock Catalog</h2>
        </div>

        <button 
          onClick={fetchProducts}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
          title="Refresh Data"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <Pill className="text-gray-300 h-10 w-10 mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">No inventory data cataloged. Start by adding a product.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="p-4">Product Info</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Units</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {products.map(product => (
                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-50 p-2 text-emerald-600 rounded-lg">
                        <Pill className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-gray-900 block">{product.name}</span>
                        <span className="text-[10px] text-gray-400 font-semibold truncate max-w-[200px] block" title={product.description}>
                          {product.description}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold">{product.category}</td>
                  <td className="p-4 font-bold text-gray-900">${product.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`font-semibold ${product.stock < 10 ? 'text-amber-500 font-bold' : 'text-gray-600'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDeleteMock(product.name)}
                      className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Decommission Product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListProducts;
