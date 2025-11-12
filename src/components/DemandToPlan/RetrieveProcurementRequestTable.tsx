import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Users, Package, DollarSign, TrendingUp } from 'lucide-react';

interface UnitRequest {
  unit: string;
  quantity: string;
}

interface ProcurementRequest {
  id: string;
  materialId: string;
  materialName: string;
  materialValue: number;
  category: string;
  unitRequests: UnitRequest[];
  totalQuantity: string;
}

const mockProcurementData: ProcurementRequest[] = [
  {
    id: '1',
    materialId: 'MTL-073',
    materialName: 'Bottom Ash Removal Systems',
    materialValue: 3700000000,
    category: 'Ash Handling Systems',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '2 systems' },
      { unit: 'UBP Paiton', quantity: '2 systems' },
      { unit: 'PLTU Jawa Tengah', quantity: '1 system' }
    ],
    totalQuantity: '5 systems'
  },
  {
    id: '2',
    materialId: 'MTL-074',
    materialName: 'Fly Ash Handling Equipment',
    materialValue: 4200000000,
    category: 'Ash Handling Systems',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '3 sets' },
      { unit: 'UBP Paiton', quantity: '2 sets' },
      { unit: 'PLTU Indramayu', quantity: '2 sets' }
    ],
    totalQuantity: '7 sets'
  },
  {
    id: '3',
    materialId: 'MTL-075',
    materialName: 'Ash Conveyors',
    materialValue: 2100000000,
    category: 'Ash Handling Systems',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '8 units' },
      { unit: 'UBP Paiton', quantity: '6 units' },
      { unit: 'PLTU Indramayu', quantity: '4 units' },
      { unit: 'PLTU Jawa Tengah', quantity: '3 units' }
    ],
    totalQuantity: '21 units'
  },
  {
    id: '4',
    materialId: 'MTL-076',
    materialName: 'Ash Silos',
    materialValue: 1800000000,
    category: 'Ash Handling Systems',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '4 units' },
      { unit: 'UBP Paiton', quantity: '3 units' },
      { unit: 'PLTU Indramayu', quantity: '2 units' }
    ],
    totalQuantity: '9 units'
  },
  {
    id: '5',
    materialId: 'FLT-001',
    materialName: 'Filter air',
    materialValue: 2800000000,
    category: 'Filters',
    unitRequests: [
      { unit: 'UBP ADP', quantity: '450 units' },
      { unit: 'UBP Suralaya', quantity: '320 units' },
      { unit: 'UBP Paiton', quantity: '280 units' },
      { unit: 'PLTU Indramayu', quantity: '180 units' }
    ],
    totalQuantity: '1,230 units'
  },
  {
    id: '6',
    materialId: 'FLT-002',
    materialName: 'Filter Udara Cartridge',
    materialValue: 3500000000,
    category: 'Filters',
    unitRequests: [
      { unit: 'UBP ADP', quantity: '380 units' },
      { unit: 'UBP Suralaya', quantity: '290 units' },
      { unit: 'UBP Paiton', quantity: '240 units' },
      { unit: 'PLTU Jawa Tengah', quantity: '150 units' }
    ],
    totalQuantity: '1,060 units'
  },
  {
    id: '7',
    materialId: 'FLT-003',
    materialName: 'Oil Filter',
    materialValue: 1900000000,
    category: 'Filters',
    unitRequests: [
      { unit: 'UBP ADP', quantity: '560 units' },
      { unit: 'UBP Suralaya', quantity: '420 units' },
      { unit: 'UBP Paiton', quantity: '340 units' }
    ],
    totalQuantity: '1,320 units'
  },
  {
    id: '8',
    materialId: 'FLT-004',
    materialName: 'Filter Gas',
    materialValue: 2400000000,
    category: 'Filters',
    unitRequests: [
      { unit: 'UBP ADP', quantity: '280 units' },
      { unit: 'UBP Suralaya', quantity: '210 units' },
      { unit: 'PLTU Indramayu', quantity: '180 units' },
      { unit: 'PLTU Jawa Tengah', quantity: '120 units' }
    ],
    totalQuantity: '790 units'
  },
  {
    id: '9',
    materialId: 'FLT-005',
    materialName: 'Filter Udara Kassa',
    materialValue: 1600000000,
    category: 'Filters',
    unitRequests: [
      { unit: 'UBP ADP', quantity: '620 units' },
      { unit: 'UBP Suralaya', quantity: '380 units' },
      { unit: 'UBP Paiton', quantity: '290 units' }
    ],
    totalQuantity: '1,290 units'
  },
  {
    id: '10',
    materialId: 'LBT-001',
    materialName: 'Turbine Oil',
    materialValue: 5200000000,
    category: 'Lubricants & Fluids',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '12,000 liters' },
      { unit: 'UBP Paiton', quantity: '10,500 liters' },
      { unit: 'UBP ADP', quantity: '8,000 liters' },
      { unit: 'PLTU Indramayu', quantity: '6,500 liters' }
    ],
    totalQuantity: '37,000 liters'
  },
  {
    id: '11',
    materialId: 'LBT-002',
    materialName: 'Hydraulic Oil',
    materialValue: 3800000000,
    category: 'Lubricants & Fluids',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '8,500 liters' },
      { unit: 'UBP Paiton', quantity: '7,200 liters' },
      { unit: 'PLTU Jawa Tengah', quantity: '5,800 liters' }
    ],
    totalQuantity: '21,500 liters'
  },
  {
    id: '12',
    materialId: 'LBT-003',
    materialName: 'Gear Oil',
    materialValue: 2900000000,
    category: 'Lubricants & Fluids',
    unitRequests: [
      { unit: 'UBP ADP', quantity: '6,000 liters' },
      { unit: 'UBP Suralaya', quantity: '5,200 liters' },
      { unit: 'UBP Paiton', quantity: '4,800 liters' }
    ],
    totalQuantity: '16,000 liters'
  },
  {
    id: '13',
    materialId: 'ELC-001',
    materialName: 'Circuit Breakers',
    materialValue: 6500000000,
    category: 'Electrical Components',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '45 units' },
      { unit: 'UBP Paiton', quantity: '38 units' },
      { unit: 'PLTU Indramayu', quantity: '32 units' },
      { unit: 'PLTU Jawa Tengah', quantity: '25 units' }
    ],
    totalQuantity: '140 units'
  },
  {
    id: '14',
    materialId: 'ELC-002',
    materialName: 'Transformers',
    materialValue: 8200000000,
    category: 'Electrical Components',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '12 units' },
      { unit: 'UBP Paiton', quantity: '10 units' },
      { unit: 'PLTU Indramayu', quantity: '8 units' }
    ],
    totalQuantity: '30 units'
  },
  {
    id: '15',
    materialId: 'ELC-003',
    materialName: 'Power Cables',
    materialValue: 4100000000,
    category: 'Electrical Components',
    unitRequests: [
      { unit: 'UBP Suralaya', quantity: '15,000 meters' },
      { unit: 'UBP Paiton', quantity: '12,000 meters' },
      { unit: 'UBP ADP', quantity: '9,000 meters' },
      { unit: 'PLTU Jawa Tengah', quantity: '7,500 meters' }
    ],
    totalQuantity: '43,500 meters'
  }
];

