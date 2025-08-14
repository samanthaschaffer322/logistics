// Vietnam Administrative Data Service
// Comprehensive Vietnamese administrative divisions for logistics optimization

export interface Province {
  code: string;
  name: string;
  slug: string;
  type: string;
  name_with_type: string;
}

export interface District {
  code: string;
  name: string;
  slug: string;
  type: string;
  name_with_type: string;
  parent_code: string;
}

export interface Ward {
  code: string;
  name: string;
  slug: string;
  type: string;
  name_with_type: string;
  parent_code: string;
}

// Major Vietnamese Provinces for Logistics
export const vietnamProvinces: { [key: string]: Province } = {
  "11": {
    code: "11",
    name: "Hà Nội",
    slug: "ha-noi",
    type: "thanh-pho",
    name_with_type: "Thành phố Hà Nội"
  },
  "12": {
    code: "12",
    name: "Hồ Chí Minh",
    slug: "ho-chi-minh",
    type: "thanh-pho",
    name_with_type: "Thành phố Hồ Chí Minh"
  },
  "13": {
    code: "13",
    name: "Đà Nẵng",
    slug: "da-nang",
    type: "thanh-pho",
    name_with_type: "Thành phố Đà Nẵng"
  },
  "14": {
    code: "14",
    name: "Hải Phòng",
    slug: "hai-phong",
    type: "thanh-pho",
    name_with_type: "Thành phố Hải Phòng"
  },
  "15": {
    code: "15",
    name: "Cần Thơ",
    slug: "can-tho",
    type: "thanh-pho",
    name_with_type: "Thành phố Cần Thơ"
  },
  "20": {
    code: "20",
    name: "Quảng Ninh",
    slug: "quang-ninh",
    type: "tinh",
    name_with_type: "Tỉnh Quảng Ninh"
  },
  "24": {
    code: "24",
    name: "Bắc Giang",
    slug: "bac-giang",
    type: "tinh",
    name_with_type: "Tỉnh Bắc Giang"
  },
  "26": {
    code: "26",
    name: "Phú Thọ",
    slug: "phu-tho",
    type: "tinh",
    name_with_type: "Tỉnh Phú Thọ"
  },
  "30": {
    code: "30",
    name: "Hải Dương",
    slug: "hai-duong",
    type: "tinh",
    name_with_type: "Tỉnh Hải Dương"
  },
  "33": {
    code: "33",
    name: "Hưng Yên",
    slug: "hung-yen",
    type: "tinh",
    name_with_type: "Tỉnh Hưng Yên"
  },
  "35": {
    code: "35",
    name: "Thái Bình",
    slug: "thai-binh",
    type: "tinh",
    name_with_type: "Tỉnh Thái Bình"
  },
  "36": {
    code: "36",
    name: "Nam Định",
    slug: "nam-dinh",
    type: "tinh",
    name_with_type: "Tỉnh Nam Định"
  },
  "40": {
    code: "40",
    name: "Nghệ An",
    slug: "nghe-an",
    type: "tinh",
    name_with_type: "Tỉnh Nghệ An"
  },
  "42": {
    code: "42",
    name: "Hà Tĩnh",
    slug: "ha-tinh",
    type: "tinh",
    name_with_type: "Tỉnh Hà Tĩnh"
  },
  "44": {
    code: "44",
    name: "Quảng Bình",
    slug: "quang-binh",
    type: "tinh",
    name_with_type: "Tỉnh Quảng Bình"
  },
  "45": {
    code: "45",
    name: "Quảng Trị",
    slug: "quang-tri",
    type: "tinh",
    name_with_type: "Tỉnh Quảng Trị"
  },
  "46": {
    code: "46",
    name: "Thừa Thiên Huế",
    slug: "thua-thien-hue",
    type: "tinh",
    name_with_type: "Tỉnh Thừa Thiên Huế"
  },
  "48": {
    code: "48",
    name: "Quảng Nam",
    slug: "quang-nam",
    type: "tinh",
    name_with_type: "Tỉnh Quảng Nam"
  },
  "49": {
    code: "49",
    name: "Quảng Ngãi",
    slug: "quang-ngai",
    type: "tinh",
    name_with_type: "Tỉnh Quảng Ngãi"
  },
  "51": {
    code: "51",
    name: "Bình Định",
    slug: "binh-dinh",
    type: "tinh",
    name_with_type: "Tỉnh Bình Định"
  },
  "52": {
    code: "52",
    name: "Phú Yên",
    slug: "phu-yen",
    type: "tinh",
    name_with_type: "Tỉnh Phú Yên"
  },
  "54": {
    code: "54",
    name: "Khánh Hòa",
    slug: "khanh-hoa",
    type: "tinh",
    name_with_type: "Tỉnh Khánh Hòa"
  },
  "56": {
    code: "56",
    name: "Ninh Thuận",
    slug: "ninh-thuan",
    type: "tinh",
    name_with_type: "Tỉnh Ninh Thuận"
  },
  "58": {
    code: "58",
    name: "Bình Thuận",
    slug: "binh-thuan",
    type: "tinh",
    name_with_type: "Tỉnh Bình Thuận"
  },
  "60": {
    code: "60",
    name: "Đồng Nai",
    slug: "dong-nai",
    type: "tinh",
    name_with_type: "Tỉnh Đồng Nai"
  },
  "62": {
    code: "62",
    name: "Bình Dương",
    slug: "binh-duong",
    type: "tinh",
    name_with_type: "Tỉnh Bình Dương"
  },
  "64": {
    code: "64",
    name: "Bà Rịa - Vũng Tàu",
    slug: "ba-ria-vung-tau",
    type: "tinh",
    name_with_type: "Tỉnh Bà Rịa - Vũng Tàu"
  },
  "66": {
    code: "66",
    name: "Tây Ninh",
    slug: "tay-ninh",
    type: "tinh",
    name_with_type: "Tỉnh Tây Ninh"
  },
  "67": {
    code: "67",
    name: "Long An",
    slug: "long-an",
    type: "tinh",
    name_with_type: "Tỉnh Long An"
  },
  "68": {
    code: "68",
    name: "Tiền Giang",
    slug: "tien-giang",
    type: "tinh",
    name_with_type: "Tỉnh Tiền Giang"
  },
  "70": {
    code: "70",
    name: "Bến Tre",
    slug: "ben-tre",
    type: "tinh",
    name_with_type: "Tỉnh Bến Tre"
  },
  "72": {
    code: "72",
    name: "Vĩnh Long",
    slug: "vinh-long",
    type: "tinh",
    name_with_type: "Tỉnh Vĩnh Long"
  },
  "74": {
    code: "74",
    name: "Đồng Tháp",
    slug: "dong-thap",
    type: "tinh",
    name_with_type: "Tỉnh Đồng Tháp"
  },
  "75": {
    code: "75",
    name: "An Giang",
    slug: "an-giang",
    type: "tinh",
    name_with_type: "Tỉnh An Giang"
  },
  "77": {
    code: "77",
    name: "Kiên Giang",
    slug: "kien-giang",
    type: "tinh",
    name_with_type: "Tỉnh Kiên Giang"
  },
  "79": {
    code: "79",
    name: "Cà Mau",
    slug: "ca-mau",
    type: "tinh",
    name_with_type: "Tỉnh Cà Mau"
  },
  "80": {
    code: "80",
    name: "Sóc Trăng",
    slug: "soc-trang",
    type: "tinh",
    name_with_type: "Tỉnh Sóc Trăng"
  },
  "82": {
    code: "82",
    name: "Bạc Liêu",
    slug: "bac-lieu",
    type: "tinh",
    name_with_type: "Tỉnh Bạc Liêu"
  },
  "83": {
    code: "83",
    name: "Hậu Giang",
    slug: "hau-giang",
    type: "tinh",
    name_with_type: "Tỉnh Hậu Giang"
  }
};

