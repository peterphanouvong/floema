import { Mesh, Program } from "ogl";
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
    this.createBounds({ sizes: this.sizes });

    this.opacity = {
      current: 0,
      target: 0,
      lerp: 0.1,
      multiplier: 0,
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
      this.opacity,
      {
        multiplier: 0,
      },
      {
        multiplier: 1,
      }
    );
  }

  hide() {
    gsap.to(this.opacity, {
      multiplier: 0,
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
      ((this.bounds.top - y) / window.innerHeight) * this.sizes.height;

    this.mesh.position.y +=
      Math.cos((this.mesh.position.x / this.sizes.width) * Math.PI * 0.1) * 40 -
      40;
  }

  update(scroll, index) {
    this.updateX(scroll.x);
    this.updateY(scroll.y);

    this.opacity.target = this.index === index ? 1 : 0.4;
    this.opacity.current = gsap.utils.interpolate(
      this.opacity.current,
      this.opacity.target,
      this.opacity.lerp
    );

    this.program.uniforms.uAlpha.value =
      this.opacity.current * this.opacity.multiplier;
  }
}
