import gsap from "gsap";
import Animation from "../classes/Animation";
import { calculate } from "../utils/text";

class Highlight extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
    this.elementLabel = this.element.querySelector(".about__highlight__label");
  }

  animateIn() {
    if (this.elementLabel) {
      this.animateInTimeline = gsap.timeline();

      this.animateInTimeline.set(this.element, {
        autoAlpha: 1,
      });

      this.animateInTimeline.fromTo(
        this.elementLabel,
        {
          autoAlpha: 0,
          y: "5rem",
        },
        {
          autoAlpha: 1,
          duration: 1.2,
          delay: 1,
          ease: "expo.out",
          y: "0%",
        }
      );
    }
  }

  animateOut() {
    if (this.elementLabel) {
      gsap.set(this.element, {
        autoAlpha: 0,
      });
    }
  }

  onResize() {}
}

export default Highlight;
