import Media from "./Media";
import map from "lodash/map";
import { Plane, Transform } from "ogl";
import gsap from "gsap";

export default class {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.sizes = sizes;
    this.group = new Transform();
    this.scene = scene;

    this.galleryElement = document.querySelector(".home_gallery");
    this.mediasElements = document.querySelectorAll(
      ".home__gallery__media__image "
    );

    this.createGeometry();
    this.createGallery();
    this.show();

    this.group.setParent(scene);

    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.scroll = {
      x: 0,
      y: 0,
    };
  }

  /**
   * Animations.
   */

  show() {
    map(this.medias, (media) => media.show());
  }

  hide() {
    map(this.medias, (media) => media.hide());
  }

  createGeometry() {
    this.geometry = new Plane(this.gl, {
      heightSegments: 20,
      widthSegments: 20,
    });
  }

  createGallery() {
    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
        element,
        index,
        gl: this.gl,
        geometry: this.geometry,
        scene: this.group,
        sizes: this.sizes,
      });
    });
  }

  /**
   * Events
   */

  onWheel({ pixelX, pixelY }) {
    this.x.target += pixelX;
    this.y.target += pixelY;
  }

  onResize(event) {
    this.galleryBounds = this.galleryElement.getBoundingClientRect();

    this.sizes = event.sizes;

    map(this.medias, (media) => media.onResize(event));
  }

  onTouchDown({ x, y }) {}

  onTouchMove({ x, y }) {
    this.x.target += (x.start - x.end) / 20;
    this.y.target += (y.start - y.end) / 20;
  }

  onTouchUp({ x, y }) {}

  /**
   * Update
   */
  update() {
    if (!this.galleryBounds) return;

    this.x.current = gsap.utils.interpolate(
      this.x.current,
      this.x.target,
      this.x.lerp
    );
    this.y.current = gsap.utils.interpolate(
      this.y.current,
      this.y.target,
      this.y.lerp
    );

    if (this.scroll.x < this.x.current) {
      this.x.direction = "left";
    } else if (this.scroll.x > this.x.current) {
      this.x.direction = "right";
    }

    if (this.scroll.y < this.y.current) {
      this.y.direction = "down";
    } else if (this.scroll.y > this.y.current) {
      this.y.direction = "up";
    }

    this.galleryWidth =
      (this.galleryBounds.width / window.innerWidth) * this.sizes.width;

    this.galleryHeight =
      (this.galleryBounds.height / window.innerHeight) * this.sizes.height;

    this.scroll.x = this.x.current;
    this.scroll.y = this.y.current;

    this.y.target += 1;

    map(this.medias, (media, index) => {
      if (
        this.x.direction === "left" &&
        media.mesh.position.x + media.mesh.scale.x / 2 < -this.sizes.width / 2
      ) {
        media.extra.x += this.galleryWidth;
      } else if (
        this.x.direction === "right" &&
        media.mesh.position.x - media.mesh.scale.x / 2 > this.sizes.width / 2
      ) {
        media.extra.x -= this.galleryWidth;
      }

      if (
        this.y.direction === "up" &&
        media.mesh.position.y + media.mesh.scale.y / 2 < -this.sizes.height / 2
      ) {
        media.extra.y -= this.galleryHeight;
      } else if (
        this.y.direction === "down" &&
        media.mesh.position.y - media.mesh.scale.y / 2 > this.sizes.height / 2
      ) {
        media.extra.y += this.galleryHeight;
      }

      const speed = this.y.target - this.y.current;

      media.update(this.scroll, speed);
    });
  }

  /**
   * Destroy
   */

  destroy() {
    console.log("destrpy home");
    this.scene.removeChild(this.group);
  }
}
