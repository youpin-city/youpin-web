page-map

  #page-map

    map-box(id='map-{ id }', options-zoom='15', options-scroll-wheel-zoom='false')

    #overlay-layer.container.no-padding-s
      //- h5.page-name(if='{ title }') { title }
      button.btn-floating.waves-effect.waves-light.white(type='button', onclick='{ setMapLocationByGeolocation }')
        i.icon.material-icons.light-blue-text gps_fixed

  script.
    const self = this;
    self.id = 'page-map-' + util.uniqueId();
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
      riot.mount('#map-' + self.id, { pins: self.pins });
      self.map = _.get(self['map-' + self.id], '_tag.map');
    });

    /***************
     * ACTION
     ***************/
    self.setMapLocationByGeolocation = function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (self.map) {
        self.map.locate({ setView: true, maxZoom: 16 });
      }
    };
