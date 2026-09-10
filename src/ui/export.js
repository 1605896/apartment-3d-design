/**
 * 导出功能模块
 * 支持截图、布局保存、3D模型导出
 */

export class ExportManager {
  constructor(renderer, scene) {
    this.renderer = renderer;
    this.scene = scene;
  }

  /**
   * 截图（高分辨率）
   */
  screenshot(filename = "apartment-design.png", scale = 2) {
    const width = this.renderer.domElement.width * scale;
    const height = this.renderer.domElement.height * scale;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const tempRenderer = new this.renderer.constructor({
      canvas: canvas,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    tempRenderer.setSize(width, height);
    tempRenderer.render(this.scene, this.renderer.camera);

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = filename;
    link.click();
  }

  /**
   * 保存布局配置为JSON
   */
  saveLayout(furniture, filename = "layout.json") {
    const layoutData = {
      timestamp: new Date().toISOString(),
      furniture: furniture.map((obj) => ({
        name: obj.name,
        position: {
          x: Math.round(obj.position.x),
          y: Math.round(obj.position.y),
          z: Math.round(obj.position.z),
        },
        rotation: {
          x: obj.rotation.x,
          y: obj.rotation.y,
          z: obj.rotation.z,
        },
        visible: obj.visible,
      })),
      metadata: {
        version: "1.0",
        roomDimensions: {
          width: 9850,
          depth: 9450,
          height: 2850,
        },
      },
    };

    const blob = new Blob([JSON.stringify(layoutData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * 加载布局配置
   */
  loadLayout(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const layoutData = JSON.parse(event.target.result);
          resolve(layoutData);
        } catch (error) {
          reject(new Error("Invalid JSON format: " + error.message));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  /**
   * 导出为CSV报表
   */
  exportToCSV(furniture, filename = "furniture-report.csv") {
    const headers = [
      "Name",
      "Category",
      "X (mm)",
      "Y (mm)",
      "Z (mm)",
      "Width (mm)",
      "Depth (mm)",
      "Height (mm)",
      "Color",
    ];

    const rows = furniture.map((obj) => [
      obj.name,
      obj.category || "unknown",
      Math.round(obj.position.x),
      Math.round(obj.position.y),
      Math.round(obj.position.z),
      obj.dimensions?.w || 0,
      obj.dimensions?.d || 0,
      obj.dimensions?.h || 0,
      obj.color ? obj.color.toString(16) : "ffffff",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) =>
            typeof cell === "string" && cell.includes(",")
              ? `"${cell}"`
              : cell
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  /**
   * 复制当前视图到剪贴板
   */
  async copyToClipboard() {
    try {
      const canvas = this.renderer.domElement;
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);
      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
    }
  }

  /**
   * 生成设计报告（HTML）
   */
  generateReport(furniture, stats) {
    const reportHTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>装修设计报告</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .report { background: white; padding: 30px; border-radius: 8px; max-width: 900px; margin: 0 auto; }
    h1 { color: #222; border-bottom: 3px solid #222; padding-bottom: 10px; }
    h2 { color: #444; margin-top: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background: #f0f0f0; font-weight: bold; }
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
    .stat-box { background: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid #222; }
    .stat-value { font-size: 24px; font-weight: bold; color: #222; }
    .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="report">
    <h1>🏠 装修设计方案报告</h1>
    <p><strong>生成时间:</strong> ${new Date().toLocaleString("zh-CN")}</p>
    
    <div class="stats">
      <div class="stat-box">
        <div class="stat-value">${furniture.length}</div>
        <div class="stat-label">家具总数</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${stats.collisions || 0}</div>
        <div class="stat-label">碰撞检测</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${stats.usageRate || 0}%</div>
        <div class="stat-label">空间使用率</div>
      </div>
    </div>

    <h2>📋 家具清单</h2>
    <table>
      <thead>
        <tr>
          <th>家具名称</th>
          <th>分类</th>
          <th>位置 X (mm)</th>
          <th>位置 Z (mm)</th>
          <th>尺寸 (W×D×H)</th>
        </tr>
      </thead>
      <tbody>
        ${furniture
          .map(
            (obj) =>
              `<tr>
          <td>${obj.name}</td>
          <td>${obj.category || "-"}</td>
          <td>${Math.round(obj.position.x)}</td>
          <td>${Math.round(obj.position.z)}</td>
          <td>${obj.dimensions?.w || 0}×${obj.dimensions?.d || 0}×${obj.dimensions?.h || 0}</td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table>

    <div class="footer">
      <p>本报告由 3D 装修设计系统自动生成。如有疑问，请联系设计师。</p>
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([reportHTML], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `design-report-${Date.now()}.html`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
