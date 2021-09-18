import Page from "classes/Page";

class Home extends Page {
  constructor() {
    super({
      element: ".home",
      elements: {
        button: document.querySelector(".home__link"),
        titles: ".home__titles",
        gallery: ".home_gallery",
        navigation: ".navigation",
      },
      id: "home",
    });
  }

  create() {
    super.create();

    this.elements.button.addEventListener("click", () =>
      console.log("You clicked da button idiot")
    );
  }
}

export default Home;
