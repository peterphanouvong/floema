import About from "./pages/About";
import Collections from "./pages/Collections";
import Detail from "./pages/Detail";
import Home from "./pages/Home";

import each from "lodash/each";
import Preloader from "./components/Preloader";

class App {
  constructor() {
    this.createPreloader();
    this.createContent();
    this.createPages();
    this.addLinkListeners();
  }

  createPreloader() {
    this.preloader = new Preloader();
    this.preloader.once("completed", this.onPreloaded.bind(this));
  }

  createContent() {
    this.content = document.querySelector(".content");
    this.template = this.content.getAttribute("data-template");
  }

  createPages() {
    this.pages = {
      about: new About(),
      collections: new Collections(),
      detail: new Detail(),
      home: new Home(),
    };

    this.page = this.pages[this.template];
    this.page.create();
    this.page.show();
  }

  onPreloaded() {
    this.preloader.destroy();
    // this.page.show();
  }

  async onChange(url) {
    this.page.hide();
    const res = await window.fetch(url);

    if (res.status === 200) {
      const html = await res.text();
      const div = document.createElement("div");

      div.innerHTML = html;

      const divContent = div.querySelector(".content");

      this.template = divContent.getAttribute("data-template");

      this.content.setAttribute("data-template", this.template);

      this.content.innerHTML = divContent.innerHTML;

      this.page = this.pages[this.template];
      this.page.create();
      this.page.show();

      this.addLinkListeners();
    } else {
      console.log("error");
    }
  }

  addLinkListeners() {
    const links = document.querySelectorAll("a");
    each(links, (link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const { href } = link;

        this.onChange(href);
      });
    });
  }
}

new App();
