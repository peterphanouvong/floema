import { Mesh, Program, Plane } from "ogl";
import vertex from "shaders/plane-vertex.glsl";
import fragment from "shaders/plane-fragment.glsl";
import gsap from "gsap";

export default class {
  constructor({ gl, scene, sizes, transition }) {
    this.id = "detail";
    this.element = document.querySelector(".detail__media__image");
    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;
    this.transition = transition;

    // console.log("detail sizes", this.sizes);

    this.geometry = new Plane(this.gl);

    this.createTexture();
    this.createProgram();
    this.createMesh();
    this.createBounds({ sizes: this.sizes });

    // this.onResize(sizes);

    this.show();
  }

  createTexture() {
    this.texture = window.TEXTURES[this.element.getAttribute("data-src")];
  }

  createProgram() {
    this.program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms: {
        tMap: {
          value: this.texture,
        },
        uAlpha: {
          value: 0,
        },
      },
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.mesh.setParent(this.scene);
  }

  createBounds({ sizes }) {
    this.bounds = this.element.getBoundingClientRect();
    this.sizes = sizes;

    this.updateScale(sizes);
    this.updateX();
    this.updateY();
  }

  /**
   * Events.
   */
  onResize(sizes) {
    this.createBounds({ sizes: this.sizes });
    this.updateX();
    this.updateY();
  }

  /**
   * Animations.
   */
  show() {
    if (this.transition) {
      this.transition.animate(this.mesh, () => {
        this.program.uniforms.uAlpha.value = 1;
      });
    } else {
      gsap.to(this.program.uniforms.uAlpha, {
        value: 1,
        duration: 1,
      });
    }
  }

  hide() {}

  /**
   * Loop.
   */

  updateScale() {
    this.height = this.bounds.height / window.innerHeight;
    this.width = this.bounds.width / window.innerWidth;

    this.mesh.scale.x = this.sizes.width * this.width;
    this.mesh.scale.y = this.sizes.height * this.height;

    console.log(this.sizes.width, this.width);
  }

  updateX() {
    this.mesh.position.x =
      -this.sizes.width / 2 +
      this.mesh.scale.x / 2 +
      (this.bounds.left / window.innerWidth) * this.sizes.width;
  }

  updateY() {
    this.mesh.position.y =
      this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      (this.bounds.top / window.innerHeight) * this.sizes.height;

    this.mesh.position.y +=
      Math.cos((this.mesh.position.x / this.sizes.width) * Math.PI * 0.1) * 40 -
      40;
  }

  update() {
    if (!this.bounds) this.updateX();
    this.updateY();
  }

  destroy() {
    this.scene.removeChild(this.mesh);
  }
}
