import { Mesh, Program, Plane } from "ogl";
import vertex from "shaders/plane-vertex.glsl";
import fragment from "shaders/plane-fragment.glsl";
import gsap from "gsap";

export default class Transition {
  constructor({ details, gl, scene, url }) {
    this.details = details;
    this.gl = gl;
    this.scene = scene;
    this.url = url;

    this.geometry = new Plane(this.gl);
  }

  createProgram(texture) {
    this.program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms: {
        tMap: {
          value: texture,
        },
        uAlpha: {
          value: 1,
        },
      },
    });
  }

  createMesh(mesh) {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.mesh.scale.x = mesh.scale.x;
    this.mesh.scale.y = mesh.scale.y;
    this.mesh.scale.z = mesh.scale.z;

    this.mesh.position.x = mesh.position.x;
    this.mesh.position.y = mesh.position.y;

    this.mesh.setParent(this.scene);
  }

  setElement(element) {
    if (element.id === "collections") {
      const { index, medias } = element;
      const media = medias[index];

      this.createProgram(media.texture);
      this.createMesh(media.mesh);
      this.mesh.position.z = media.mesh.position.z + 0.01;

      this.transition = "detail";
    } else {
      this.createProgram(element.texture);
      this.createMesh(element.mesh);
      this.mesh.position.z = 0.01;

      this.transition = "collections";
    }
  }

  /**
   * Transitions.
   */
  animate(element, onComplete) {
    // if (this.transition === "detail") {
    const timeline = gsap.timeline({
      delay: 0.5,
      onComplete,
    });
    timeline.to(
      this.mesh.scale,
      {
        duration: 1.5,
        ease: "expo.inOut",
        x: element.scale.x,
        y: element.scale.y,
        z: element.scale.z,
      },
      0
    );

    timeline.to(
      this.mesh.position,
      {
        duration: 1.5,
        ease: "expo.inOut",
        x: element.position.x,
        y: element.position.y,
      },
      0
    );

    timeline.call(() => {
      this.scene.removeChild(this.mesh);
    });
    // }
  }
}
