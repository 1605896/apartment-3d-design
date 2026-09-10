/**
 * 通用工具函数库
 */

/**
 * 计算两点间距离（3D）
 */
export function distance3D(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * 计算两点间距离（2D，忽略Y轴）
 */
export function distance2D(p1, p2) {
  const dx = p2.x - p1.x;
  const dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dz * dz);
}

/**
 * 检测两个轴对齐包围盒（AABB）是否碰撞
 * @param {Object} box1 - { x, z, w, d }
 * @param {Object} box2 - { x, z, w, d }
 * @param {number} padding - 碰撞检测的缓冲区（mm）
 */
export function checkAABBCollision(box1, box2, padding = 100) {
  const b1 = {
    left: box1.x - box1.w / 2 - padding,
    right: box1.x + box1.w / 2 + padding,
    front: box1.z - box1.d / 2 - padding,
    back: box1.z + box1.d / 2 + padding,
  };

  const b2 = {
    left: box2.x - box2.w / 2,
    right: box2.x + box2.w / 2,
    front: box2.z - box2.d / 2,
    back: box2.z + box2.d / 2,
  };

  return !(b1.right < b2.left || b1.left > b2.right || b1.back < b2.front || b1.front > b2.back);
}

/**
 * 获取AABB碰撞的重叠区域（用于可视化警告）
 */
export function getCollisionOverlap(box1, box2) {
  const b1 = {
    left: box1.x - box1.w / 2,
    right: box1.x + box1.w / 2,
    front: box1.z - box1.d / 2,
    back: box1.z + box1.d / 2,
  };

  const b2 = {
    left: box2.x - box2.w / 2,
    right: box2.x + box2.w / 2,
    front: box2.z - box2.d / 2,
    back: box2.z + box2.d / 2,
  };

  const overlapX =
    Math.max(0, Math.min(b1.right, b2.right) - Math.max(b1.left, b2.left));
  const overlapZ =
    Math.max(0, Math.min(b1.back, b2.back) - Math.max(b1.front, b2.front));

  return { x: overlapX, z: overlapZ, area: overlapX * overlapZ };
}

/**
 * 约束值到范围内
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * 生成唯一ID
 */
export function generateID(prefix = "obj") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 深度克隆对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item));
  }
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * 防抖函数
 */
export function debounce(func, delay) {
  let timeoutID;
  return function (...args) {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * 格式化尺寸为可读字符串
 */
export function formatDimension(mm) {
  if (mm >= 1000) {
    return (mm / 1000).toFixed(2) + " m";
  }
  return Math.round(mm) + " mm";
}

/**
 * JSON 序列化布局方案
 */
export function serializeLayout(furniture) {
  return JSON.stringify(
    furniture.map((f) => ({
      name: f.name,
      position: { x: f.position.x, z: f.position.z },
      rotation: f.rotation.y,
    })),
    null,
    2
  );
}

/**
 * 从JSON加载布局方案
 */
export function deserializeLayout(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Invalid layout JSON:", error);
    return null;
  }
}

/**
 * 性能监控 - 帧率计算
 */
export function createFPSMonitor() {
  let lastTime = Date.now();
  let frames = 0;
  let fps = 0;

  return {
    update() {
      frames++;
      const now = Date.now();
      if (now - lastTime >= 1000) {
        fps = frames;
        frames = 0;
        lastTime = now;
      }
      return fps;
    },
    getFPS() {
      return fps;
    },
  };
}
