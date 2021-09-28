import { Mesh, Program, Texture } from "ogl";
import vertex from "shaders/plane-vertex.glsl";
import fragment from "shaders/plane-fragment.glsl";
import gsap from "gsap";

export default class {
  constructor({ element, gl, geometry, scene, index, sizes }) {
    this.element = element;
    this.gl = gl;
    this.geometry = geometry;
    this.scene = scene;
    this.index = index;
    this.sizes = sizes;

    this.createTexture();
    this.createProgram();
    this.createMesh();

    this.extra = {
      x: 0,
      y: 0,
    };
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
          value: 1,
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

    this.mesh.position.x += this.index * this.mesh.scale.x;
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
    this.createBounds(sizes);
  }

  /**
   * Animations.
   */
  show() {
    gsap.fromTo(
      this.program.uniforms.uAlpha,
      {
        value: 0,
      },
      {
        value: 1,
      }
    );
  }

  hide() {
    gsap.to(this.program.uniforms.uAlpha, {
      value: 0,
    });
  }

  /**
   * Loop.
   */

  updateScale() {
    this.height = this.bounds.height / window.innerHeight;
    this.width = this.bounds.width / window.innerWidth;

    this.mesh.scale.x = this.sizes.width * this.width;
    this.mesh.scale.y = this.sizes.height * this.height;
  }

  updateX(x = 0) {
    this.mesh.position.x =
      -this.sizes.width / 2 +
      this.mesh.scale.x / 2 +
      ((this.bounds.left - x) / window.innerWidth) * this.sizes.width;
  }

  updateY(y = 0) {
    this.mesh.position.y =
      this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      ((this.bounds.top - y) / window.innerHeight) * this.sizes.height -
      this.extra.y;
  }

  update(scroll) {
    this.updateX(scroll.x);
    this.updateY(scroll.y);
  }
}
