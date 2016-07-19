page-map

  #page-map

    map-box(id='map-{ id }', options-zoom='auto', options-scroll-wheel-zoom='false')

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
    self.has_more = false;
    self.skip = 0;
    self.limit = 50;
    self.query = opts.query || {};

    /***************
     * CHANGE
     ***************/


    /***************
     * RENDER
     ***************/
    self.on('mount', () => {
      // console.log('mount:', self.opts);
      loadNext();
    });

    /***************
     * ACTION
     ***************/

    function locationError(err) {
      console.error(err.message);
      Materialize.toast('ไม่สามารถแสดงตำแหน่งปัจจุบันได้ <a href="/help" target="_blank">อ่านที่นี่เพื่อแก้ไข</a>', 5000, 'dialog-error');
      self.map.setView([13.756727, 100.5018549], 16);
    }

    self.setMapLocationByGeolocation = function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (!self.map) return;
      self.map.locate({
        setView: true,
        maxZoom: 16,
        enableHighAccuracy: true
      });
      self.map.off('locationerror', locationError);
      self.map.on('locationerror', locationError);
    };

    function loadNext() {
      app.busy();
      self.is_loading = true;
      $.ajax({
        url: util.site_url('/pins', app.get('service.api.url')),
        data: _.assign({
          $sort: '-created_time'
        }, self.query, {
          $skip: self.skip,
          $limit: self.limit
        })
      })
      .done(function(data) {
        var new_pins = data.data || [];
        self.skip += Math.min(new_pins.length, self.limit);
        self.has_more = new_pins.length >= self.limit;
        self.pins = self.pins.concat(new_pins);

        if (self.has_more && self.pins.length < 500) {
          loadNext();
        } else {
          updateMap();
        }
      })
      .always(function() {
        self.is_loading = false;
        app.busy(false);
      });
    }

    function updateMap() {
      riot.mount('#map-' + self.id, { pins: self.pins });
      self.map = _.get(self['map-' + self.id], '_tag.map');
    }
