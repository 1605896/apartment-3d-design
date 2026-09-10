/**
 * 拖动控制系统 - 增强的家具移动逻辑
 * 整合碰撞检测、边界检查、动画反馈
 */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js";
import { DragControls } from "https://cdn.jsdelivr.net/npm/three@0.161/examples/jsm/controls/DragControls.js";
import { CollisionDetector, DistanceAnalyzer } from "./collision.js";

export class EnhancedDragController {
  constructor(draggableObjects, camera, renderer, options = {}) {
    this.draggableObjects = draggableObjects;
    this.camera = camera;
    this.renderer = renderer;
    this.options = {
      boundaries: options.boundaries || { minX: 300, maxX: 9550, minZ: 300, maxZ: 9150 },
      enableCollisionDetection: options.enableCollisionDetection !== false,
      enableVisualization: options.enableVisualization !== false,
      ...options,
    };

    this.dragControls = new DragControls(
      draggableObjects.filter(obj => obj.userData?.draggable !== false),
      camera,
      renderer.domElement
    );

    this.collisionDetector = new CollisionDetector();
    this.distanceAnalyzer = new DistanceAnalyzer();
    this.currentlyDragging = null;
    this.dragHistory = [];

    this.setupEventListeners();
  }

  /**
   * 设置拖动事件监听
   */
  setupEventListeners() {
    this.dragControls.addEventListener("dragstart", (event) => {
      this.currentlyDragging = event.object.parent || event.object;
      this.currentlyDragging.userData.dragStart = this.currentlyDragging.position.clone();
      console.log(`开始拖动: ${this.currentlyDragging.name}`);
    });

    this.dragControls.addEventListener("drag", (event) => {
      const obj = event.object.parent || event.object;
      this.constrainPosition(obj);

      if (this.options.enableCollisionDetection) {
        this.updateCollisionVisualization(obj);
      }
    });

    this.dragControls.addEventListener("dragend", (event) => {
      const obj = event.object.parent || event.object;
      this.recordDragHistory(obj);

      if (this.options.enableCollisionDetection) {
        this.performCollisionCheck();
      }

      this.currentlyDragging = null;
      console.log(`结束拖动: ${obj.name}`);
    });
  }

  /**
   * 约束对象位置在边界内
   */
  constrainPosition(object) {
    const bounds = this.options.boundaries;
    const dim = object.dimensions || { w: 500, d: 500 };

    // 保持Y坐标不变
    object.position.y = 0;

    // 约束X坐标
    const minX = bounds.minX + dim.w / 2;
    const maxX = bounds.maxX - dim.w / 2;
    object.position.x = Math.max(minX, Math.min(maxX, object.position.x));

    // 约束Z坐标
    const minZ = bounds.minZ + dim.d / 2;
    const maxZ = bounds.maxZ - dim.d / 2;
    object.position.z = Math.max(minZ, Math.min(maxZ, object.position.z));
  }

  /**
   * 更新碰撞可视化（实时）
   */
  updateCollisionVisualization(draggedObject) {
    const collisions = this.collisionDetector.checkCollisionsForObject(
      draggedObject,
      this.draggableObjects
    );

    if (collisions.length > 0) {
      if (!draggedObject.userData.collisionWarning) {
        draggedObject.userData.collisionWarning = true;
        draggedObject.traverse((child) => {
          if (child.isMesh) {
            child.originalEmissive = child.material.emissive.getHex();
            child.material.emissive.setHex(0xff6b6b); // 红色警告
          }
        });
      }
    } else {
      if (draggedObject.userData.collisionWarning) {
        draggedObject.userData.collisionWarning = false;
        draggedObject.traverse((child) => {
          if (child.isMesh && child.originalEmissive !== undefined) {
            child.material.emissive.setHex(child.originalEmissive);
          }
        });
      }
    }
  }

  /**
   * 执行全面碰撞检查
   */
  performCollisionCheck() {
    const allCollisions = this.collisionDetector.detectAllCollisions(
      this.draggableObjects
    );

    if (allCollisions.length > 0) {
      const report = this.collisionDetector.getCollisionReport();
      console.warn("检测到碰撞:", report);
      this.emitCollisionEvent(report);
    }
  }

  /**
   * 记录拖动历史（用于撤销/重做）
   */
  recordDragHistory(object) {
    const historyEntry = {
      timestamp: Date.now(),
      objectName: object.name,
      previousPosition: object.userData.dragStart.clone(),
      currentPosition: object.position.clone(),
      distance: object.position.distanceTo(object.userData.dragStart),
    };

    this.dragHistory.push(historyEntry);

    // 保持历史记录在可管理的大小
    if (this.dragHistory.length > 50) {
      this.dragHistory.shift();
    }
  }

  /**
   * 撤销最后一次拖动
   */
  undoLastDrag() {
    if (this.dragHistory.length === 0) return false;

    const lastEntry = this.dragHistory.pop();
    const targetObject = this.draggableObjects.find(
      (obj) => obj.name === lastEntry.objectName
    );

    if (targetObject) {
      targetObject.position.copy(lastEntry.previousPosition);
      console.log(`撤销: ${lastEntry.objectName}`);
      return true;
    }
    return false;
  }

  /**
   * 分析动线效率
   */
  analyzeFlowPath(pathPoints) {
    return this.distanceAnalyzer.analyzeWalkingPath(pathPoints);
  }

  /**
   * 检查对象的操作空间
   */
  checkAccessibility(object) {
    return this.distanceAnalyzer.hasAccessSpace(
      object,
      this.draggableObjects,
      300
    );
  }

  /**
   * 获取碰撞报告
   */
  getCollisionReport() {
    return this.collisionDetector.getCollisionReport();
  }

  /**
   * 派发碰撞事件
   */
  emitCollisionEvent(report) {
    const event = new CustomEvent("furnitureCollision", {
      detail: { report: report },
    });
    window.dispatchEvent(event);
  }

  /**
   * 启用/禁用拖动
   */
  setEnabled(enabled) {
    this.dragControls.enabled = enabled;
  }

  /**
   * 清理资源
   */
  dispose() {
    this.dragControls.dispose();
    this.collisionDetector.clearWarningVisuals();
  }
}
