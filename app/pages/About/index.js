import Page from "classes/Page";

class About extends Page {
  constructor() {
    super({
      elements: {
        wrapper: ".about__wrapper",
      },
      element: ".about",
      id: "about",
    });
  }
}

export default About;
