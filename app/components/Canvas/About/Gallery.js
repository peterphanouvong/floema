import map from "lodash/map";
import Media from "./Media";
import gsap from "gsap";
import { Transform } from "ogl";

export default class Gallery {
  constructor({ element, gl, geometry, scene, index, sizes }) {
    this.element = element;
    this.geometry = geometry;
    this.gl = gl;
    this.index = index;
    this.scene = scene;
    this.sizes = sizes;

    // this.onResize();
    this.group = new Transform();
    this.createMedias();

    this.group.setParent(this.scene);
  }

  /**
   * Animations
   */

  show() {
    map(this.medias, (media) => media.show());
  }

  hide() {
    map(this.medias, (media) => media.hide());
  }

  createMedias() {
    this.mediaElements = this.element.querySelectorAll(
      ".about__gallery__media"
    );

    this.medias = map(this.mediaElements, (element, index) => {
      return new Media({
        element,
        gl: this.gl,
        geometry: this.geometry,
        scene: this.group,
        index,
        sizes: this.sizes,
      });
    });

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      lerp: 0.1,
      y: 0,
    };

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1,
      limit: 0,
    };
  }

  /**
   * Events
   */

  onResize(event) {
    this.bounds = this.element.getBoundingClientRect();

    this.sizes = event.sizes;

    this.width = (this.bounds.width / window.innerWidth) * this.sizes.width;

    this.y.limit = this.bounds.height - window.innerHeight;

    map(this.medias, (media) => media.onResize(event));
  }

  onTouchDown({ x, y }) {}

  onTouchMove({ x, y }) {
    const distance = (x.start - x.end) / 20;

    console.log(distance);

    this.scroll.target += distance;
  }

  onTouchUp({ x, y }) {}

  onWheel({ pixelY }) {
    this.y.target += pixelY;
  }

  /**
   * Update
   */
  update(scroll) {
    if (!this.bounds) return;

    const distance = scroll.current - scroll.target;

    this.scroll.current = gsap.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      this.scroll.lerp
    );

    if (this.scroll.current < this.scroll.target) {
      this.direction = "left";
    } else if (this.scroll.current > this.scroll.target) {
      this.direction = "right";
    }

    this.scroll.target -= 1;
    this.scroll.target -= distance / 10;

    map(this.medias, (media, index) => {
      if (
        this.direction === "left" &&
        media.mesh.position.x + media.mesh.scale.x + 0.25 / 2 <
          -this.sizes.width / 2
      ) {
        media.extra.x += this.width;
      } else if (
        this.direction === "right" &&
        media.mesh.position.x - media.mesh.scale.x - 0.25 / 2 >
          this.sizes.width / 2
      ) {
        media.extra.x -= this.width;
      }

      media.update(this.scroll);
    });

    this.group.position.y =
      (scroll.current / window.innerHeight) * this.sizes.height;
  }

  /**
   * Destroy.
   */
  destroy() {
    console.log("destroy gallery  ");
    this.scene.removeChild(this.group);
  }
}
