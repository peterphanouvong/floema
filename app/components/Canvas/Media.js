import { Mesh, Program, Texture } from "ogl";
import vertex from "../../shaders/plane-vertex.glsl";
import fragment from "../../shaders/plane-fragment.glsl";

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
    this.texture = new Texture(this.gl);

    this.img = new Image();
    this.img.crossOrigin = "anonymous";
    this.img.src = this.element.getAttribute("data-src");
    this.img.onload = () => (this.texture.image = this.img);
  }

  createProgram() {
    this.program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms: {
        tMap: {
          value: this.texture,
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
      ((this.bounds.left - x / 25) / window.innerWidth) * this.sizes.width +
      this.extra.x;
  }

  updateY(y = 0) {
    this.mesh.position.y =
      this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      ((this.bounds.top - y / 25) / window.innerHeight) * this.sizes.height -
      this.extra.y;
  }

  update(scroll) {
    this.updateX(scroll.x);
    this.updateY(scroll.y);
  }
}
