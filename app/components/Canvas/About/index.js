import map from "lodash/map";
import { Plane, Transform } from "ogl";
import Gallery from "./Gallery";

export default class {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.sizes = sizes;
    this.scene = scene;

    this.createGeometry();
    this.createGalleries();
    this.show();
  }

  /**
   * Animations
   */

  show() {
    map(this.galleries, (gallery) => gallery.show());
  }

  hide() {
    map(this.galleries, (gallery) => gallery.hide());
  }

  createGeometry() {
    this.geometry = new Plane(this.gl);
  }

  createGalleries() {
    this.galleriesElements = document.querySelectorAll(".about__gallery");

    this.galleries = map(this.galleriesElements, (element, index) => {
      return new Gallery({
        element,
        index,
        gl: this.gl,
        geometry: this.geometry,
        scene: this.scene,
        sizes: this.sizes,
      });
    });

    console.log(this.galleries);
  }

  /**
   * Events
   */

  onWheel(event) {
    map(this.galleries, (gallery) => gallery.onWheel(event));
  }

  onResize(event) {
    map(this.galleries, (gallery) => gallery.onResize(event));
  }

  onTouchDown(event) {
    map(this.galleries, (gallery) => gallery.onTouchDown(event));
  }

  onTouchMove(event) {
    map(this.galleries, (gallery) => gallery.onTouchMove(event));
  }

  onTouchUp(event) {
    map(this.galleries, (gallery) => gallery.onTouchUp(event));
  }

  /**
   * Update
   */
  update(scroll) {
    map(this.galleries, (gallery) => gallery.update(scroll));
  }

  /**
   * Destroy
   */

  destroy() {
    map(this.galleries, (gallery) => gallery.destroy());
  }
}
