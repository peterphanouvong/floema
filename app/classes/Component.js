import each from "lodash/each";
import GSAP from "gsap";
import EventEmitter from "events";

class Component extends EventEmitter {
  constructor({ element, elements }) {
    super();
    this.selector = element;
    this.selectorChildren = { ...elements };
    this.create();
    this.addEventListeners();
  }

  create() {
    if (this.selector instanceof HTMLElement) {
      this.element = this.selector;
    } else {
      this.element = document.querySelector(this.selector);
    }
    this.elements = {};

    each(this.selectorChildren, (selector, name) => {
      if (
        selector instanceof window.HTMLElement ||
        selector instanceof window.NodeList
      ) {
        this.elements[name] = selector;
      } else {
        this.elements[name] = document.querySelectorAll(selector);

        if (this.elements[name].length === 0) {
          this.elements[name] = null;
        } else if (this.elements[name].length === 1) {
          this.elements[name] = document.querySelector(selector);
        }
      }
    });
  }

  addEventListeners() {}

  removeEventListeners() {}
}

export default Component;
