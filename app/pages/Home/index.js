import Page from "classes/Page";
import Button from "../../components/Button";

class Home extends Page {
  constructor() {
    super({
      element: ".home",
      elements: {
        button: ".home__link",
        titles: ".home__titles",
        gallery: ".home_gallery",
        navigation: ".navigation",
      },
      id: "home",
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
}

export default Home;
