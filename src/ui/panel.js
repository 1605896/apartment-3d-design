/**
 * UI 控制面板系统
 * 家具列表、场景切换、工具按钮
 */

export class UIPanel {
  constructor(options = {}) {
    this.containerSelector = options.containerSelector || "#ui";
    this.container = document.querySelector(this.containerSelector);
    this.callbacks = {};
    this.state = {
      selectedObject: null,
      currentLightingScene: "noon",
      collisionsVisible: true,
    };
  }

  /**
   * 初始化面板
   */
  initialize() {
    this.createControlPanel();
    this.createFurnitureList();
    this.attachEventListeners();
  }

  /**
   * 创建控制面板
   */
  createControlPanel() {
    const panel = document.createElement("div");
    panel.id = "control-panel";
    panel.innerHTML = `
      <h2>🎮 控制选项</h2>
      
      <div class="section">
        <h3>视角</h3>
        <div class="button-group">
          <button id="view-3d" class="view-btn active">3D 视角</button>
          <button id="view-top" class="view-btn">俯视图</button>
          <button id="view-living" class="view-btn">客餐厅</button>
          <button id="view-master" class="view-btn">主卧室</button>
        </div>
      </div>

      <div class="section">
        <h3>照明场景</h3>
        <select id="lighting-select">
          <option value="morning">早晨阳光</option>
          <option value="noon" selected>正午阳光</option>
          <option value="evening">傍晚温光</option>
          <option value="night">夜间灯光</option>
        </select>
      </div>

      <div class="section">
        <h3>工具</h3>
        <button id="measure-tool" class="tool-btn">📏 尺寸测量</button>
        <button id="flow-analysis" class="tool-btn">🚶 动线分析</button>
        <button id="collision-toggle" class="tool-btn">⚠️ 碰撞检测</button>
        <button id="save-layout" class="tool-btn">💾 保存布局</button>
        <button id="load-layout" class="tool-btn">📂 加载布局</button>
        <button id="export-3d" class="tool-btn">📦 导出3D</button>
        <button id="screenshot" class="tool-btn">📸 截图</button>
      </div>

      <div class="section">
        <h3>操作</h3>
        <button id="undo-btn" class="op-btn">↶ 撤销</button>
        <button id="redo-btn" class="op-btn">↷ 重做</button>
        <button id="reset-btn" class="op-btn danger">🔄 重置</button>
      </div>

      <div id="stats" class="stats-panel">
        <p>📊 统计信息</p>
        <div id="stats-content"></div>
      </div>
    `;

    this.container.appendChild(panel);
    this.stylePanel();
  }

