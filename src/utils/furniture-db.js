/**
 * 家具库数据配置
 * 可扩展的家具模板与参数定义
 */

export const FURNITURE_DB = {
  // 卧室家具
  bed: {
    "Master bed + frame": {
      category: "bed",
      zone: "master",
      defaultPosition: { x: 1500, z: 2350 },
      dimensions: { w: 1800, d: 2100, h: 450 },
      materials: { main: "fabric", accent: "wood" },
      colors: { main: 0xf3efe4, accent: 0xb98a5e },
      draggable: true,
      tags: ["queen", "upholstered", "modern"],
    },
    "Bedroom 2 bed": {
      category: "bed",
      zone: "bed2",
      defaultPosition: { x: 4800, z: 2600 },
      dimensions: { w: 1500, d: 2000, h: 420 },
      materials: { main: "fabric", accent: "wood" },
      colors: { main: 0xf1ede2, accent: 0xb98a5e },
      draggable: true,
      tags: ["single", "modern"],
    },
    "Bedroom 3 mattress/bed": {
      category: "mattress",
      zone: "bed3",
      defaultPosition: { x: 5200, z: 5900 },
      dimensions: { w: 1400, d: 2000, h: 280 },
      materials: { main: "fabric" },
      colors: { main: 0xf1ede2 },
      draggable: true,
      tags: ["single", "minimalist"],
    },
  },

  // 衣柜与收纳
  wardrobe: {
    "Master metal wardrobe": {
      category: "wardrobe",
      zone: "master",
      defaultPosition: { x: 450, z: 4700 },
      dimensions: { w: 650, d: 2200, h: 2300 },
      materials: { main: "metalWardrobe", handles: "metal" },
      colors: { main: 0xf1efe8, handles: 0x2b2b2b },
      draggable: true,
      metallic: true,
      tags: ["metal", "industrial", "full-height"],
    },
    "Bedroom 2 wardrobe": {
      category: "wardrobe",
      zone: "bed2",
      defaultPosition: { x: 6200, z: 550 },
      dimensions: { w: 600, d: 2100, h: 2200 },
      materials: { main: "wardrobe" },
      colors: { main: 0xf1efe8 },
      draggable: true,
      metallic: false,
      tags: ["white", "full-height"],
    },
    "Bedroom 3 built-in wardrobe": {
      category: "wardrobe",
      zone: "bed3",
      defaultPosition: { x: 4450, z: 6750 },
      dimensions: { w: 500, d: 1800, h: 2300 },
      materials: { main: "wardrobe" },
      colors: { main: 0xf1efe8 },
      draggable: true,
      metallic: false,
      tags: ["white", "built-in"],
    },
  },

  // 客厅家具
  seating: {
    "Living sofa": {
      category: "sofa",
      zone: "living",
      defaultPosition: { x: 8250, z: 3300 },
      dimensions: { w: 2900, d: 900, h: 800 },
      materials: { main: "fabric", legs: "wood" },
      colors: { main: 0xf4f0e5, legs: 0xb98a5e },
      draggable: true,
      tags: ["sectional", "modern", "minimalist"],
    },
    "Living armchair": {
      category: "armchair",
      zone: "living",
      defaultPosition: { x: 7350, z: 3900 },
      dimensions: { w: 850, d: 850, h: 780 },
      materials: { main: "fabric", legs: "wood" },
      colors: { main: 0x93a67c, legs: 0x2b2b2b }, // 鼠尾草绿点缀
      draggable: true,
      tags: ["accent", "sage-green", "modern"],
    },
  },

  // 餐厅家具
  dining: {
    "Dining table": {
      category: "table",
      zone: "dining",
      defaultPosition: { x: 8200, z: 5600 },
      dimensions: { w: 1500, d: 1500, h: 760 },
      materials: { top: "wood", base: "metal" },
      colors: { top: 0xc9a876, base: 0x2b2b2b },
      draggable: true,
      shape: "circular",
      tags: ["round", "walnut", "6-seat"],
    },
    "Dining chair 1": {
      category: "chair",
      zone: "dining",
      defaultPosition: { x: 8200, z: 4600 },
      dimensions: { w: 520, d: 520, h: 850 },
      materials: { seat: "fabric", legs: "metal" },
      colors: { seat: 0xf1ede2, legs: 0x2b2b2b },
      draggable: true,
      tags: ["modern", "stackable"],
    },
    "Dining chair 2": {
      category: "chair",
      zone: "dining",
      defaultPosition: { x: 8200, z: 6600 },
      dimensions: { w: 520, d: 520, h: 850 },
      materials: { seat: "fabric", legs: "metal" },
      colors: { seat: 0xf1ede2, legs: 0x2b2b2b },
      draggable: true,
      tags: ["modern", "stackable"],
    },
    "Dining chair 3": {
      category: "chair",
      zone: "dining",
      defaultPosition: { x: 7200, z: 5600 },
      dimensions: { w: 520, d: 520, h: 850 },
      materials: { seat: "fabric", legs: "metal" },
      colors: { seat: 0xf1ede2, legs: 0x2b2b2b },
      draggable: true,
      tags: ["modern", "stackable"],
    },
    "Dining chair 4": {
      category: "chair",
      zone: "dining",
      defaultPosition: { x: 9200, z: 5600 },
      dimensions: { w: 520, d: 520, h: 850 },
      materials: { seat: "fabric", legs: "metal" },
      colors: { seat: 0xf1ede2, legs: 0x2b2b2b },
      draggable: true,
      tags: ["modern", "stackable"],
    },
  },

  // 柜体与边柜
  cabinet: {
    "Simple TV combo cabinet": {
      category: "sideboard",
      zone: "living",
      defaultPosition: { x: 9100, z: 2850 },
      dimensions: { w: 500, d: 1800, h: 450 },
      materials: { main: "wood", legs: "metal" },
      colors: { main: 0xb98a5e, legs: 0x2b2b2b },
      draggable: true,
      tags: ["tv-stand", "storage", "minimalist"],
    },
    "Dining sideboard": {
      category: "sideboard",
      zone: "dining",
      defaultPosition: { x: 9650, z: 4700 },
      dimensions: { w: 450, d: 1800, h: 850 },
      materials: { main: "wood", legs: "metal" },
      colors: { main: 0xb98a5e, legs: 0x2b2b2b },
      draggable: true,
      tags: ["buffet", "storage"],
    },
    "Study desk": {
      category: "desk",
      zone: "bed3",
      defaultPosition: { x: 5050, z: 7700 },
      dimensions: { w: 1400, d: 650, h: 740 },
      materials: { top: "wood", legs: "metal" },
      colors: { top: 0xb98a5e, legs: 0x2b2b2b },
      draggable: true,
      tags: ["workspace", "compact"],
    },
  },

  // 电器
  appliances: {
    "TV": {
      category: "tv",
      zone: "living",
      defaultPosition: { x: 9650, z: 2700 },
      dimensions: { w: 80, d: 1800, h: 1000 },
      materials: { screen: "glass", frame: "metal" },
      colors: { screen: 0x0c0c0c, frame: 0x1c1c1c },
      draggable: true,
      tags: ["55-inch", "flat-screen"],
    },
    "Fridge": {
      category: "appliance",
      zone: "kitchen",
      defaultPosition: { x: 7400, z: 7600 },
      dimensions: { w: 750, d: 750, h: 1900 },
      materials: { body: "appliance", handle: "metal" },
      colors: { body: 0xe9e7e0, handle: 0x2b2b2b },
      draggable: true,
      tags: ["stainless", "french-door"],
    },
    "Washing machine": {
      category: "appliance",
      zone: "laundry",
      defaultPosition: { x: 6600, z: 8250 },
      dimensions: { w: 650, d: 650, h: 850 },
      materials: { body: "appliance", drum: "metal" },
      colors: { body: 0xe9e7e0, drum: 0x2b2b2b },
      draggable: true,
      tags: ["front-load", "smart"],
    },
  },

  // 空调
  climate: {
    "AC 1": {
      category: "ac-unit",
      zone: "master",
      defaultPosition: { x: 2500, z: 170 },
      dimensions: { w: 1600, d: 300, h: 280 },
      materials: { body: "appliance", vent: "plastic" },
      colors: { body: 0xf3f1eb, vent: 0xcfcac1 },
      draggable: false, // 通常固定安装
      tags: ["wall-mounted", "inverter"],
    },
    "AC 2": {
      category: "ac-unit",
      zone: "bed2",
      defaultPosition: { x: 5400, z: 170 },
      dimensions: { w: 1600, d: 300, h: 280 },
      materials: { body: "appliance", vent: "plastic" },
      colors: { body: 0xf3f1eb, vent: 0xcfcac1 },
      draggable: false,
      tags: ["wall-mounted", "inverter"],
    },
    "AC 3": {
      category: "ac-unit",
      zone: "living",
      defaultPosition: { x: 8850, z: 170 },
      dimensions: { w: 1600, d: 300, h: 280 },
      materials: { body: "appliance", vent: "plastic" },
      colors: { body: 0xf3f1eb, vent: 0xcfcac1 },
      draggable: false,
      tags: ["wall-mounted", "inverter"],
    },
  },

  // 地毯与软饰
  textiles: {
    "Bedroom 3 jute rug": {
      category: "rug",
      zone: "bed3",
      defaultPosition: { x: 5200, z: 5900 },
      dimensions: { w: 1900, d: 2500, h: 20 },
      materials: { main: "jute" },
      colors: { main: 0xc9a877 },
      draggable: true,
      tags: ["natural", "textured", "eco-friendly"],
    },
  },

  // 研究椅
  study: {
    "Study chair": {
      category: "chair",
      zone: "bed3",
      defaultPosition: { x: 5050, z: 8350 },
      dimensions: { w: 600, d: 600, h: 850 },
      materials: { seat: "fabric", legs: "metal" },
      colors: { seat: 0xf1ede2, legs: 0x2b2b2b },
      draggable: true,
      tags: ["task-chair", "ergonomic"],
    },
  },
};

