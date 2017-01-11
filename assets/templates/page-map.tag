page-map

  #page-map

    map-box(id='map-{ id }', options-zoom='auto', options-scroll-wheel-zoom='false')

    #overlay-layer.container.no-padding-s
      //- h5.page-name(if='{ title }') { title }
      button.btn-floating.waves-effect.waves-light.white(type='button', onclick='{ setMapLocationByGeolocation }')
        i.icon.material-icons.light-blue-text gps_fixed

    #search-input-field.input-field
      form(onsubmit='{ onSubmitSearch }')
        input#search-input(type='search', placeholder='ค้นหาคำ')
        //- label(for='search-input') ค้นหา

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
    self.max_pin = 1000;
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
      self.map.setView(app.get('location.default'), 16);
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
          $sort: '-created_time',
          owner: app.get('user._id')
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

        if (self.has_more && self.pins.length < self.max_pin) {
          updateMap();
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
      self.mapbox = _.get(self['map-' + self.id], '_tag');
      self.map = _.get(self.mapbox, 'map');
    }

    self.onSubmitSearch = function(e) {
      e.preventDefault();
      e.stopPropagation();

      const $input = $(e.target).find('#search-input');
      let keyword = $input.val();

      self.choice_categories = [
        { value: 'footpath', text: 'ทางเท้า', selected: false },
        { value: 'pollution', text: 'มลภาวะ', selected: false },
        { value: 'roads', text: 'ถนน', selected: false },
        { value: 'publictransport', text: 'ขนส่งสาธารณะ', selected: false },
        { value: 'garbage', text: 'ขยะ', selected: false },
        { value: 'drainage', text: 'ระบายน้ำ', selected: false },
        { value: 'trees', text: 'ต้นไม้', selected: false },
        { value: 'safety', text: 'ความปลอดภัย', selected: false },
        { value: 'violation', text: 'ละเมิดสิทธิ', selected: false }
      ];

      const match = _.find(self.choice_categories, ['text', keyword]);
      if (match) {
        keyword = match.value;
      }

      if (self.mapbox) self.mapbox.clearMarker();
      self.pins = [];
      self.skip = 0;
      self.has_more = false;
      if (keyword) {
        self.query = {
          // tags: keyword,
          categories: keyword
        };
      } else {
        self.query = {};
      }
      loadNext();
    };
