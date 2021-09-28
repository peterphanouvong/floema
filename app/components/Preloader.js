import Component from "classes/Component";
import GSAP from "gsap";
import { Texture } from "ogl";
import { split } from "../utils/text";

class Preloader extends Component {
  constructor({ canvas }) {
    super({
      element: ".preloader",
      elements: {
        text: ".preloader__text",
        number: ".preloader__number",
        numberText: ".preloader__number__text",
      },
    });

    split({
      element: this.elements.text,
      expression: "<br>",
    });

    split({
      element: this.elements.text,
      expression: "<br>",
    });

    this.elements.titleSpans = this.elements.text.querySelectorAll("span span");

    this.canvas = canvas;
    window.TEXTURES = {};

    this.length = 0;
    this.createLoader();
  }

  createLoader() {
    window.ASSETS.forEach((imageUrl) => {
      const texture = new Texture(this.canvas.gl, {
        generateMipmaps: false,
      });

      const image = new window.Image();
      image.crossOrigin = "anonymouse";
      image.src = imageUrl;
      image.onload = () => {
        texture.image = image;
        this.onAssetLoaded();
      };

      window.TEXTURES[imageUrl] = texture;
    });
  }

  onAssetLoaded() {
    this.length += 1;
    const percentageLoaded = Math.round(
      (this.length / window.ASSETS.length) * 100
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
