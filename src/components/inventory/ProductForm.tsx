import React from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Tables } from '../../lib/supabase';

type Product = Tables<'products'>;

interface ProductFormProps {
  product: Product | null;
  categories: string[];
  onSubmit: (data: Omit<Product, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  onSubmit,
  onCancel,
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch
  } = useForm<Omit<Product, 'id' | 'created_at'>>({
    defaultValues: product ? {
      name: product.name,
      description: product.description || '',
      category: product.category,
      price: product.price,
      stock_quantity: product.stock_quantity,
      critical_level: product.critical_level,
      image_url: product.image_url || '',
    } : {
      name: '',
      description: '',
      category: categories[0] || '',
      price: 0,
      stock_quantity: 0,
      critical_level: 5,
      image_url: '',
    }
  });
  
  const watchImageUrl = watch('image_url');
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name*
              </label>
              <input
                id="name"
                type="text"
                className={`block w-full border ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                {...register('name', { required: 'Product name is required' })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                {...register('description')}
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <div>
                <input
                  id="category"
                  type="text"
                  list="categories"
                  className={`block w-full border ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  {...register('category', { required: 'Category is required' })}
                />
                <datalist id="categories">
                  {categories.map(category => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)*
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                className={`block w-full border ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                {...register('price', { 
                  required: 'Price is required',
                  min: {
                    value: 0,
                    message: 'Price cannot be negative'
                  },
                  valueAsNumber: true
                })}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity*
              </label>
              <input
                id="stock_quantity"
                type="number"
                min="0"
                className={`block w-full border ${
                  errors.stock_quantity ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                {...register('stock_quantity', { 
                  required: 'Stock quantity is required',
                  min: {
                    value: 0,
                    message: 'Stock cannot be negative'
                  },
                  valueAsNumber: true
                })}
              />
              {errors.stock_quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.stock_quantity.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="critical_level" className="block text-sm font-medium text-gray-700 mb-1">
                Critical Level*
              </label>
              <input
                id="critical_level"
                type="number"
                min="0"
                className={`block w-full border ${
                  errors.critical_level ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                {...register('critical_level', { 
                  required: 'Critical level is required',
                  min: {
                    value: 0,
                    message: 'Critical level cannot be negative'
                  },
                  valueAsNumber: true
                })}
              />
              {errors.critical_level && (
                <p className="mt-1 text-sm text-red-600">{errors.critical_level.message}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                id="image_url"
                type="text"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                {...register('image_url')}
              />
              
              {watchImageUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                  <img 
                    src={watchImageUrl} 
                    alt="Product preview" 
                    className="h-16 w-16 object-cover rounded border border-gray-300" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
            <button
              type="button"
              onClick={onCancel}
              className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#1e88e5] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;