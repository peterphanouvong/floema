import { Camera, Renderer, Transform } from "ogl";
import About from "./About";
import Collections from "./Collections";
import Detail from "./Detail";
import Home from "./Home";
import Transition from "./Transition";

export default class Canvas {
  constructor({ template }) {
    this.template = template;

    this.x = {
      start: 0,
      end: 0,
    };

    this.y = {
      start: 0,
      end: 0,
    };

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    // this.onChange(template);

    this.isDown = false;
  }

  createRenderer() {
    this.renderer = new Renderer({ alpha: true, antialias: true });
    this.gl = this.renderer.gl;
    document.body.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.position.z = 5;
  }

  createScene() {
    this.scene = new Transform();
  }

  /**
   * Home
   */

  createHome() {
    this.home = new Home({ gl: this.gl, scene: this.scene, sizes: this.sizes });
  }

  destroyHome() {
    if (this.home) {
      this.home.destroy();
      this.home = null;
    }
  }

  /**
   * About
   */

  createAbout() {
    this.about = new About({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
    });
  }

  destroyAbout() {
    if (this.about) {
      this.about.destroy();
      this.about = null;
    }
  }

  /**
   * Collections
   */

  createCollections() {
    this.collections = new Collections({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
      transition: this.transition,
    });
  }

  destroyCollections() {
    if (this.collections) {
      this.collections.destroy();
      this.collections = null;
    }
  }

  /**
   * Detail
   */

  createDetail() {
    this.detail = new Detail({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
      transition: this.transition,
    });
  }

  destroyDetail() {
    if (this.detail) {
      this.detail.destroy();
      this.detail = null;
    }
  }

  /**
   * Events.
   */

  onPreloaded() {
    this.onChange(this.template);
    this.onResize();
  }

  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height,
    });

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.sizes = {
      height,
      width,
    };

    if (this.home) {
      this.home.onResize({
        sizes: this.sizes,
      });
    }

    if (this.about) {
      this.about.onResize({
        sizes: this.sizes,
      });
    }

    if (this.collections) {
      this.collections.onResize({
        sizes: this.sizes,
      });
    }

    if (this.detail) {
      this.detail.onResize({
        sizes: this.sizes,
      });
    }
  }

  onChangeStart(url) {
    if (this.home) {
      this.home.hide();
    }

    if (this.about) {
      this.about.hide();
    }

    if (this.collections) {
      this.collections.hide();
    }

    this.isFromCollectionsToDetails =
      this.template === "collections" && url.indexOf("detail") > -1;

    this.isFromDetailsToCollections =
      this.template === "detail" && url.indexOf("collections") > -1;

    if (this.isFromCollectionsToDetails || this.isFromDetailsToCollections) {
      this.transition = new Transition({
        gl: this.gl,
        scene: this.scene,
        url,
      });

      if (this.transition) {
        this.transition.setElement(this.collections || this.detail);
      }
    }
  }

  onChange(template) {
    console.log("template:", template);

    if (template === "home") {
      this.createHome();
    } else {
      this.destroyHome();
    }

    if (template === "about") {
      this.createAbout();
    } else {
      this.destroyAbout();
    }

    if (template === "collections") {
      this.createCollections();
    } else {
      this.destroyCollections();
    }

    if (template === "detail") {
      this.createDetail();
    } else {
      this.destroyDetail();
    }

    this.template = template;
  }

  onWheel(event) {
    if (this.home) {
      this.home.onWheel(event);
    }

    if (this.about) {
      this.about.onWheel(event);
    }

    if (this.collections) {
      this.collections.onWheel(event);
    }
  }

  onTouchDown(event) {
    this.isDown = true;
    this.x.start = event.touches ? event.touches[0].clientX : event.clientX;
    this.y.start = event.touches ? event.touches[0].clientY : event.clientY;

    if (this.home) {
      this.home.onTouchDown({
        x: this.x,
        y: this.y,
      });
    }

    if (this.about) {
      this.about.onTouchDown({
        x: this.x,
        y: this.y,
      });
    }

    if (this.collections) {
      this.collections.onTouchDown({
        x: this.x,
        y: this.y,
      });
    }
  }

  onTouchMove(event) {
    if (!this.isDown) return;
    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const y = event.touches ? event.touches[0].clientY : event.clientY;

    this.x.end = x;
    this.y.end = y;

    if (this.home) {
      this.home.onTouchMove({
        x: this.x,
        y: this.y,
      });
    }

    if (this.about) {
      this.about.onTouchMove({
        x: this.x,
        y: this.y,
      });
    }

    if (this.collections) {
      this.collections.onTouchMove({
        x: this.x,
        y: this.y,
      });
    }
  }

  onTouchUp(event) {
    this.isDown = false;
    const x = event.changedTouches
      ? event.changedTouches[0].clientX
      : event.clientX;
    const y = event.changedTouches
      ? event.changedTouches[0].clientY
      : event.clientY;

    this.x.end = x;
    this.y.end = y;
  }

  /**
   * Update.
   */
  update(scroll) {
    if (this.home) {
      this.home.update();
    }

    if (this.about) {
      this.about.update(scroll);
    }

    if (this.collections) {
      this.collections.update();
    }

    if (this.detail) {
      this.detail.update();
    }

    this.renderer.render({
      camera: this.camera,
      scene: this.scene,
    });
  }
}
