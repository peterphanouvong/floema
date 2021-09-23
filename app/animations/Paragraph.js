import gsap from "gsap";
import Animation from "../classes/Animation";
import { split, calculate } from "../utils/text";

class Paragraph extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });

    const paragraphs = element.querySelectorAll("p");
    paragraphs.forEach((paragraph) => {
      split({
        element: paragraph,
        append: false,
      });

      split({
        element: paragraph,
        append: false,
      });
    });

    this.elementWordSpans = this.element.querySelectorAll("span span");
  }

  animateIn() {
    gsap.set(this.element, {
      autoAlpha: 1,
    });

    gsap.fromTo(
      this.elementWords,
      {
        y: "100%",
      },
      {
        delay: 0.5,
        duration: 1.5,
        ease: "expo.out",
        stagger: {
          amount: 1,
        },
        y: "0%",
      }
    );
  }

  animateOut() {
    gsap.set(this.element, {
      autoAlpha: 0,
    });
  }

  onResize() {
    this.elementWords = calculate(this.elementWordSpans);
  }
}

export default Paragraph;
