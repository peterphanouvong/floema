import Page from "classes/Page";
import gsap from "gsap";
import Button from "../../components/Button";

class Detail extends Page {
  constructor() {
    super({
      element: ".detail",
      id: "detail",
      elements: {
        button: ".detail__button",
      },
    });
  }

  create() {
    super.create();
    this.link = new Button(this.elements.button);
  }

  destroy() {
    super.destroy();
    this.link.removeEventListeners();
  }

  show() {
    const timeline = gsap.timeline({ delay: 2 });

    timeline.fromTo(
      this.element,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
      }
    );

    super.show(timeline);
  }
}

export default Detail;
