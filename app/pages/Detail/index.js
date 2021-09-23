import Page from "classes/Page";
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
    console.log(this.elements.button);
    this.link = new Button(this.elements.button);
  }

  destroy() {
    super.destroy();
    this.link.removeEventListeners();
  }
}

export default Detail;
