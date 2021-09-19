import gsap from "gsap";
import Animation from "../classes/Animation";
import { split, calculate, splitChars } from "../utils/text";

class Title extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });

    const { lines } = splitChars({ element });
    this.lines = lines;

    this.elementCharacters = this.element.querySelectorAll("span span");
    console.log(this.elementCharacters);
  }

  animateIn() {
    this.animateInTimeline = gsap.timeline({ delay: 0.5 });

    this.animateInTimeline.set(this.element, {
      autoAlpha: 1,
    });

    this.lines.forEach((line, index) => {
      this.animateInTimeline.fromTo(
        line.querySelectorAll("span"),
        {
          y: "100%",
        },
        {
          delay: index * 0.3,
          duration: 1.2,
          ease: "elastic.out(0.4, 0.6)",
          stagger: {
            amount: 0.2,
            from: "random",
          },
          y: "0%",
        },
        0
      );
    });
  }

  animateOut() {
    gsap.set(this.element, {
      autoAlpha: 0,
    });
  }

  onResize() {
    // this.elementLines = calculate(this.elementLineSpans);
  }
}

export default Title;
