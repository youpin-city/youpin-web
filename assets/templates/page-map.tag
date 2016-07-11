page-map

  #page-map

    map-box(options-zoom='15', options-scroll-wheel-zoom='false')

    #overlay-layer.container.no-padding-s
      h5.page-name(if='{ title }') { title }

  script.
    const self = this;
    /***************
     * DEFAULT
     ***************/
    self.title = opts.title;
    self.pins = opts.pins || [];

    /***************
     * CHANGE
     ***************/


    /***************
     * RENDER
     ***************/
    self.on('mount', () => {
      // console.log('mount:', self.opts);
      riot.mount('map-box', { pins: self.pins });
    });

    /***************
     * ACTION
     ***************/
