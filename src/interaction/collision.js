/**
 * 碰撞检测系统
 * 检测家具间碰撞并提供视觉警告
 */

import { checkAABBCollision, getCollisionOverlap } from "../utils/helpers.js";

export class CollisionDetector {
  constructor() {
    this.collisions = [];
    this.warningVisuals = new Map();
    this.collisionThreshold = 100; // mm
  }

  /**
   * 检测单个对象与所有其他对象的碰撞
   */
  checkCollisionsForObject(object, allObjects) {
    const objectBounds = this.getObjectBounds(object);
    const collidingWith = [];

    for (const other of allObjects) {
      if (other === object || !other.dimensions) continue;

      const otherBounds = this.getObjectBounds(other);
      if (checkAABBCollision(objectBounds, otherBounds, this.collisionThreshold)) {
        const overlap = getCollisionOverlap(objectBounds, otherBounds);
        collidingWith.push({
          object: other,
          overlap: overlap.area,
          overlapX: overlap.x,
          overlapZ: overlap.z,
        });
      }
    }

    return collidingWith;
  }

  /**
   * 批量检测所有对象的碰撞
   */
  detectAllCollisions(objects) {
    this.collisions = [];

    for (let i = 0; i < objects.length; i++) {
      const collisionsForThis = this.checkCollisionsForObject(
        objects[i],
        objects
      );
      if (collisionsForThis.length > 0) {
        this.collisions.push({
          object: objects[i],
          collidingWith: collisionsForThis,
        });
      }
    }

    return this.collisions;
  }

  /**
   * 获取对象的AABB边界
   */
  getObjectBounds(object) {
    const dim = object.dimensions || { w: 500, d: 500 };
    return {
      x: object.position.x,
      z: object.position.z,
      w: dim.w,
      d: dim.d,
    };
  }

  /**
   * 是否存在碰撞
   */
  hasCollisions() {
    return this.collisions.length > 0;
  }

  /**
   * 获取碰撞数量
   */
  getCollisionCount() {
    let count = 0;
    for (const collision of this.collisions) {
      count += collision.collidingWith.length;
    }
    return count;
  }

  /**
   * 获取碰撞报告（用于UI显示）
   */
  getCollisionReport() {
    const report = [];
    for (const collision of this.collisions) {
      for (const other of collision.collidingWith) {
        report.push({
          obj1Name: collision.object.name,
          obj2Name: other.object.name,
          overlapArea: Math.round(other.overlap),
          severity: this.calculateSeverity(other.overlap),
        });
      }
    }
    return report;
  }

  /**
   * 计算碰撞严重程度
   */
  calculateSeverity(overlapArea) {
    if (overlapArea > 500000) return "critical";
    if (overlapArea > 200000) return "high";
    if (overlapArea > 50000) return "medium";
    return "low";
  }

  /**
   * 清除所有警告视觉效果
   */
  clearWarningVisuals() {
    for (const visual of this.warningVisuals.values()) {
      visual.parent?.remove(visual);
    }
    this.warningVisuals.clear();
  }
}

/**
 * 距离分析器 - 检测家具间距
 */
export class DistanceAnalyzer {
  constructor() {
    this.minWalkingWidth = 800; // 最小通行宽度 800mm
    this.minAccessDistance = 300; // 最小操作距离 300mm
  }

  /**
   * 检查两个对象间的距离
   */
  getDistanceBetween(obj1, obj2) {
    const dx = obj2.position.x - obj1.position.x;
    const dz = obj2.position.z - obj1.position.z;
    return Math.sqrt(dx * dx + dz * dz);
  }

  /**
   * 分析通行距离
   */
  analyzeWalkingPath(pathPoints) {
    let totalDistance = 0;
    const segments = [];

    for (let i = 0; i < pathPoints.length - 1; i++) {
      const p1 = pathPoints[i];
      const p2 = pathPoints[i + 1];
      const distance = this.getDistanceBetween(p1, p2);
      segments.push({
        from: p1.name,
        to: p2.name,
        distance: distance,
      });
      totalDistance += distance;
    }

    return {
      totalDistance: totalDistance,
      segments: segments,
      efficiency: this.calculateEfficiency(totalDistance),
    };
  }

  /**
   * 计算动线效率
   */
  calculateEfficiency(distance) {
    // 假设理想距离为 15000mm
    const idealDistance = 15000;
    const efficiency = Math.min(100, (idealDistance / distance) * 100);
    return Math.round(efficiency);
  }

  /**
   * 检查对象周围是否有足够的操作空间
   */
  hasAccessSpace(object, allObjects, minDistance = 300) {
    const objectBounds = {
      x: object.position.x,
      z: object.position.z,
      w: object.dimensions?.w || 500,
      d: object.dimensions?.d || 500,
    };

    // 检查四周的空间
    const directions = [
      { x: 1, z: 0, name: "right" },
      { x: -1, z: 0, name: "left" },
      { x: 0, z: 1, name: "back" },
      { x: 0, z: -1, name: "front" },
    ];

    const results = {};
    for (const dir of directions) {
      const testX = objectBounds.x + dir.x * (objectBounds.w / 2 + minDistance);
      const testZ = objectBounds.z + dir.z * (objectBounds.d / 2 + minDistance);

      let hasSpace = true;
      for (const other of allObjects) {
        if (other === object) continue;
        const otherBounds = {
          x: other.position.x,
          z: other.position.z,
          w: other.dimensions?.w || 500,
          d: other.dimensions?.d || 500,
        };

        if (this.pointInBounds(testX, testZ, otherBounds)) {
          hasSpace = false;
          break;
        }
      }
      results[dir.name] = hasSpace;
    }

    return results;
  }

  /**
   * 检查点是否在边界内
   */
  pointInBounds(x, z, bounds) {
    return (
      x >= bounds.x - bounds.w / 2 &&
      x <= bounds.x + bounds.w / 2 &&
      z >= bounds.z - bounds.d / 2 &&
      z <= bounds.z + bounds.d / 2
    );
  }
}
