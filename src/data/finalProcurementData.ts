interface MonthlyProcurementData {
  month: string;
  netProcurement: number;
  unitPrice: number;
  totalAmount: number;
}

interface MaterialProcurementData {
  totalQuantity: number;
  unitPrice: number;
  totalAmount: number;
  monthlyData: MonthlyProcurementData[];
}

export const finalProcurementData: Record<string, MaterialProcurementData> = {
  'Filter air': {
    totalQuantity: 8000,
    unitPrice: 2500000,
    totalAmount: 20000000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 600, unitPrice: 2500000, totalAmount: 1500000000 },
      { month: 'Feb', netProcurement: 689, unitPrice: 2500000, totalAmount: 1722500000 },
      { month: 'Mar', netProcurement: 704, unitPrice: 2500000, totalAmount: 1760000000 },
      { month: 'Apr', netProcurement: 602, unitPrice: 2500000, totalAmount: 1505000000 },
      { month: 'May', netProcurement: 632, unitPrice: 2500000, totalAmount: 1580000000 },
      { month: 'Jun', netProcurement: 647, unitPrice: 2500000, totalAmount: 1617500000 },
      { month: 'Jul', netProcurement: 659, unitPrice: 2500000, totalAmount: 1647500000 },
      { month: 'Aug', netProcurement: 698, unitPrice: 2500000, totalAmount: 1745000000 },
      { month: 'Sep', netProcurement: 672, unitPrice: 2500000, totalAmount: 1680000000 },
      { month: 'Oct', netProcurement: 699, unitPrice: 2500000, totalAmount: 1747500000 },
      { month: 'Nov', netProcurement: 632, unitPrice: 2500000, totalAmount: 1580000000 },
      { month: 'Dec', netProcurement: 766, unitPrice: 2500000, totalAmount: 1915000000 }
    ]
  },
  'Filter Udara Cartridge': {
    totalQuantity: 1060,
    unitPrice: 3301887,
    totalAmount: 3500000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 82, unitPrice: 3301887, totalAmount: 270754734 },
      { month: 'Feb', netProcurement: 85, unitPrice: 3301887, totalAmount: 280660395 },
      { month: 'Mar', netProcurement: 87, unitPrice: 3301887, totalAmount: 287264169 },
      { month: 'Apr', netProcurement: 90, unitPrice: 3301887, totalAmount: 297169830 },
      { month: 'May', netProcurement: 92, unitPrice: 3301887, totalAmount: 303773604 },
      { month: 'Jun', netProcurement: 88, unitPrice: 3301887, totalAmount: 290566056 },
      { month: 'Jul', netProcurement: 91, unitPrice: 3301887, totalAmount: 300471717 },
      { month: 'Aug', netProcurement: 93, unitPrice: 3301887, totalAmount: 307075491 },
      { month: 'Sep', netProcurement: 86, unitPrice: 3301887, totalAmount: 283962282 },
      { month: 'Oct', netProcurement: 89, unitPrice: 3301887, totalAmount: 293867943 },
      { month: 'Nov', netProcurement: 94, unitPrice: 3301887, totalAmount: 310377378 },
      { month: 'Dec', netProcurement: 83, unitPrice: 3301887, totalAmount: 274056621 }
    ]
  },
  'Oil Filter': {
    totalQuantity: 1320,
    unitPrice: 1439393,
    totalAmount: 1900000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 105, unitPrice: 1439393, totalAmount: 151136265 },
      { month: 'Feb', netProcurement: 108, unitPrice: 1439393, totalAmount: 155454444 },
      { month: 'Mar', netProcurement: 110, unitPrice: 1439393, totalAmount: 158333230 },
      { month: 'Apr', netProcurement: 112, unitPrice: 1439393, totalAmount: 161212016 },
      { month: 'May', netProcurement: 115, unitPrice: 1439393, totalAmount: 165530195 },
      { month: 'Jun', netProcurement: 110, unitPrice: 1439393, totalAmount: 158333230 },
      { month: 'Jul', netProcurement: 113, unitPrice: 1439393, totalAmount: 162651409 },
      { month: 'Aug', netProcurement: 116, unitPrice: 1439393, totalAmount: 166969588 },
      { month: 'Sep', netProcurement: 107, unitPrice: 1439393, totalAmount: 154015051 },
      { month: 'Oct', netProcurement: 111, unitPrice: 1439393, totalAmount: 159772623 },
      { month: 'Nov', netProcurement: 114, unitPrice: 1439393, totalAmount: 164090802 },
      { month: 'Dec', netProcurement: 109, unitPrice: 1439393, totalAmount: 156893837 }
    ]
  },
  'Filter Gas': {
    totalQuantity: 790,
    unitPrice: 3037974,
    totalAmount: 2400000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 62, unitPrice: 3037974, totalAmount: 188354388 },
      { month: 'Feb', netProcurement: 64, unitPrice: 3037974, totalAmount: 194430336 },
      { month: 'Mar', netProcurement: 66, unitPrice: 3037974, totalAmount: 200506284 },
      { month: 'Apr', netProcurement: 67, unitPrice: 3037974, totalAmount: 203544258 },
      { month: 'May', netProcurement: 69, unitPrice: 3037974, totalAmount: 209620206 },
      { month: 'Jun', netProcurement: 65, unitPrice: 3037974, totalAmount: 197468310 },
      { month: 'Jul', netProcurement: 68, unitPrice: 3037974, totalAmount: 206582232 },
      { month: 'Aug', netProcurement: 70, unitPrice: 3037974, totalAmount: 212658180 },
      { month: 'Sep', netProcurement: 64, unitPrice: 3037974, totalAmount: 194430336 },
      { month: 'Oct', netProcurement: 66, unitPrice: 3037974, totalAmount: 200506284 },
      { month: 'Nov', netProcurement: 68, unitPrice: 3037974, totalAmount: 206582232 },
      { month: 'Dec', netProcurement: 61, unitPrice: 3037974, totalAmount: 185316414 }
    ]
  },
  'Filter Udara Kassa': {
    totalQuantity: 1290,
    unitPrice: 1240310,
    totalAmount: 1600000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 103, unitPrice: 1240310, totalAmount: 127751930 },
      { month: 'Feb', netProcurement: 106, unitPrice: 1240310, totalAmount: 131472860 },
      { month: 'Mar', netProcurement: 108, unitPrice: 1240310, totalAmount: 133953480 },
      { month: 'Apr', netProcurement: 110, unitPrice: 1240310, totalAmount: 136434100 },
      { month: 'May', netProcurement: 112, unitPrice: 1240310, totalAmount: 138914720 },
      { month: 'Jun', netProcurement: 107, unitPrice: 1240310, totalAmount: 132713170 },
      { month: 'Jul', netProcurement: 109, unitPrice: 1240310, totalAmount: 135193790 },
      { month: 'Aug', netProcurement: 111, unitPrice: 1240310, totalAmount: 137674410 },
      { month: 'Sep', netProcurement: 105, unitPrice: 1240310, totalAmount: 130232550 },
      { month: 'Oct', netProcurement: 108, unitPrice: 1240310, totalAmount: 133953480 },
      { month: 'Nov', netProcurement: 110, unitPrice: 1240310, totalAmount: 136434100 },
      { month: 'Dec', netProcurement: 101, unitPrice: 1240310, totalAmount: 125271310 }
    ]
  },
  'Bottom Ash Removal Systems': {
    totalQuantity: 5,
    unitPrice: 740000000,
    totalAmount: 3700000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 },
      { month: 'Feb', netProcurement: 1, unitPrice: 740000000, totalAmount: 740000000 },
      { month: 'Mar', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 },
      { month: 'Apr', netProcurement: 1, unitPrice: 740000000, totalAmount: 740000000 },
      { month: 'May', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 },
      { month: 'Jun', netProcurement: 1, unitPrice: 740000000, totalAmount: 740000000 },
      { month: 'Jul', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 },
      { month: 'Aug', netProcurement: 1, unitPrice: 740000000, totalAmount: 740000000 },
      { month: 'Sep', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 },
      { month: 'Oct', netProcurement: 1, unitPrice: 740000000, totalAmount: 740000000 },
      { month: 'Nov', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 },
      { month: 'Dec', netProcurement: 0, unitPrice: 740000000, totalAmount: 0 }
    ]
  },
  'Fly Ash Handling Equipment': {
    totalQuantity: 7,
    unitPrice: 600000000,
    totalAmount: 4200000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'Feb', netProcurement: 0, unitPrice: 600000000, totalAmount: 0 },
      { month: 'Mar', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'Apr', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'May', netProcurement: 0, unitPrice: 600000000, totalAmount: 0 },
      { month: 'Jun', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'Jul', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'Aug', netProcurement: 0, unitPrice: 600000000, totalAmount: 0 },
      { month: 'Sep', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'Oct', netProcurement: 1, unitPrice: 600000000, totalAmount: 600000000 },
      { month: 'Nov', netProcurement: 0, unitPrice: 600000000, totalAmount: 0 },
      { month: 'Dec', netProcurement: 0, unitPrice: 600000000, totalAmount: 0 }
    ]
  },
  'Ash Conveyors': {
    totalQuantity: 21,
    unitPrice: 100000000,
    totalAmount: 2100000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Feb', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Mar', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Apr', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'May', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Jun', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Jul', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Aug', netProcurement: 1, unitPrice: 100000000, totalAmount: 100000000 },
      { month: 'Sep', netProcurement: 1, unitPrice: 100000000, totalAmount: 100000000 },
      { month: 'Oct', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Nov', netProcurement: 2, unitPrice: 100000000, totalAmount: 200000000 },
      { month: 'Dec', netProcurement: 1, unitPrice: 100000000, totalAmount: 100000000 }
    ]
  },
  'Ash Silos': {
    totalQuantity: 9,
    unitPrice: 200000000,
    totalAmount: 1800000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Feb', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Mar', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Apr', netProcurement: 0, unitPrice: 200000000, totalAmount: 0 },
      { month: 'May', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Jun', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Jul', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Aug', netProcurement: 0, unitPrice: 200000000, totalAmount: 0 },
      { month: 'Sep', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Oct', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Nov', netProcurement: 1, unitPrice: 200000000, totalAmount: 200000000 },
      { month: 'Dec', netProcurement: 0, unitPrice: 200000000, totalAmount: 0 }
    ]
  },
  'Turbine Oil': {
    totalQuantity: 37000,
    unitPrice: 140540,
    totalAmount: 5200000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 3000, unitPrice: 140540, totalAmount: 421620000 },
      { month: 'Feb', netProcurement: 3100, unitPrice: 140540, totalAmount: 435674000 },
      { month: 'Mar', netProcurement: 3200, unitPrice: 140540, totalAmount: 449728000 },
      { month: 'Apr', netProcurement: 3000, unitPrice: 140540, totalAmount: 421620000 },
      { month: 'May', netProcurement: 3100, unitPrice: 140540, totalAmount: 435674000 },
      { month: 'Jun', netProcurement: 3200, unitPrice: 140540, totalAmount: 449728000 },
      { month: 'Jul', netProcurement: 3000, unitPrice: 140540, totalAmount: 421620000 },
      { month: 'Aug', netProcurement: 3100, unitPrice: 140540, totalAmount: 435674000 },
      { month: 'Sep', netProcurement: 3000, unitPrice: 140540, totalAmount: 421620000 },
      { month: 'Oct', netProcurement: 3200, unitPrice: 140540, totalAmount: 449728000 },
      { month: 'Nov', netProcurement: 3000, unitPrice: 140540, totalAmount: 421620000 },
      { month: 'Dec', netProcurement: 3100, unitPrice: 140540, totalAmount: 435674000 }
    ]
  },
  'Hydraulic Oil': {
    totalQuantity: 21500,
    unitPrice: 176744,
    totalAmount: 3800000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 1800, unitPrice: 176744, totalAmount: 318139200 },
      { month: 'Feb', netProcurement: 1900, unitPrice: 176744, totalAmount: 335813600 },
      { month: 'Mar', netProcurement: 1700, unitPrice: 176744, totalAmount: 300464800 },
      { month: 'Apr', netProcurement: 1800, unitPrice: 176744, totalAmount: 318139200 },
      { month: 'May', netProcurement: 1900, unitPrice: 176744, totalAmount: 335813600 },
      { month: 'Jun', netProcurement: 1700, unitPrice: 176744, totalAmount: 300464800 },
      { month: 'Jul', netProcurement: 1800, unitPrice: 176744, totalAmount: 318139200 },
      { month: 'Aug', netProcurement: 1900, unitPrice: 176744, totalAmount: 335813600 },
      { month: 'Sep', netProcurement: 1700, unitPrice: 176744, totalAmount: 300464800 },
      { month: 'Oct', netProcurement: 1800, unitPrice: 176744, totalAmount: 318139200 },
      { month: 'Nov', netProcurement: 1900, unitPrice: 176744, totalAmount: 335813600 },
      { month: 'Dec', netProcurement: 1600, unitPrice: 176744, totalAmount: 282790400 }
    ]
  },
  'Gear Oil': {
    totalQuantity: 16000,
    unitPrice: 181250,
    totalAmount: 2900000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 1300, unitPrice: 181250, totalAmount: 235625000 },
      { month: 'Feb', netProcurement: 1400, unitPrice: 181250, totalAmount: 253750000 },
      { month: 'Mar', netProcurement: 1300, unitPrice: 181250, totalAmount: 235625000 },
      { month: 'Apr', netProcurement: 1400, unitPrice: 181250, totalAmount: 253750000 },
      { month: 'May', netProcurement: 1300, unitPrice: 181250, totalAmount: 235625000 },
      { month: 'Jun', netProcurement: 1400, unitPrice: 181250, totalAmount: 253750000 },
      { month: 'Jul', netProcurement: 1300, unitPrice: 181250, totalAmount: 235625000 },
      { month: 'Aug', netProcurement: 1400, unitPrice: 181250, totalAmount: 253750000 },
      { month: 'Sep', netProcurement: 1300, unitPrice: 181250, totalAmount: 235625000 },
      { month: 'Oct', netProcurement: 1400, unitPrice: 181250, totalAmount: 253750000 },
      { month: 'Nov', netProcurement: 1300, unitPrice: 181250, totalAmount: 235625000 },
      { month: 'Dec', netProcurement: 1200, unitPrice: 181250, totalAmount: 217500000 }
    ]
  },
  'Circuit Breakers': {
    totalQuantity: 140,
    unitPrice: 46428571,
    totalAmount: 6500000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 12, unitPrice: 46428571, totalAmount: 557142852 },
      { month: 'Feb', netProcurement: 11, unitPrice: 46428571, totalAmount: 510714281 },
      { month: 'Mar', netProcurement: 12, unitPrice: 46428571, totalAmount: 557142852 },
      { month: 'Apr', netProcurement: 12, unitPrice: 46428571, totalAmount: 557142852 },
      { month: 'May', netProcurement: 11, unitPrice: 46428571, totalAmount: 510714281 },
      { month: 'Jun', netProcurement: 12, unitPrice: 46428571, totalAmount: 557142852 },
      { month: 'Jul', netProcurement: 12, unitPrice: 46428571, totalAmount: 557142852 },
      { month: 'Aug', netProcurement: 11, unitPrice: 46428571, totalAmount: 510714281 },
      { month: 'Sep', netProcurement: 12, unitPrice: 46428571, totalAmount: 557142852 },
      { month: 'Oct', netProcurement: 12, unitPrice: 46428571, totalAmount: 557142852 },
      { month: 'Nov', netProcurement: 11, unitPrice: 46428571, totalAmount: 510714281 },
      { month: 'Dec', netProcurement: 12, unitPrice: 46428571, totalAmount: 557142852 }
    ]
  },
  'Transformers': {
    totalQuantity: 30,
    unitPrice: 273333333,
    totalAmount: 8200000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 3, unitPrice: 273333333, totalAmount: 819999999 },
      { month: 'Feb', netProcurement: 2, unitPrice: 273333333, totalAmount: 546666666 },
      { month: 'Mar', netProcurement: 3, unitPrice: 273333333, totalAmount: 819999999 },
      { month: 'Apr', netProcurement: 2, unitPrice: 273333333, totalAmount: 546666666 },
      { month: 'May', netProcurement: 3, unitPrice: 273333333, totalAmount: 819999999 },
      { month: 'Jun', netProcurement: 2, unitPrice: 273333333, totalAmount: 546666666 },
      { month: 'Jul', netProcurement: 3, unitPrice: 273333333, totalAmount: 819999999 },
      { month: 'Aug', netProcurement: 2, unitPrice: 273333333, totalAmount: 546666666 },
      { month: 'Sep', netProcurement: 3, unitPrice: 273333333, totalAmount: 819999999 },
      { month: 'Oct', netProcurement: 2, unitPrice: 273333333, totalAmount: 546666666 },
      { month: 'Nov', netProcurement: 3, unitPrice: 273333333, totalAmount: 819999999 },
      { month: 'Dec', netProcurement: 2, unitPrice: 273333333, totalAmount: 546666666 }
    ]
  },
  'Power Cables': {
    totalQuantity: 43500,
    unitPrice: 94252,
    totalAmount: 4100000000,
    monthlyData: [
      { month: 'Jan', netProcurement: 3600, unitPrice: 94252, totalAmount: 339307200 },
      { month: 'Feb', netProcurement: 3700, unitPrice: 94252, totalAmount: 348732400 },
      { month: 'Mar', netProcurement: 3600, unitPrice: 94252, totalAmount: 339307200 },
      { month: 'Apr', netProcurement: 3700, unitPrice: 94252, totalAmount: 348732400 },
      { month: 'May', netProcurement: 3600, unitPrice: 94252, totalAmount: 339307200 },
      { month: 'Jun', netProcurement: 3700, unitPrice: 94252, totalAmount: 348732400 },
      { month: 'Jul', netProcurement: 3600, unitPrice: 94252, totalAmount: 339307200 },
      { month: 'Aug', netProcurement: 3700, unitPrice: 94252, totalAmount: 348732400 },
      { month: 'Sep', netProcurement: 3500, unitPrice: 94252, totalAmount: 329882000 },
      { month: 'Oct', netProcurement: 3700, unitPrice: 94252, totalAmount: 348732400 },
      { month: 'Nov', netProcurement: 3600, unitPrice: 94252, totalAmount: 339307200 },
      { month: 'Dec', netProcurement: 3400, unitPrice: 94252, totalAmount: 320456800 }
    ]
  }
};
