import GSAP from "gsap";
import each from "lodash/each";
import normalizeWheel from "normalize-wheel";
import Prefix from "prefix";
import map from "lodash/map";
import Title from "../animations/Title";
import Paragraph from "../animations/Paragraph";
class Page {
  constructor({ element, elements, id }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      animationsTitles: '[data-animation="title"]',
      animationsParagraphs: '[data-animation="paragraph"]',
    };
    this.id = id;
    this.transformPrefix = Prefix("transform");
  }

  /**
   * CRUD
   */

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

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
    };
    this.onResize();

    // this.addEventListeners();
    this.createAnimations();
  }

  createAnimations() {
    this.animations = [];

    // Titles.
    this.animationsTitles = map(this.elements.animationsTitles, (element) => {
      return new Title({ element });
    });

    this.animations.push(...this.animationsTitles);

    // Paragraphs.
    this.animationsParagraphs = map(
      this.elements.animationsParagraphs,
      (element) => {
        return new Paragraph({ element });
      }
    );

    this.animations.push(...this.animationsParagraphs);
  }

  show() {
    return new Promise((resolve) => {
      this.animateIn = GSAP.timeline();

      this.animateIn.fromTo(
        this.element,
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
        }
      );

      this.animateIn.call((_) => {
        this.addEventListeners();
        this.onResize();
        resolve();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.removeEventListeners();
      this.animateOut = GSAP.timeline();

      this.animateOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  update() {
    this.scroll.target = GSAP.utils.clamp(
      0,
      this.scroll.limit,
      this.scroll.target
    );

    this.scroll.current = GSAP.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      0.15
    );

    if (this.scroll.current < 0.01) this.scroll.current = 0;
    if (this.elements.wrapper) {
      this.elements.wrapper.style[
        this.transformPrefix
      ] = `translateY(-${this.scroll.current}px)`;
    }
  }

  /**
   * Events.
   */

  onResize() {
    if (this.elements.wrapper)
      this.scroll.limit =
        this.elements.wrapper.clientHeight - window.innerHeight;

    each(this.animations, (animation) => animation.onResize());
  }

  onMouseWheel(e) {
    const { pixelY } = normalizeWheel(e);
    this.scroll.target += pixelY;
  }

  addEventListeners() {
    window.addEventListener("mousewheel", this.onMouseWheel.bind(this));
    window.addEventListener("resize", this.onResize.bind(this));
  }

  removeEventListeners() {
    window.removeEventListener("mousewheel", this.onMouseWheel.bind(this));
    window.removeEventListener("resize", this.onResize.bind(this));
  }
}

export default Page;
