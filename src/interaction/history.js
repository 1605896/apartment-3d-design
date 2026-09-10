/**
 * 历史管理系统 - 撤销/重做功能
 */

export class HistoryManager {
  constructor(maxStates = 50) {
    this.maxStates = maxStates;
    this.states = [];
    this.currentIndex = -1;
  }

  /**
   * 保存当前状态
   */
  saveState(furniture) {
    // 移除当前索引之后的所有状态
    this.states = this.states.slice(0, this.currentIndex + 1);

    // 保存新状态
    const state = furniture.map((obj) => ({
      name: obj.name,
      position: obj.position.clone(),
      rotation: obj.rotation.clone(),
    }));

    this.states.push(state);
    this.currentIndex++;

    // 限制状态数量
    if (this.states.length > this.maxStates) {
      this.states.shift();
      this.currentIndex--;
    }
  }

  /**
   * 撤销
   */
  undo(furniture) {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.applyState(furniture, this.states[this.currentIndex]);
    }
    return null;
  }

  /**
   * 重做
   */
  redo(furniture) {
    if (this.currentIndex < this.states.length - 1) {
      this.currentIndex++;
      return this.applyState(furniture, this.states[this.currentIndex]);
    }
    return null;
  }

  /**
   * 应用状态
   */
  applyState(furniture, state) {
    for (const savedObject of state) {
      const furnitureObject = furniture.find((obj) => obj.name === savedObject.name);
      if (furnitureObject) {
        furnitureObject.position.copy(savedObject.position);
        furnitureObject.rotation.copy(savedObject.rotation);
      }
    }
    return state;
  }

  /**
   * 是否可以撤销
   */
  canUndo() {
    return this.currentIndex > 0;
  }

  /**
   * 是否可以重做
   */
  canRedo() {
    return this.currentIndex < this.states.length - 1;
  }

  /**
   * 清除历史
   */
  clear() {
    this.states = [];
    this.currentIndex = -1;
  }

  /**
   * 获取历史信息
   */
  getInfo() {
    return {
      totalStates: this.states.length,
      currentIndex: this.currentIndex,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
    };
  }
}
