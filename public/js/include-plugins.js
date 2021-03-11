(function () {
  "use strict";

  window.addEventListener("DOMContentLoaded", function () {
    Menu({
      menuID: "main-menu",
      buttonCheckerID: "menu-checker",
      headerHeight: document.querySelector("header").offsetHeight,
      items: [
        { name: "home", href: "" },
        { name: "features", href: "features" },
        { name: "about", href: "about" },
        { name: "work", href: "portfolio" },
        { name: "skills", href: "skills" },
        { name: "blog", href: "blog-news" },
        { name: "team", href: "team" },
        { name: "contact", href: "contacts" },
      ],
    });

    Slider({
      sliderID: "main",
      countSlides: 4,
      navButtons: {
        prev: true,
        next: true,
      },
    });

    ScrollEffect({
      buttonID: "main-slider-after-section",
      finalElemID: "features",
    });

    ScrollEffect({
      buttonID: "to-portfolio",
      finalElemID: "portfolio",
    });

    ScrollEffect({
      buttonID: "to-skills",
      finalElemID: "skills",
    });

    ScrollEffect({
      buttonID: "to-team",
      finalElemID: "team",
    });

    ScrollEffect({
      buttonID: "to-contacts",
      finalElemID: "contacts",
    });

    AnimateBlocks({
      parentID: "features",
    });

    AnimateBlocks({
      parentID: "about",
      childElem: ".social-item",
      outPosition: -3000,
      transform: false,
    });

    AnimateBlocks({
      parentID: "skills",
    });

    AnimateBlocks({
      parentID: "skills-technologies",
      childElem: "li",
    });

    AnimateBlocks({
      parentID: "statistics",
    });

    RestructRhombuses({
      selector: ".about-socials",
      childElem: "li",
    });

    Gallery({
      name: "portfolio",
      lightBoxID: "lightbox",
      categories: [
        "graphic",
        "logo",
        "website design",
        "photography",
        "branding",
        "illustration",
        "video",
      ],
      items: [
        {
          category: 5,
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          title: "Vinyl Record",
        },
        {
          category: 2,
          description:
            "3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo 3D Wooden Logo ",
          title: "3D Wooden Logo",
        },
        {
          category: 4,
          description:
            "Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book Hard Cover Book ",
          title: "Hard Cover Book",
        },
        {
          category: 3,
          description:
            "Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 Macbook-Air600 ",
          title: "Macbook-Air600",
        },
        {
          category: 2,
          description:
            "Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping Silver Stamping ",
          title: "Silver Stamping",
        },
        {
          category: 6,
          description: "",
          title: "T-Shirt MockUp",
        },
        {
          category: 1,
          description: "",
          title: "Fashion Glasses",
        },
        {
          category: 4,
          description: "",
          title: "picjumbo",
        },
        {
          category: 2,
          description: "",
          title: "Embossed Leather",
        },
        {
          category: 3,
          description: "",
          title: "Billboard",
        },
        {
          category: 7,
          description: "",
          title: "macbook pro",
        },
        {
          category: 5,
          description: "",
          title: "Vintage Car",
        },
        {
          category: 3,
          description: "",
          title: "madebyvadim",
        },
      ],
    });

    Gallery({
      name: "blog-news",
      // lightBoxID: "lightbox",
      showCategory: true,
      showMenu: false,
      categories: ["blog", "photo", "video"],
      items: [
        {
          category: 1,
          description: "",
          title: "rubiko will take you to the next level",
        },
        { category: 2, description: "", title: "doctype hi-res" },
        { category: 1, description: "", title: "unsplash" },
        { category: 1, description: "", title: "unsplash-2" },
        {
          category: 3,
          description: "",
          title: "new york from a different view",
        },
      ],
    });

    FormValidate({
      formID: "contacts_form",
      // onlySubmitChecking: true,
    });

    ToTop({
      buttonID: "to-top",
      border: 300,
    });
  });
})();