// Vietnam Administrative Service
export class VietnamAdministrativeService {
  
  // Get all provinces
  getAllProvinces(): Province[] {
    return Object.values(vietnamProvinces);
  }

  // Get province by code
  getProvinceByCode(code: string): Province | undefined {
    return vietnamProvinces[code];
  }

  // Search provinces by name
  searchProvinces(query: string): Province[] {
    const searchTerm = query.toLowerCase();
    return Object.values(vietnamProvinces).filter(province => 
      province.name.toLowerCase().includes(searchTerm) ||
      province.slug.includes(searchTerm) ||
      province.name_with_type.toLowerCase().includes(searchTerm)
    );
  }

  // Get major logistics provinces
  getMajorLogisticsProvinces(): Province[] {
    const majorCodes = ['11', '12', '13', '14', '15', '60', '62', '64', '67', '68'];
    return majorCodes.map(code => vietnamProvinces[code]).filter(Boolean);
  }

  // Get provinces by region
  getProvincesByRegion(region: 'north' | 'central' | 'south'): Province[] {
    const regionCodes = {
      north: ['11', '20', '24', '26', '30', '33', '35', '36'],
      central: ['13', '40', '42', '44', '45', '46', '48', '49', '51', '52', '54', '56', '58'],
      south: ['12', '14', '15', '60', '62', '64', '66', '67', '68', '70', '72', '74', '75', '77', '79', '80', '82', '83']
    };

    return regionCodes[region].map(code => vietnamProvinces[code]).filter(Boolean);
  }

  // Get province coordinates (approximate center)
  getProvinceCoordinates(code: string): [number, number] | null {
    const coordinates: { [key: string]: [number, number] } = {
      '11': [21.0285, 105.8542], // Hà Nội
      '12': [10.8231, 106.6297], // Hồ Chí Minh
      '13': [16.0678, 108.2208], // Đà Nẵng
      '14': [20.8648, 106.6881], // Hải Phòng
      '15': [10.0452, 105.7469], // Cần Thơ
      '20': [21.0064, 107.2925], // Quảng Ninh
      '60': [10.9804, 106.8441], // Đồng Nai
      '62': [10.9804, 106.6519], // Bình Dương
      '64': [10.4113, 107.1362], // Bà Rịa - Vũng Tàu
      '67': [10.6956, 106.2431], // Long An
      '68': [10.4493, 106.3420]  // Tiền Giang
    };

    return coordinates[code] || null;
  }

  // Format address for logistics
  formatLogisticsAddress(province: Province, district?: string, ward?: string): string {
    let address = province.name_with_type;
    if (district) address = `${district}, ${address}`;
    if (ward) address = `${ward}, ${address}`;
    return address;
  }

  // Check if province is major logistics hub
  isMajorLogisticsHub(code: string): boolean {
    const majorHubs = ['11', '12', '13', '14', '15', '60', '62', '64'];
    return majorHubs.includes(code);
  }

  // Get logistics importance score
  getLogisticsImportanceScore(code: string): number {
    const scores: { [key: string]: number } = {
      '12': 10, // Hồ Chí Minh - Highest
      '11': 9,  // Hà Nội
      '13': 8,  // Đà Nẵng
      '14': 8,  // Hải Phòng
      '60': 7,  // Đồng Nai
      '62': 7,  // Bình Dương
      '15': 6,  // Cần Thơ
      '64': 6,  // Bà Rịa - Vũng Tàu
      '67': 5,  // Long An
      '68': 5   // Tiền Giang
    };

    return scores[code] || 3; // Default score for other provinces
  }
}

export const vietnamAdminService = new VietnamAdministrativeService();
