import { Camera, Renderer, Transform } from "ogl";
import About from "./About";
import Home from "./Home";

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
    this.onChange(template);

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

  createHome() {
    this.home = new Home({ gl: this.gl, scene: this.scene });
  }

  createAbout() {
    this.about = new About({ gl: this.gl, scene: this.scene });
  }

  /**
   * Events.
   */
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
  }

  onChangeStart() {
    if (this.home) {
      this.home.hide();
    }

    if (this.about) {
      this.about.hide();
    }
  }

  onChange(template) {
    console.log("template:", template);
    if (template === "home") {
      this.createHome();
    } else {
      if (this.home) {
        this.home.destroy();
        this.home = null;
      }
    }

    if (template === "about") {
      this.createAbout();
    } else {
      if (this.about) {
        this.about.destroy();
        this.about = null;
      }
    }
  }

  onWheel(event) {
    if (this.home) {
      this.home.onWheel(event);
    }

    if (this.about) {
      this.about.onWheel(event);
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
    this.renderer.render({
      camera: this.camera,
      scene: this.scene,
    });
  }
}
