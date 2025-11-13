import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Users, Package, DollarSign, TrendingUp, FileText } from 'lucide-react';
import FinalProcurementMonthlyTable from './FinalProcurementMonthlyTable';
import { finalProcurementData } from '../../data/finalProcurementData';
import { mockProcurementData, formatCurrency, type ProcurementRequest } from '../../data/retrieveProcurementMockData';

interface RetrieveProcurementRequestTableProps {
  onMaterialDoubleClick?: (materialName: string) => void;
}

const RetrieveProcurementRequestTable: React.FC<RetrieveProcurementRequestTableProps> = ({ onMaterialDoubleClick }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedMaterials, setExpandedMaterials] = useState<Set<string>>(new Set());
  const [expandedProcurementTables, setExpandedProcurementTables] = useState<Set<string>>(new Set());

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

  const toggleProcurementTable = (materialId: string) => {
    setExpandedProcurementTables(prev => {
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
                          {formatCurrency(totalValue)}
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
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Procurement Table
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {items.map((item) => {
                            const isMaterialExpanded = expandedMaterials.has(item.materialId);
                            const isProcurementTableExpanded = expandedProcurementTables.has(item.materialId);
                            const hasProcurementData = finalProcurementData[item.materialName] !== undefined;

                            return (
                              <React.Fragment key={item.id}>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                  <td className="px-4 py-3 text-sm font-mono text-blue-600 dark:text-blue-400">
                                    {item.materialId}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                                    {item.materialName}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                                    {formatCurrency(item.materialValue)}
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
                                  <td className="px-4 py-3 text-sm">
                                    {hasProcurementData ? (
                                      <button
                                        onClick={() => toggleProcurementTable(item.materialId)}
                                        className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                                      >
                                        <FileText className="h-4 w-4" />
                                        <span className="font-medium">See Full Forecast Table</span>
                                        {isProcurementTableExpanded ? (
                                          <ChevronDown className="h-4 w-4" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4" />
                                        )}
                                      </button>
                                    ) : (
                                      <span className="text-gray-400 dark:text-gray-500 text-xs">N/A</span>
                                    )}
                                  </td>
                                </tr>

                                {isMaterialExpanded && (
                                  <tr>
                                    <td colSpan={6} className="px-4 py-3 bg-gray-50 dark:bg-gray-700/30">
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

                                {isProcurementTableExpanded && hasProcurementData && (
                                  <tr>
                                    <td colSpan={6} className="px-4 py-4 bg-gray-50 dark:bg-gray-700/20">
                                      <FinalProcurementMonthlyTable
                                        materialName={item.materialName}
                                        data={finalProcurementData[item.materialName]}
                                      />
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
