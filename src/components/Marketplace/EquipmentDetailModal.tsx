import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Package,
  Building2,
  Star,
  Clock,
  TrendingUp,
  Shield,
  FileText,
  Truck,
  CheckCircle
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { MarketplaceItem } from '../../types/marketplace';

interface EquipmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MarketplaceItem;
  onAddToCart: (itemId: string, quantity: number) => void;
}

const EquipmentDetailModal: React.FC<EquipmentDetailModalProps> = ({
  isOpen,
  onClose,
  item,
  onAddToCart
}) => {
  const { isDarkMode } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  if (!isOpen) return null;

  const handleIncrement = () => {
    if (quantity < item.stock_quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= item.stock_quantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await onAddToCart(item.item_id, quantity);
      setTimeout(() => {
        setAdding(false);
        onClose();
      }, 500);
    } catch (error) {
      setAdding(false);
      console.error('Error adding to cart:', error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const totalPrice = item.unit_price * quantity;
  const stockPercentage = (item.stock_quantity / 100) * 100;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div
        className={`${
          isDarkMode ? 'bg-neutral-dark-900' : 'bg-white'
        } rounded-xl shadow-2xl max-w-5xl w-full my-8 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Equipment Details
                </h2>
                <p className="text-blue-100">
                  Complete specifications and purchasing options
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 dark:text-white">{item.item_name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-3">
                      Product Code: <span className="font-mono font-semibold dark:text-gray-200">{item.item_code}</span>
                    </p>
                  </div>
                  <div>
                    {item.stock_quantity === 0 ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                        Out of Stock
                      </span>
                    ) : item.stock_quantity < 10 ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        In Stock
                      </span>
                    )}
                  </div>
                </div>

                {item.category && (
                  <div className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm">
                    <Package className="h-4 w-4 mr-2" />
                    {item.category.category_name}
                  </div>
                )}
              </div>

              <div className={`${isDarkMode ? 'bg-neutral-dark-800' : 'bg-gray-50'} rounded-lg p-4`}>
                <h4 className="font-semibold mb-2 flex items-center dark:text-white">
                  <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Description
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {item.item_description || 'No description available'}
                </p>
              </div>

              {item.technical_specifications && Object.keys(item.technical_specifications).length > 0 && (
                <div className={`${isDarkMode ? 'bg-neutral-dark-800' : 'bg-gray-50'} rounded-lg p-4`}>
                  <h4 className="font-semibold mb-3 flex items-center dark:text-white">
                    <Shield className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(item.technical_specifications).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-200 dark:border-neutral-dark-700 pb-2">
                        <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p className="text-sm font-medium dark:text-gray-100">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {item.compliance_certifications && item.compliance_certifications.length > 0 && (
                <div className={`${isDarkMode ? 'bg-neutral-dark-800' : 'bg-gray-50'} rounded-lg p-4`}>
                  <h4 className="font-semibold mb-3 flex items-center dark:text-white">
                    <CheckCircle className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Compliance & Certifications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.compliance_certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className={`${isDarkMode ? 'bg-neutral-dark-800' : 'bg-gray-50'} rounded-lg p-4`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold dark:text-white">Lead Time</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{item.lead_time_days}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">working days</p>
                </div>

                <div className={`${isDarkMode ? 'bg-neutral-dark-800' : 'bg-gray-50'} rounded-lg p-4`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold dark:text-white">Availability</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {item.stock_quantity}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">{item.unit_of_measure} available</p>
                </div>
              </div>

              {item.warranty_info && (
                <div className={`${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'} rounded-lg p-4 border border-blue-200 dark:border-blue-800`}>
                  <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Warranty Information</h4>
                  <p className="text-sm dark:text-gray-200">{item.warranty_info}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className={`${isDarkMode ? 'bg-neutral-dark-800' : 'bg-gray-50'} rounded-lg p-4`}>
                <div className="flex items-center space-x-2 mb-4">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-semibold dark:text-white">Supplier Information</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">Supplier Name</p>
                    <p className="font-semibold dark:text-gray-100">{item.supplier?.supplier_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">Supplier Code</p>
                    <p className="font-mono text-sm dark:text-gray-100">{item.supplier?.supplier_code}</p>
                  </div>
                  {item.supplier?.performance_rating && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">Performance Rating</p>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-lg font-bold dark:text-white">{item.supplier.performance_rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-300">/ 5.0</span>
                      </div>
                    </div>
                  )}
                  {item.supplier?.is_pln_approved && (
                    <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span>PLN Approved Supplier</span>
                    </div>
                  )}
                  {item.supplier?.certifications && item.supplier.certifications.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-300 mb-2">Certifications</p>
                      <div className="flex flex-wrap gap-1">
                        {item.supplier.certifications.map((cert, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-neutral-dark-800' : 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'} rounded-lg p-4 border-2 border-blue-200 dark:border-blue-700`}>
                <h4 className="font-semibold mb-4 dark:text-white">Pricing & Order</h4>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Unit Price</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      Rp {item.unit_price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                    per {item.unit_of_measure}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 dark:text-white">Quantity</label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        isDarkMode
                          ? 'bg-neutral-dark-700 hover:bg-neutral-dark-600'
                          : 'bg-gray-200 hover:bg-gray-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min={1}
                      max={item.stock_quantity}
                      className={`flex-1 h-10 px-3 text-center rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode
                          ? 'bg-neutral-dark-700 border-neutral-dark-600'
                          : 'bg-white border-gray-300'
                      }`}
                    />
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= item.stock_quantity}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        isDarkMode
                          ? 'bg-neutral-dark-700 hover:bg-neutral-dark-600'
                          : 'bg-gray-200 hover:bg-gray-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                    Maximum: {item.stock_quantity.toLocaleString()} {item.unit_of_measure}
                  </p>
                </div>

                <div className={`${isDarkMode ? 'bg-neutral-dark-900' : 'bg-white'} rounded-lg p-3 mb-4`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Subtotal</span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      Rp {totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    {quantity} × Rp {item.unit_price.toLocaleString('id-ID')}
                  </p>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding || item.stock_quantity === 0}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors disabled:cursor-not-allowed shadow-lg"
                >
                  {adding ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Adding to Cart...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailModal;
