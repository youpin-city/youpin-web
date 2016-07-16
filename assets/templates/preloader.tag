preloader
  .preloader-wrapper.active(class='{ class }')
    .spinner-layer.spinner-blue-only
      .circle-clipper.left
        .circle
      .gap-patch
        .circle
      .circle-clipper.right
        .circle

  script.
    const self = this;
    self.class = opts.class;
