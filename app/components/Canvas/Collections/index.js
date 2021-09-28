import Media from "./Media";
import map from "lodash/map";
import { Plane, Transform } from "ogl";
import gsap from "gsap";
import Prefix from "prefix";

export default class {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.sizes = sizes;
    this.group = new Transform();
    this.scene = scene;

    this.transformPrefix = Prefix("transform");
    this.galleryElement = document.querySelector(".collections__gallery");
    this.galleryWrapperElement = document.querySelector(
      ".collections__gallery__wrapper"
    );
    this.mediasElements = document.querySelectorAll(
      ".collections__gallery__media__image"
    );
    this.descriptionElements = document.querySelectorAll(
      ".collections__content__article"
    );
    this.titleElements = document.querySelector(".collections__titles");

    this.createGeometry();
    this.createGallery();
    this.show();

    this.group.setParent(scene);

    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1,
      limit: 0,
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

  onChangeIndex(index) {
    const currentCollection = parseInt(
      this.medias[index].element.getAttribute("data-collection")
    );

    map(this.descriptionElements, (el, idx) => {
      if (idx === currentCollection) {
        el.classList.add("collections__content__article--active");
      } else {
        el.classList.remove("collections__content__article--active");
      }
    });

    this.titleElements.style[this.transformPrefix] = `
      translateY(-${250 * currentCollection}%)
      translate(-50%, -50%) rotate(-90deg)
    `;
    console.log(currentCollection);
  }

  onWheel({ pixelX, pixelY }) {
    this.x.target += pixelX;
    this.x.target += pixelY;
  }

  onResize(event) {
    this.galleryBounds = this.galleryWrapperElement.getBoundingClientRect();

    this.sizes = event.sizes;

    map(this.medias, (media) => media.onResize(event));

    this.x.limit =
      this.galleryBounds.width - this.medias[0].element.clientWidth;
  }

  onTouchDown({ x, y }) {}

  onTouchMove({ x, y }) {
    this.x.target += (x.start - x.end) / 20;
  }

  onTouchUp({ x, y }) {}

  /**
   * Update
   */
  update() {
    if (!this.galleryBounds) return;

    this.x.target = gsap.utils.clamp(0, this.x.limit, this.x.target);

    this.x.current = gsap.utils.interpolate(
      this.x.current,
      this.x.target,
      this.x.lerp
    );

    this.scroll.x = this.x.current;

    this.galleryElement.style[
      this.transformPrefix
    ] = `translateX(-${this.x.current}px)`;

    map(this.medias, (media, index) => {
      media.update(this.scroll);
    });

    const index = Math.round(
      (this.x.current / (this.x.limit + this.medias[0].element.clientWidth)) *
        this.medias.length
    );

    if (this.index !== index) {
      this.onChangeIndex(index);

      this.index = index;
    }
  }

  /**
   * Destroy
   */

  destroy() {
    console.log("destrpy home");
    this.scene.removeChild(this.group);
  }
}