  /**
   * 为面板添加样式
   */
  stylePanel() {
    const style = document.createElement("style");
    style.textContent = `
      #control-panel {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #ddd;
      }
      .section {
        margin-bottom: 16px;
      }
      .section h3 {
        font-size: 12px;
        font-weight: 600;
        margin: 8px 0;
        text-transform: uppercase;
        color: #666;
      }
      .button-group {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .view-btn, .tool-btn, .op-btn {
        flex: 1;
        min-width: 70px;
        padding: 6px 8px;
        font-size: 11px;
        border: 1px solid #ccc;
        border-radius: 6px;
        cursor: pointer;
        background: #f5f5f5;
        transition: all 0.2s;
      }
      .view-btn:hover, .tool-btn:hover, .op-btn:hover {
        background: #e0e0e0;
      }
      .view-btn.active {
        background: #222;
        color: white;
        border-color: #222;
      }
      .op-btn.danger {
        background: #ffebee;
        color: #c62828;
        border-color: #ffcdd2;
      }
      select {
        width: 100%;
        padding: 6px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 12px;
      }
      .stats-panel {
        background: #f9f9f9;
        border: 1px solid #eee;
        border-radius: 6px;
        padding: 8px;
        margin-top: 8px;
        font-size: 11px;
      }
      .stats-panel p {
        margin: 0 0 6px 0;
        font-weight: 600;
      }
      #stats-content {
        line-height: 1.6;
        color: #666;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 创建家具列表
   */
  createFurnitureList() {
    const listContainer = document.createElement("div");
    listContainer.id = "furniture-list";
    listContainer.innerHTML = `
      <h2>🛋️ 家具与设备</h2>
      <div id="objects" class="furniture-items"></div>
    `;

    this.container.appendChild(listContainer);
  }

  /**
   * 更新家具列表
   */
  updateFurnitureList(furniture) {
    const objectsDiv = document.getElementById("objects");
    if (!objectsDiv) return;

    objectsDiv.innerHTML = "";
    furniture.forEach((obj, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "furniture-item";
      itemDiv.innerHTML = `
        <div class="item-info">
          <span class="item-name">${obj.name}</span>
          <div class="item-coords">
            <input type="number" id="x${index}" value="${Math.round(obj.position.x)}" placeholder="X" class="coord-input">
            <input type="number" id="z${index}" value="${Math.round(obj.position.z)}" placeholder="Z" class="coord-input">
            <button class="move-btn" data-index="${index}">移动</button>
          </div>
        </div>
      `;
      objectsDiv.appendChild(itemDiv);
    });

    this.attachFurnitureListeners();
  }

  /**
   * 附加家具列表事件监听
   */
  attachFurnitureListeners() {
    document.querySelectorAll(".move-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.dataset.index);
        const x = parseFloat(document.getElementById(`x${index}`).value);
        const z = parseFloat(document.getElementById(`z${index}`).value);

        if (this.callbacks.onMoveFurniture) {
          this.callbacks.onMoveFurniture(index, x, z);
        }
      });
    });
  }

  /**
   * 附加事件监听
   */
  attachEventListeners() {
    // 视角按钮
    document.getElementById("view-3d")?.addEventListener("click", () => {
      this.setViewActive("3d");
      if (this.callbacks.onViewChange) this.callbacks.onViewChange("perspective");
    });
    document.getElementById("view-top")?.addEventListener("click", () => {
      this.setViewActive("top");
      if (this.callbacks.onViewChange) this.callbacks.onViewChange("top");
    });
    document.getElementById("view-living")?.addEventListener("click", () => {
      this.setViewActive("living");
      if (this.callbacks.onViewChange) this.callbacks.onViewChange("living");
    });
    document.getElementById("view-master")?.addEventListener("click", () => {
      this.setViewActive("master");
      if (this.callbacks.onViewChange) this.callbacks.onViewChange("master");
    });

    // 照明场景
    document.getElementById("lighting-select")?.addEventListener("change", (e) => {
      this.state.currentLightingScene = e.target.value;
      if (this.callbacks.onLightingChange) {
        this.callbacks.onLightingChange(e.target.value);
      }
    });

    // 工具按钮
    document.getElementById("measure-tool")?.addEventListener("click", () => {
      if (this.callbacks.onMeasure) this.callbacks.onMeasure();
    });
    document.getElementById("flow-analysis")?.addEventListener("click", () => {
      if (this.callbacks.onFlowAnalysis) this.callbacks.onFlowAnalysis();
    });
    document.getElementById("collision-toggle")?.addEventListener("click", () => {
      this.state.collisionsVisible = !this.state.collisionsVisible;
      if (this.callbacks.onCollisionToggle) {
        this.callbacks.onCollisionToggle(this.state.collisionsVisible);
      }
    });
    document.getElementById("save-layout")?.addEventListener("click", () => {
      if (this.callbacks.onSaveLayout) this.callbacks.onSaveLayout();
    });
    document.getElementById("load-layout")?.addEventListener("click", () => {
      if (this.callbacks.onLoadLayout) this.callbacks.onLoadLayout();
    });
    document.getElementById("export-3d")?.addEventListener("click", () => {
      if (this.callbacks.onExport3D) this.callbacks.onExport3D();
    });
    document.getElementById("screenshot")?.addEventListener("click", () => {
      if (this.callbacks.onScreenshot) this.callbacks.onScreenshot();
    });

    // 操作按钮
    document.getElementById("undo-btn")?.addEventListener("click", () => {
      if (this.callbacks.onUndo) this.callbacks.onUndo();
    });
    document.getElementById("redo-btn")?.addEventListener("click", () => {
      if (this.callbacks.onRedo) this.callbacks.onRedo();
    });
    document.getElementById("reset-btn")?.addEventListener("click", () => {
      if (confirm("确认重置所有家具位置?")) {
        if (this.callbacks.onReset) this.callbacks.onReset();
      }
    });
  }

  /**
   * 设置活跃视角按钮
   */
  setViewActive(viewName) {
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.getElementById(`view-${viewName}`)?.classList.add("active");
  }

  /**
   * 更新统计信息
   */
  updateStats(stats) {
    const statsContent = document.getElementById("stats-content");
    if (statsContent) {
      statsContent.innerHTML = `
        <div>🪑 家具总数: ${stats.totalFurniture || 0}</div>
        <div>⚠️ 碰撞数: ${stats.collisions || 0}</div>
        <div>📐 使用率: ${stats.usageRate || 0}%</div>
        <div>🚶 最小通道: ${stats.minWalkWidth || 0}mm</div>
        <div>⚡ FPS: ${stats.fps || 0}</div>
      `;
    }
  }

  /**
   * 显示通知
   */
  showNotification(message, type = "info", duration = 3000) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === "error" ? "#f44336" : type === "success" ? "#4caf50" : "#2196f3"};
      color: white;
      border-radius: 4px;
      z-index: 1000;
      font-size: 12px;
      animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  /**
   * 注册回调函数
   */
  on(event, callback) {
    this.callbacks[event] = callback;
  }
}
