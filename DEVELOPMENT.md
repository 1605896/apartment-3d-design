# 📋 开发指南

## 🏗️ 项目架构

```
apartment-3d-design/
├── index.html              # 主应用入口
├── src/
│   ├── core/              # 核心系统
│   │   ├── materials.js   # 材质与纹理
│   │   ├── lighting.js    # 照明系统
│   │   ├── scene.js       # 场景初始化
│   │   └── renderer.js    # 渲染配置
│   ├── geometry/          # 几何体生成
│   │   ├── primitives.js  # 基础形状
│   │   ├── furniture.js   # 复合家具
│   │   ├── architecture.js# 建筑元素
│   │   └── kitchen.js     # 厨房细节
│   ├── interaction/       # 交互逻辑
│   │   ├── drag.js        # 拖动系统
│   │   ├── collision.js   # 碰撞检测
│   │   └── history.js     # 撤销/重做
│   ├── ui/                # 用户界面
│   │   ├── panel.js       # 控制面板
│   │   ├── export.js      # 导出功能
│   │   └── tools.js       # 测量工具
│   └── utils/             # 工具函数
│       ├── furniture-db.js# 家具库
│       └── helpers.js     # 辅助函数
└── README.md
```

## 🚀 快速开始

### 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/1605896/apartment-3d-design.git
cd apartment-3d-design

# 2. 启动开发服务器
npm run dev
# 或者
python -m http.server 8000

# 3. 在浏览器打开
open http://localhost:8000
```

### 生产部署

```bash
# 启用 GitHub Pages
# 在仓库 Settings -> Pages 选择 main 分支
# 访问 https://1605896.github.io/apartment-3d-design/
```

## 📚 核心模块说明

### 1. 材质系统 (`src/core/materials.js`)

**职责**: 程序生成和管理所有材质

```javascript
import { createMaterialLibrary } from "./src/core/materials.js";

const materials = createMaterialLibrary();
// materials.wood, materials.fabric, materials.wall 等
```

**支持的材质**:
- 地板木纹 (`materials.floor`)
- 墙面乳胶漆 (`materials.wall`)
- 家具木色 (`materials.wood`)
- 布料纹理 (`materials.fabric`)
- 金属质感 (`materials.leg`, `materials.metalWardrobe`)

### 2. 照明系统 (`src/core/lighting.js`)

**职责**: 管理多场景照明和动画过渡

```javascript
import { LightingController } from "./src/core/lighting.js";

const lighting = new LightingController(scene);
lighting.setLightingScene("noon"); // 正午阳光
lighting.transitionToScene("evening", 2000); // 平滑过渡到傍晚
```

**支持的场景**:
- `morning` - 早晨阳光（温暖色温）
- `noon` - 正午阳光（冷白色）
- `evening` - 傍晚温光（温暖色温）
- `night` - 夜间灯光（需启用室内灯）

### 3. 交互系统 (`src/interaction/`)

#### 拖动控制 (`drag.js`)

```javascript
import { EnhancedDragController } from "./src/interaction/drag.js";

const dragController = new EnhancedDragController(
  draggableFurniture,
  camera,
  renderer,
  {
    enableCollisionDetection: true,
    boundaries: { minX: 300, maxX: 9550, minZ: 300, maxZ: 9150 },
  }
);
```

**功能**:
- ✅ 拖动家具并实时边界检查
- ✅ 碰撞检测与可视化警告
- ✅ 可达性分析（检查四周操作空间）

#### 碰撞检测 (`collision.js`)

```javascript
import { CollisionDetector } from "./src/interaction/collision.js";

const detector = new CollisionDetector();
const collisions = detector.detectAllCollisions(allObjects);
const report = detector.getCollisionReport();
// [
//   { obj1Name: "Sofa", obj2Name: "TV Stand", severity: "high" }
// ]
```

#### 历史管理 (`history.js`)

```javascript
import { HistoryManager } from "./src/interaction/history.js";

const history = new HistoryManager(50); // 最多保存50个状态
history.saveState(furniture);
history.undo(furniture);
history.redo(furniture);
```

### 4. UI 系统 (`src/ui/`)

#### 控制面板 (`panel.js`)

```javascript
import { UIPanel } from "./src/ui/panel.js";

