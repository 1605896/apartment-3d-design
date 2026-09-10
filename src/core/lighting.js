/**
 * 多场景照明系统
 * 支持早晨、中午、傍晚、夜间等不同光照场景
 */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js";

export class LightingController {
  constructor(scene) {
    this.scene = scene;
    this.lights = {};
    this.currentScene = "noon";
    this.initializeLights();
  }

  /**
   * 初始化所有光源
   */
  initializeLights() {
    // 环境光
    this.lights.ambient = new THREE.HemisphereLight(0xffffff, 0x777777, 2.0);
    this.scene.add(this.lights.ambient);

    // 主太阳光（方向光）
    this.lights.sun = new THREE.DirectionalLight(0xffffff, 2.2);
    this.lights.sun.position.set(4000, 10000, 3000);
    this.lights.sun.castShadow = true;
    this.lights.sun.shadow.mapSize.set(2048, 2048);
    this.lights.sun.shadow.camera.left = -7000;
    this.lights.sun.shadow.camera.right = 7000;
    this.lights.sun.shadow.camera.top = 7000;
    this.lights.sun.shadow.camera.bottom = -7000;
    this.lights.sun.shadow.camera.near = 100;
    this.lights.sun.shadow.camera.far = 24000;
    this.lights.sun.shadow.bias = -0.0012;
    this.scene.add(this.lights.sun);

    // 填充光（柔和辅助光）
    this.lights.fill = new THREE.DirectionalLight(0xdfe8f5, 0.45);
    this.lights.fill.position.set(-5000, 6500, -2500);
    this.scene.add(this.lights.fill);

    // 夜间室内灯（默认关闭）
    this.lights.roomLights = new THREE.Group();
    this.initializeRoomLights();
    this.scene.add(this.lights.roomLights);
  }

  /**
   * 初始化室内灯具
   */
  initializeRoomLights() {
    const roomLights = this.lights.roomLights;
    roomLights.visible = false;

    // 客厅顶灯
    const livingLight = new THREE.PointLight(0xfff8e7, 1.5, 3000);
    livingLight.position.set(8200, 2500, 5000);
    livingLight.castShadow = true;
    roomLights.add(livingLight);

    // 主卧顶灯
    const masterLight = new THREE.PointLight(0xfff8e7, 1.2, 2500);
    masterLight.position.set(1500, 2500, 2350);
    masterLight.castShadow = true;
    roomLights.add(masterLight);

    // 卧室2顶灯
    const bed2Light = new THREE.PointLight(0xfff8e7, 1.0, 2000);
    bed2Light.position.set(4800, 2500, 2600);
    bed2Light.castShadow = true;
    roomLights.add(bed2Light);

    // 卧室3顶灯
    const bed3Light = new THREE.PointLight(0xfff8e7, 0.9, 2000);
    bed3Light.position.set(5200, 2500, 5900);
    bed3Light.castShadow = true;
    roomLights.add(bed3Light);

    // 厨房区域灯
    const kitchenLight = new THREE.PointLight(0xfff8e7, 1.3, 2500);
    kitchenLight.position.set(8200, 2500, 7300);
    kitchenLight.castShadow = true;
    roomLights.add(kitchenLight);
  }

  /**
   * 设置照明场景
   * @param {string} sceneName - 场景名称: morning, noon, evening, night
   */
  setLightingScene(sceneName) {
    const scenes = {
      morning: {
        sunIntensity: 2.0,
        sunColor: 0xfff8e7,
        sunPosition: { x: 2000, y: 8000, z: 1000 },
        ambientIntensity: 1.2,
        ambientColor: 0xf5f2ea,
        fillIntensity: 0.4,
        roomLights: false,
      },
      noon: {
        sunIntensity: 2.8,
        sunColor: 0xffffff,
        sunPosition: { x: 4200, y: 9500, z: 3200 },
        ambientIntensity: 1.15,
        ambientColor: 0xf8f6f2,
        fillIntensity: 0.45,
        roomLights: false,
      },
      evening: {
        sunIntensity: 1.8,
        sunColor: 0xffe4b5,
        sunPosition: { x: -3000, y: 5000, z: 6000 },
        ambientIntensity: 0.95,
        ambientColor: 0xf5e8d8,
        fillIntensity: 0.6,
        roomLights: false,
      },
      night: {
        sunIntensity: 0.3,
        sunColor: 0x6b7280,
        sunPosition: { x: 0, y: 3000, z: 0 },
        ambientIntensity: 0.45,
        ambientColor: 0x3d4457,
        fillIntensity: 0.2,
        roomLights: true,
      },
    };

    const config = scenes[sceneName] || scenes.noon;
    this.currentScene = sceneName;

    // 更新太阳光
    this.lights.sun.intensity = config.sunIntensity;
    this.lights.sun.color.setHex(config.sunColor);
    this.lights.sun.position.set(
      config.sunPosition.x,
      config.sunPosition.y,
      config.sunPosition.z
    );

    // 更新环境光
    this.lights.ambient.intensity = config.ambientIntensity;
    this.lights.ambient.color.setHex(config.ambientColor);

    // 更新填充光
    this.lights.fill.intensity = config.fillIntensity;

    // 控制室内灯
    this.lights.roomLights.visible = config.roomLights;
  }

