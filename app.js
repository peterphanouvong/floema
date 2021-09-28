require("dotenv").config();

const errorHandler = require("errorhandler");
const express = require("express");
const logger = require("morgan");
const methodOverride = require("method-override");

const app = express();
const path = require("path");
const port = 3000;
const uaParser = require("ua-parser-js");

app.use(logger("dev"));
app.use(methodOverride());
app.use(errorHandler());
app.use(express.static(path.join(__dirname, "public")));

const Prismic = require("@prismicio/client");
const PrismicDOM = require("prismic-dom");

function initApi(req) {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req: req,
  });
}

const handleLinkResolver = (doc) => {
  return "/";
};

app.use((req, res, next) => {
  const ua = uaParser(req.headers["user-agent"]);

  res.locals.isDesktop = ua.device.type === undefined;
  res.locals.isPhone = ua.device.type === "mobile";
  res.locals.isTablet = ua.device.type === "tablet";

  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver,
  };
  res.locals.PrismicDOM = PrismicDOM;
  res.locals.Numbers = (index) => {
    return index == 0
      ? "One"
      : index == 1
      ? "Two"
      : index == 2
      ? "Three"
      : index == 3
      ? "Four"
      : "Five";
  };
  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const handleDefaults = async (api) => {
  const about = await api.getSingle("about");
  const home = await api.getSingle("home");
  const meta = await api.getSingle("metadata");
  const preloader = await api.getSingle("preloader");
  const { results: collections } = await api.query(
    Prismic.Predicates.at("document.type", "collection"),
    {
      fetchLinks: "product.image",
    }
  );

  let assets = [];

  home.data.gallery.forEach((item) => {
    assets.push(item.image.url);
  });

  about.data.gallery.forEach((item) => {
    assets.push(item.image.url);
  });

  about.data.body.forEach((section) => {
    if (section.slice_type === "gallery") {
      section.items.forEach((item) => {
        assets.push(item.image.url);
      });
    }
  });

  collections.forEach((collection) => {
    collection.data.products.forEach((item) => {
      assets.push(item.products_product.data.image.url);
    });
  });

  console.log(assets);

  return {
    about,
    assets,
    collections,
    home,
    meta,
    preloader,
  };
};

app.get("/", async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleDefaults(api);
  const { results: collections } = await api.query(
    Prismic.Predicates.at("document.type", "collection"),
    {
      fetchLinks: "product.image",
    }
  );

  res.render("pages/home", {
    ...defaults,
    collections,
  });
});

app.get("/about", async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleDefaults(api);

  res.render("pages/about", {
    ...defaults,
  });
});

app.get("/collections", async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleDefaults(api);

  const { results: collections } = await api.query(
    Prismic.Predicates.at("document.type", "collection"),
    {
      fetchLinks: "product.image",
    }
  );

  res.render("pages/collections", {
    ...defaults,
    collections,
  });
});

app.get("/detail/:id", async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleDefaults(api);
  const product = await api.getByUID("product", req.params.id, {
    fetchLinks: "collection.title",
  });

  res.render("pages/detail", {
    ...defaults,
    product,
  });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