/**
 * 快速查询接口
 */
export const getFurnituresByZone = (zone) => {
  const result = [];
  for (const category in FURNITURE_DB) {
    for (const name in FURNITURE_DB[category]) {
      const furniture = FURNITURE_DB[category][name];
      if (furniture.zone === zone) {
        result.push({ name, ...furniture });
      }
    }
  }
  return result;
};

export const getFurnituresByCategory = (category) => {
  return FURNITURE_DB[category] || {};
};

export const getFurniture = (name) => {
  for (const category in FURNITURE_DB) {
    if (FURNITURE_DB[category][name]) {
      return FURNITURE_DB[category][name];
    }
  }
  return null;
};

/**
 * 色彩方案预设
 */
export const COLOR_SCHEMES = {
  modern_minimal: {
    name: "现代简约",
    primary: 0xffffff,    // 白色为主
    accent: 0xb98a5e,     // 木色点缀
    highlight: 0x93a67c,  // 鼠尾草绿
    description: "白色系 65-85% + 木色 10-30% + 鼠尾草绿 5%",
  },
  warm_wood: {
    name: "温暖木色",
    primary: 0xf5e6d3,
    accent: 0xc9a876,
    highlight: 0x8b6f47,
    description: "偏暖的木色基调",
  },
  cool_grey: {
    name: "冷调灰",
    primary: 0xd9d9d9,
    accent: 0x6b6b6b,
    highlight: 0x93a67c,
    description: "高级灰 + 绿色点缀",
  },
};

/**
 * 照明场景预设
 */
export const LIGHTING_SCENES = {
  morning: {
    name: "早晨阳光",
    sunIntensity: 2.0,
    sunColor: 0xfff8e7,
    sunPosition: { x: 2000, y: 8000, z: 1000 },
    ambientIntensity: 1.2,
    ambientColor: 0xf5f2ea,
  },
  noon: {
    name: "正午阳光",
    sunIntensity: 2.8,
    sunColor: 0xffffff,
    sunPosition: { x: 4200, y: 9500, z: 3200 },
    ambientIntensity: 1.15,
    ambientColor: 0xf8f6f2,
  },
  evening: {
    name: "傍晚温光",
    sunIntensity: 1.8,
    sunColor: 0xffe4b5,
    sunPosition: { x: -3000, y: 5000, z: 6000 },
    ambientIntensity: 0.95,
    ambientColor: 0xf5e8d8,
  },
  night: {
    name: "夜间灯光",
    sunIntensity: 0.3,
    sunColor: 0x6b7280,
    sunPosition: { x: 0, y: 3000, z: 0 },
    ambientIntensity: 0.45,
    ambientColor: 0x3d4457,
    roomLights: true,
  },
};