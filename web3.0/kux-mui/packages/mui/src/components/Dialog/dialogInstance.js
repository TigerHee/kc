/**
 * Owner: victor.ren@kupotech.com
 */
/* eslint-disable class-methods-use-this */

let dialogInstance = null;

class Instance {
  constructor() {
    this.modals = [];
  }

  add(modal) {
    const modalIndex = this.modals.indexOf(modal);
    if (modalIndex !== -1) {
      return;
    }
    this.modals.push(modal);
    this.addHidden();
  }

  remove(modal) {
    const modalIndex = this.modals.indexOf(modal);

    if (modalIndex === -1) {
      return;
    }
    this.modals.splice(modalIndex, 1);
    const modalsLength = this.modals.length;
    if (modalsLength === 0) {
      this.removeHidden();
    }
  }

  addHidden() {
    document.body.style.overflow = 'hidden';
  }

  removeHidden() {
    document.body.style.overflow = '';
  }
}

const getInstance = () => {
  if (dialogInstance) {
    return dialogInstance;
  }
  dialogInstance = new Instance();
  return dialogInstance;
};

export default getInstance;
