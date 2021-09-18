import Component from "classes/Component";
import each from "lodash/each";
import GSAP from "gsap";
import { split } from "../utils/text";

class Preloader extends Component {
  constructor() {
    super({
      element: ".preloader",
      elements: {
        text: ".preloader__text",
        number: ".preloader__number",
        numberText: ".preloader__number__text",
        images: document.querySelectorAll("img"),
      },
    });

    split({
      element: this.elements.text,
      expression: "<br/>",
    });

    split({
      element: this.elements.text,
      expression: "<br/>",
    });

    this.elements.titleSpans = this.elements.text.querySelectorAll("span span");

    console.log(this.elements.titleSpans);

    this.length = 0;
    this.createLoader();
  }

  createLoader() {
    each(this.elements.images, (element) => {
      element.onload = (_) => this.onAssetLoaded();
      element.src = element.getAttribute("data-src");
    });
  }

  onAssetLoaded() {
    this.length += 1;
    const percentageLoaded = Math.round(
      (this.length / this.elements.images.length) * 100
    );
    this.elements.numberText.innerText = percentageLoaded + "%";

    if (percentageLoaded === 100) {
      this.onLoaded();
    }
  }

  onLoaded() {
    return new Promise((resolve) => {
      this.animateOut = GSAP.timeline({
        delay: 2,
      });

      this.animateOut.to(this.elements.titleSpans, {
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.1,
        y: "100%",
      });

      this.animateOut.to(
        this.elements.numberText,
        {
          duration: 1.5,
          ease: "expo.out",
          y: "100%",
        },
        "-=1.4"
      );

      this.animateOut.to(
        this.element,
        {
          duration: 1.5,
          ease: "expo.out",
          scaleY: 0,
          transformOrigin: "100% 100%",
        },
        "-=1"
      );

      this.animateOut.call((_) => this.emit("completed"));
    });
  }

  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}

export default Preloader;
