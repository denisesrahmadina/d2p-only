import React from 'react';
import { Package, Building, Clock, Star } from 'lucide-react';
import { MarketplaceItem } from '../../types/marketplace';
import { useTheme } from '../../contexts/ThemeContext';
import { getProductImage } from '../../services/productImageService';

interface ProductCardProps {
  item: MarketplaceItem;
  onAddToCart: (itemId: string) => void;
  onViewDetails: (item: MarketplaceItem) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onAddToCart, onViewDetails }) => {
  const { isDarkMode } = useTheme();

  const handleCardClick = () => {
    onViewDetails(item);
  };

  // Get product image based on item name, category, and item ID for uniqueness
  const productImageUrl = getProductImage(item.item_name, item.category_id, item.item_id);

  return (
    <div
      className={`${
        isDarkMode ? 'bg-neutral-dark-900' : 'bg-white'
      } rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105`}
      onClick={handleCardClick}
    >
      <div className="relative h-48 bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <img
          src={productImageUrl}
          alt={item.item_name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (target.nextElementSibling) {
              (target.nextElementSibling as HTMLElement).style.display = 'flex';
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center" style={{ display: 'none' }}>
          <div className="text-white text-center p-4">
            <Package className="h-16 w-16 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">Image Coming Soon</p>
          </div>
        </div>
        {item.stock_quantity === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Out of Stock
          </div>
        )}
        {item.stock_quantity > 0 && item.stock_quantity < 10 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Low Stock
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">{item.item_code}</p>
            <h3 className="font-bold text-lg mb-1 line-clamp-2 dark:text-white">{item.item_name}</h3>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {item.item_description}
        </p>

        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-300">
          <Building className="h-4 w-4" />
          <span className="truncate">{item.supplier?.supplier_name}</span>
        </div>

        {item.supplier?.performance_rating && (
          <div className="flex items-center gap-1 mb-3">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{item.supplier.performance_rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">/ 5.0</span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-4 text-sm">
          <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-600 dark:text-gray-300">
            Lead time: {item.lead_time_days} days
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-neutral-dark-700">
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Rp {item.unit_price.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300">per {item.unit_of_measure}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item.item_id);
            }}
            disabled={item.stock_quantity === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              item.stock_quantity === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
