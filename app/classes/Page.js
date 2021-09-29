import GSAP from "gsap";
import each from "lodash/each";
import map from "lodash/map";
import Prefix from "prefix";
import Highlight from "../animations/Highlight";
import Paragraph from "../animations/Paragraph";
import Title from "../animations/Title";
import AsyncLoad from "./AsyncLoad";
import { ColorsManager } from "./Colors";

class Page {
  constructor({ element, elements, id }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      animationsTitles: '[data-animation="title"]',
      animationsParagraphs: '[data-animation="paragraph"]',
      animationsHighlights: '[data-animation="highlight"]',

      preloaders: "[data-src]",
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

    this.createAnimations();
    this.createPreloader();
  }

  createPreloader() {
    this.preloaders = map(this.elements.preloaders, (element) => {
      return new AsyncLoad({ element });
    });
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

    // Highlights.
    this.animationsHighlights = map(
      this.elements.animationsHighlights,
      (element) => {
        return new Highlight({ element });
      }
    );

    this.animations.push(...this.animationsHighlights);
  }

  show(animation) {
    return new Promise((resolve) => {
      ColorsManager.change({
        backgroundColor: this.element.getAttribute("data-background"),
        color: this.element.getAttribute("data-color"),
      });

      if (animation) {
        this.animateIn = animation;
      } else {
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
      }

      this.animateIn.call((_) => {
        this.addEventListeners();
        this.onResize();
        resolve();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.destroy();
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
      0.1
    );

    if (this.scroll.current < 0.01) this.scroll.current = 0;
    if (this.elements.wrapper) {
      this.elements.wrapper.style[
        this.transformPrefix
      ] = `translateY(-${this.scroll.current}px)`;
    }
  }

  destroy() {
    this.removeEventListeners();
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

  onWheel({ pixelY }) {
    this.scroll.target += pixelY;
  }

  addEventListeners() {
    // window.addEventListener("mousewheel", this.onWheel.bind(this));
    window.addEventListener("resize", this.onResize.bind(this));
  }

  removeEventListeners() {
    // window.removeEventListener("mousewheel", this.onWheel.bind(this));
    window.removeEventListener("resize", this.onResize.bind(this));
  }
}

export default Page;
