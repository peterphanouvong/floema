import Media from "./Media";
import map from "lodash/map";
import { Plane, Transform } from "ogl";
import gsap from "gsap";

export default class {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.sizes = sizes;
    this.group = new Transform();

    this.galleryElement = document.querySelector(".home_gallery");
    this.mediasElements = document.querySelectorAll(
      ".home__gallery__media__image "
    );

    this.createGeometry();
    this.createGallery();

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

  createGeometry() {
    this.geometry = new Plane(this.gl);
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

  onResize(event) {
    map(this.medias, (media) => media.onResize(event));

    this.galleryBounds = this.galleryElement.getBoundingClientRect();

    this.sizes = event.sizes;
  }

  onTouchDown({ x, y }) {}

  onTouchMove({ x, y }) {
    this.x.target += x.start - x.end;
    this.y.target += y.start - y.end;
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

    map(this.medias, (media, index) => {
      if (
        this.x.direction === "left" &&
        media.mesh.position.x + media.mesh.scale.x / 2 < -this.sizes.width / 2
      ) {
        media.extra.x += this.galleryWidth;

        media.mesh.rotation.z = gsap.utils.random(
          -Math.PI * 0.03,
          Math.PI * 0.03
        );
      } else if (
        this.x.direction === "right" &&
        media.mesh.position.x - media.mesh.scale.x / 2 > this.sizes.width / 2
      ) {
        media.extra.x -= this.galleryWidth;
        media.mesh.rotation.z = gsap.utils.random(
          -Math.PI * 0.03,
          Math.PI * 0.03
        );
      }

      if (
        this.y.direction === "up" &&
        media.mesh.position.y + media.mesh.scale.y / 2 < -this.sizes.height / 2
      ) {
        media.extra.y -= this.galleryHeight;
        media.mesh.rotation.z = gsap.utils.random(
          -Math.PI * 0.03,
          Math.PI * 0.03
        );
      } else if (
        this.y.direction === "down" &&
        media.mesh.position.y - media.mesh.scale.y / 2 > this.sizes.height / 2
      ) {
        media.extra.y += this.galleryHeight;
        media.mesh.rotation.z = gsap.utils.random(
          -Math.PI * 0.03,
          Math.PI * 0.03
        );
      }

      media.update(this.scroll);
    });
  }
}
