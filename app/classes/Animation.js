import Component from "./Component";

class Animation extends Component {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });
    this.element = element;

    this.createObserver();
  }

  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateIn();
        } else {
          this.animateOut();
        }
      });
    });

    this.observer.observe(this.element);
  }

  animateIn() {}

  animateOut() {}
}

export default Animation;
