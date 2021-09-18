import each from "lodash/each";
import GSAP from "gsap";

class Page {
  constructor({ element, elements, id }) {
    this.selector = element;
    this.selectorChildren = { ...elements };
    this.id = id;
  }

  create() {
    this.element = document.querySelector(this.selector);
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

  show() {
    return new Promise((resolve) => {
      GSAP.from(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      GSAP.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }
}

export default Page;
