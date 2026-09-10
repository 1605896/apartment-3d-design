/**
 * 尺寸测量与标注工具
 */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js";

export class MeasurementTool {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.measurements = [];
    this.isActive = false;
    this.selectedPoints = [];
  }

  /**
   * 启用测量工具
   */
  activate() {
    this.isActive = true;
    this.selectedPoints = [];
    console.log("测量工具已启用。点击两个点来测量距离。");
  }

  /**
   * 禁用测量工具
   */
  deactivate() {
    this.isActive = false;
    this.clearMeasurements();
  }

  /**
   * 添加测量点
   */
  addPoint(point) {
    if (!this.isActive) return;

    this.selectedPoints.push(point);

    if (this.selectedPoints.length === 2) {
      this.createMeasurement(this.selectedPoints[0], this.selectedPoints[1]);
      this.selectedPoints = [];
    }
  }

  /**
   * 创建测量线和标签
   */
  createMeasurement(point1, point2) {
    const distance = point1.distanceTo(point2);

    // 创建测量线
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints([point1, point2]);
    const material = new THREE.LineBasicMaterial({
      color: 0xff6b6b,
      linewidth: 2,
    });
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);

    // 创建测量标签
    const midpoint = new THREE.Vector3().addVectors(point1, point2).multiplyScalar(0.5);
    this.createLabel(midpoint, Math.round(distance) + " mm", 0xff6b6b);

    // 记录测量
    this.measurements.push({
      line: line,
      distance: distance,
      points: [point1, point2],
    });
  }

  /**
   * 创建 3D 标签
   */
  createLabel(position, text, color = 0xffffff) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(position);
    sprite.scale.set(400, 100, 1);

    this.scene.add(sprite);
  }

  /**
   * 清除所有测量
   */
  clearMeasurements() {
    for (const measurement of this.measurements) {
      this.scene.remove(measurement.line);
    }
    this.measurements = [];
  }

  /**
   * 获取测量报告
   */
  getReport() {
    return this.measurements.map((m, i) => ({
      id: i,
      distance: Math.round(m.distance),
      points: m.points.map((p) => ({ x: p.x, y: p.y, z: p.z })),
    }));
  }
}

/**
 * 动线分析工具
 */
export class FlowAnalysisTool {
  constructor(scene) {
    this.scene = scene;
    this.pathPoints = [];
    this.paths = [];
  }

  /**
   * 添加路径点
   */
  addPathPoint(point) {
    this.pathPoints.push(point);

    // 可视化点
    const sphereGeometry = new THREE.SphereGeometry(50, 8, 8);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x4caf50 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.copy(point);
    this.scene.add(sphere);

    // 如果有前一个点，连接它们
    if (this.pathPoints.length > 1) {
      const prevPoint = this.pathPoints[this.pathPoints.length - 2];
      this.drawPathSegment(prevPoint, point);
    }
  }

  /**
   * 绘制路径段
   */
  drawPathSegment(point1, point2) {
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints([point1, point2]);
    const material = new THREE.LineBasicMaterial({
      color: 0x4caf50,
      linewidth: 3,
    });
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
    this.paths.push(line);
  }

  /**
   * 清除路径
   */
  clearPath() {
    for (const path of this.paths) {
      this.scene.remove(path);
    }
    this.paths = [];
    this.pathPoints = [];
  }

  /**
   * 获取路径分析结果
   */
  getAnalysis() {
    let totalDistance = 0;
    for (let i = 0; i < this.pathPoints.length - 1; i++) {
      const distance = this.pathPoints[i].distanceTo(this.pathPoints[i + 1]);
      totalDistance += distance;
    }

    return {
      points: this.pathPoints.length,
      segments: this.pathPoints.length - 1,
      totalDistance: Math.round(totalDistance),
      averageSegmentLength: Math.round(
        totalDistance / Math.max(1, this.pathPoints.length - 1)
      ),
    };
  }
}