const ui = new UIPanel();
ui.initialize();
ui.on("onViewChange", (viewName) => { /* ... */ });
ui.updateStats({ totalFurniture: 20, collisions: 0, fps: 60 });
```

#### 导出工具 (`export.js`)

```javascript
import { ExportManager } from "./src/ui/export.js";

const exporter = new ExportManager(renderer, scene);

// 截图
exporter.screenshot("design.png", 2); // 2倍分辨率

// 保存布局
exporter.saveLayout(furniture, "layout.json");

// 加载布局
const data = await exporter.loadLayout(file);

// 导出报告
exporter.generateReport(furniture, stats);
```

#### 测量工具 (`tools.js`)

```javascript
import { MeasurementTool, FlowAnalysisTool } from "./src/ui/tools.js";

const measure = new MeasurementTool(scene, camera);
measure.activate();
measure.addPoint(p1);
measure.addPoint(p2); // 自动测距

const flow = new FlowAnalysisTool(scene);
flow.addPathPoint(p1);
flow.addPathPoint(p2);
const analysis = flow.getAnalysis();
```

### 5. 数据库系统 (`src/utils/furniture-db.js`)

**家具库结构**:

```javascript
FURNITURE_DB = {
  bed: {
    "Master bed + frame": {
      category: "bed",
      zone: "master",
      defaultPosition: { x: 1500, z: 2350 },
      dimensions: { w: 1800, d: 2100, h: 450 },
      materials: { main: "fabric", accent: "wood" },
      colors: { main: 0xf3efe4, accent: 0xb98a5e },
      draggable: true,
      tags: ["queen", "modern"],
    },
    // ...
  },
  // 其他家具分类...
}
```

**查询接口**:

```javascript
import { getFurnituresByZone, getFurniture } from "./src/utils/furniture-db.js";

const bedroomFurniture = getFurnituresByZone("master");
const bed = getFurniture("Master bed + frame");
```

## 🎨 添加新家具

### 步骤 1: 更新家具库

在 `src/utils/furniture-db.js` 中添加:

```javascript
export const FURNITURE_DB = {
  // ..existing categories...
  myCategory: {
    "My Furniture": {
      category: "subcategory",
      zone: "living", // master, bed2, bed3, living, kitchen, laundry
      defaultPosition: { x: 5000, z: 5000 },
      dimensions: { w: 800, d: 600, h: 400 },
      materials: { main: "wood", accent: "metal" },
      colors: { main: 0xc9a876, accent: 0x2b2b2b },
      draggable: true,
      tags: ["custom", "modern"],
    },
  },
};
```

### 步骤 2: 在主应用中实例化

在 `index.html` 的 script 标签中添加:

```javascript
const myFurniture = createFurniture(
  "My Furniture",
  5000, // x
  5000, // z
  800,  // width
  600,  // depth
  400,  // height
  "wood", // material key
  0 // y offset
);
furnitureInstances.push(myFurniture);
draggableFurniture.push(myFurniture);
```

## 🌟 添加新的照明场景

在 `src/core/lighting.js` 的 `setLightingScene()` 方法中添加:

```javascript
const scenes = {
  // ...existing scenes...
  custom: {
    sunIntensity: 2.5,
    sunColor: 0xffffaa,
    sunPosition: { x: 5000, y: 7000, z: 4000 },
    ambientIntensity: 1.0,
    ambientColor: 0xf0f0f0,
    fillIntensity: 0.5,
    roomLights: false,
  },
};
```

## 🐛 调试技巧

### 访问全局对象

```javascript
// 在浏览器控制台:
app.scene
app.camera
app.renderer
app.dragController
app.historyManager
app.lightingController
```

### 检查碰撞

```javascript
const report = app.dragController.getCollisionReport();
console.log(report);
```

### 性能分析

```javascript
// 启用 Three.js 统计信息
import Stats from 'three/examples/jsm/libs/stats.module.js';
```

## 📊 性能优化建议

1. **几何体合并**: 使用 `BufferGeometryUtils.mergeGeometries()` 合并小物体
2. **纹理缓存**: 复用相同的纹理对象
3. **LOD 系统**: 远距离物体使用低精度模型
4. **灯光烘焙**: 预计算静态照明
5. **画布大小**: 考虑在移动设备上降低分辨率

## 🤝 贡献指南

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

MIT License © 2025

---

**有问题？**
- 提交 Issue: https://github.com/1605896/apartment-3d-design/issues
- 讨论: https://github.com/1605896/apartment-3d-design/discussions