  /**
   * 平滑过渡到新的照明场景
   */
  transitionToScene(sceneName, duration = 2000) {
    const startTime = Date.now();
    const startConfig = this.getCurrentLightConfig();
    const targetConfig = this.getLightConfig(sceneName);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      this.interpolateLighting(startConfig, targetConfig, progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.setLightingScene(sceneName);
      }
    };

    animate();
  }

  /**
   * 获取当前光照配置
   */
  getCurrentLightConfig() {
    return {
      sunIntensity: this.lights.sun.intensity,
      sunColor: this.lights.sun.color.getHex(),
      sunPosition: this.lights.sun.position.clone(),
      ambientIntensity: this.lights.ambient.intensity,
      ambientColor: this.lights.ambient.color.getHex(),
    };
  }

  /**
   * 获取预设照明配置
   */
  getLightConfig(sceneName) {
    const configs = {
      morning: {
        sunIntensity: 2.0,
        sunColor: 0xfff8e7,
        sunPosition: { x: 2000, y: 8000, z: 1000 },
        ambientIntensity: 1.2,
        ambientColor: 0xf5f2ea,
      },
      noon: {
        sunIntensity: 2.8,
        sunColor: 0xffffff,
        sunPosition: { x: 4200, y: 9500, z: 3200 },
        ambientIntensity: 1.15,
        ambientColor: 0xf8f6f2,
      },
      evening: {
        sunIntensity: 1.8,
        sunColor: 0xffe4b5,
        sunPosition: { x: -3000, y: 5000, z: 6000 },
        ambientIntensity: 0.95,
        ambientColor: 0xf5e8d8,
      },
      night: {
        sunIntensity: 0.3,
        sunColor: 0x6b7280,
        sunPosition: { x: 0, y: 3000, z: 0 },
        ambientIntensity: 0.45,
        ambientColor: 0x3d4457,
      },
    };

    return configs[sceneName] || configs.noon;
  }

  /**
   * 插值光照参数
   */
  interpolateLighting(startConfig, targetConfig, t) {
    const lerp = (a, b, t) => a + (b - a) * t;
    const lerpColor = (colA, colB, t) => {
      const cA = new THREE.Color(colA);
      const cB = new THREE.Color(colB);
      return new THREE.Color().lerpColors(cA, cB, t);
    };

    this.lights.sun.intensity = lerp(
      startConfig.sunIntensity,
      targetConfig.sunIntensity,
      t
    );
    this.lights.sun.color.copy(
      lerpColor(startConfig.sunColor, targetConfig.sunColor, t)
    );
    this.lights.sun.position.lerpVectors(
      new THREE.Vector3(
        startConfig.sunPosition.x,
        startConfig.sunPosition.y,
        startConfig.sunPosition.z
      ),
      new THREE.Vector3(
        targetConfig.sunPosition.x,
        targetConfig.sunPosition.y,
        targetConfig.sunPosition.z
      ),
      t
    );

    this.lights.ambient.intensity = lerp(
      startConfig.ambientIntensity,
      targetConfig.ambientIntensity,
      t
    );
    this.lights.ambient.color.copy(
      lerpColor(startConfig.ambientColor, targetConfig.ambientColor, t)
    );
  }
}