const RetrieveProcurementRequestTable: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedMaterials, setExpandedMaterials] = useState<Set<string>>(new Set());

  const retrievedData = mockProcurementData;

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const toggleMaterial = (materialId: string) => {
    setExpandedMaterials(prev => {
      const newSet = new Set(prev);
      if (newSet.has(materialId)) {
        newSet.delete(materialId);
      } else {
        newSet.add(materialId);
      }
      return newSet;
    });
  };

  const groupedData = retrievedData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ProcurementRequest[]>);

  const categories = Object.keys(groupedData);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Retrieve Procurement Request
        </h3>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Retrieved {retrievedData.length} procurement requests grouped into {categories.length} material categories.
          </p>
        </div>

          <div className="space-y-3">
            {categories.map((category) => {
              const items = groupedData[category];
              const isExpanded = expandedCategories.has(category);

              const totalValue = items.reduce((sum, item) => sum + item.materialValue, 0);

              const mostRequestedItem = items.reduce((max, item) => {
                return item.unitRequests.length > max.unitRequests.length ? item : max;
              }, items[0]);

              return (
                <div
                  key={category}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <div
                    onClick={() => toggleCategory(category)}
                    className="bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-3">
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        )}
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {category}
                        </h4>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-3 py-1 rounded-full">
                        {items.length} items
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-4 pb-4">
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center space-x-2 mb-1">
                          <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Items Count</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{items.length}</p>
                      </div>

                      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center space-x-2 mb-1">
                          <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Total Value</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          IDR {(totalValue / 1000).toFixed(3)}.000.000
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center space-x-2 mb-1">
                          <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Most Requested</span>
                        </div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate" title={`${mostRequestedItem.materialName} (${mostRequestedItem.unitRequests.length})`}>
                          {mostRequestedItem.materialName.length > 25
                            ? mostRequestedItem.materialName.substring(0, 25) + '...'
                            : mostRequestedItem.materialName} ({mostRequestedItem.unitRequests.length})
                        </p>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Material ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Material Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Material Value (IDR)
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Unit Requestors
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Total Quantity
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {items.map((item) => {
                            const isMaterialExpanded = expandedMaterials.has(item.materialId);

                            return (
                              <React.Fragment key={item.id}>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                  <td className="px-4 py-3 text-sm font-mono text-blue-600 dark:text-blue-400">
                                    {item.materialId}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                    {item.materialName}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                                    {new Intl.NumberFormat('id-ID').format(item.materialValue)}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    <button
                                      onClick={() => toggleMaterial(item.materialId)}
                                      className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                    >
                                      <Users className="h-4 w-4" />
                                      <span className="font-medium">{item.unitRequests.length} requestors</span>
                                      {isMaterialExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                    </button>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 font-semibold">
                                    {item.totalQuantity}
                                  </td>
                                </tr>

                                {isMaterialExpanded && (
                                  <tr>
                                    <td colSpan={5} className="px-4 py-3 bg-gray-50 dark:bg-gray-700/30">
                                      <div className="space-y-2">
                                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2">
                                          Unit Breakdown:
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                          {item.unitRequests.map((request, idx) => (
                                            <div
                                              key={idx}
                                              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md p-3"
                                            >
                                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {request.unit}
                                              </p>
                                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                Quantity: <span className="font-semibold">{request.quantity}</span>
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
};

export default RetrieveProcurementRequestTable;
