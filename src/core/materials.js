/**
 * 材质与纹理系统
 * 程序生成真实感纹理与材质配置
 */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js";

/**
 * 程序生成纹理 - Canvas Procedural Textures
 */
export function makeTexture(draw, size = 256, repeatX = 1, repeatY = 1) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  draw(canvas.getContext("2d"), size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 绘制木纹纹理
 */
export function drawWood(ctx, w, h, baseColor, grainColor) {
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, w, h);

  // 绘制木纹纹理线
  for (let i = 0; i < 46; i++) {
    ctx.strokeStyle = grainColor;
    ctx.globalAlpha = 0.06 + Math.random() * 0.14;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    let y = Math.random() * h;
    ctx.moveTo(0, y);
    for (let x = 0; x <= w; x += 18) {
      y += (Math.random() - 0.5) * 7;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.strokeStyle = "rgba(0,0,0,.10)";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += w / 5) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
}

/**
 * 绘制乳胶漆墙面纹理
 */
export function drawPlaster(ctx, w, h, baseColor) {
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, w, h);

  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 9;
    data[i] += noise;     // R
    data[i + 1] += noise; // G
    data[i + 2] += noise; // B
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * 绘制布料纹理
 */
export function drawFabric(ctx, w, h, baseColor) {
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, w, h);

  // 添加细微的纤维纹理
  for (let i = 0; i < 1800; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.035})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
  }
}

/**
 * 绘制黄麻地毯纹理
 */
export function drawJute(ctx, w, h) {
  ctx.fillStyle = "#c9a876";
  ctx.fillRect(0, 0, w, h);

  // 经向纹理
  ctx.strokeStyle = "rgba(90,65,35,.35)";
  ctx.lineWidth = 2;
  for (let x = 0; x < w; x += 8) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  // 纬向纹理
  ctx.strokeStyle = "rgba(235,215,175,.35)";
  for (let y = 0; y < h; y += 8) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

/**
 * 创建材质库
 */
export function createMaterialLibrary() {
  // 生成纹理
  const woodFloorTex = makeTexture(
    (ctx, w, h) => drawWood(ctx, w, h, "#d5b98d", "#a9814f"),
    512,
    9850 / 1300,
    9450 / 1300
  );
  const woodFurnitureTex = makeTexture(
    (ctx, w, h) => drawWood(ctx, w, h, "#c9a876", "#93693b"),
    256,
    1,
    1
  );
  const wallTex = makeTexture(
    (ctx, w, h) => drawPlaster(ctx, w, h, "#efece4"),
    256,
    9850 / 1400,
    2850 / 850
  );
  const fabricTex = makeTexture(
    (ctx, w, h) => drawFabric(ctx, w, h, "#f4f0e6"),
    256,
    2,
    2
  );
  const juteTex = makeTexture((ctx, w, h) => drawJute(ctx, w, h), 128, 7, 9);

  // 材质定义
  const materials = {
    // 地面与建筑
    floor: new THREE.MeshStandardMaterial({
      map: woodFloorTex,
      roughness: 0.55,
    }),
    wall: new THREE.MeshStandardMaterial({
      map: wallTex,
      roughness: 0.92,
    }),

    // 家具与木制品
    wood: new THREE.MeshStandardMaterial({
      map: woodFurnitureTex,
      roughness: 0.48,
    }),
    fabric: new THREE.MeshStandardMaterial({
      map: fabricTex,
      roughness: 0.85,
    }),
    fabricAccent: new THREE.MeshStandardMaterial({
      color: 0x93a67c, // 鼠尾草绿
      roughness: 0.82,
    }),

    // 金属与特殊材质
    leg: new THREE.MeshStandardMaterial({
      color: 0x2b2b2b,
      roughness: 0.35,
      metalness: 0.55,
    }),
    wardrobe: new THREE.MeshStandardMaterial({
      color: 0xf1efe8,
      roughness: 0.45,
      metalness: 0.05,
    }),
    metalWardrobe: new THREE.MeshStandardMaterial({
      color: 0xf1efe8,
      roughness: 0.3,
      metalness: 0.25,
    }),
    seam: new THREE.MeshStandardMaterial({
      color: 0xd9d5cb,
      roughness: 0.5,
    }),

    // 软饰与地毯
    rug: new THREE.MeshStandardMaterial({
      map: juteTex,
      roughness: 0.95,
    }),

    // 电器与厨卫
    appliance: new THREE.MeshStandardMaterial({
      color: 0xe9e7e0,
      roughness: 0.4,
      metalness: 0.2,
    }),
    black: new THREE.MeshStandardMaterial({
      color: 0x1c1c1c,
      roughness: 0.35,
      metalness: 0.5,
    }),
    glass: new THREE.MeshStandardMaterial({
      color: 0x0c0c0c,
      roughness: 0.15,
      metalness: 0.7,
    }),
    vent: new THREE.MeshStandardMaterial({
      color: 0xcfcac1,
      roughness: 0.6,
    }),

    // 窗帘与纺织品
    curtain: new THREE.MeshStandardMaterial({
      color: 0xf7f4ee,
      roughness: 0.9,
      transparent: true,
      opacity: 0.94,
      side: THREE.DoubleSide,
    }),
  };

  return materials;
}

/**
 * 按颜色方案更新材质
 */
export function updateMaterialsForColorScheme(materials, colorScheme) {
  // 更新主色调
  if (materials.fabric) {
    materials.fabric.color.setHex(colorScheme.primary);
  }
  if (materials.wardrobe) {
    materials.wardrobe.color.setHex(colorScheme.primary);
  }

  // 更新木色点缀
  if (materials.wood) {
    materials.wood.color.setHex(colorScheme.accent);
  }
  if (materials.leg) {
    materials.leg.color.setHex(colorScheme.accent);
  }

  // 更新高亮色
  if (materials.fabricAccent) {
    materials.fabricAccent.color.setHex(colorScheme.highlight);
  }
}

/**
 * 创建高光覆盖层（增强写实感）
 */
export function addHighlight(geometry, highlightColor = 0xffffff, opacity = 0.15) {
  const highlightMaterial = new THREE.MeshStandardMaterial({
    color: highlightColor,
    roughness: 0.8,
    transparent: true,
    opacity: opacity,
  });
  return new THREE.Mesh(geometry, highlightMaterial);
}
