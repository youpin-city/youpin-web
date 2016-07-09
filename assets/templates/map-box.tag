map-box
  .map-box-container(id='{ id }-container')
    .map-box-widget(id='{ id }')

  style(type='scss', scoped).
    :scope {
      .map-box-container {
        position: relative;
        width: 100%;
        height: 400px;
        .map-box-widget {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }
      }
    }

    .leaflet-map-pane {
      z-index: 2 !important;
    }

    .leaflet-google-layer {
      z-index: 1 !important;
    }

  script.
    const self = this;
    self.id = 'map-box-' + util.uniqueId();
    /***************
     * DEFAULT
     ***************/
    const regex_options = /^options/i;
    self.map = null;
    self.map_options = {
      zoom: 16,
      fadeAnimation: false,
      zoomAnimation: false,
      markerZoomAnimation: false
    };
    _.forEach(opts, (value, key) => {
      if (regex_options.test(key)) {
        const opt_key = _.camelCase(key.replace(regex_options, ''));
        if (!opt_key) return;
        if (value === 'false') self.map_options[opt_key] = false;
        else if (value === 'true') self.map_options[opt_key] = true;
        else self.map_options[opt_key] = value;
      }
    });

    self.center = { lat: 13.7304311, lng: 100.5696901 };
    self.markers = [];
    self.markers_center = opts.markers_center || [];
    // Define
    self.YPIcon = L.icon({
        iconUrl: util.site_url('/public/image/marker-m.png'),
        iconSize: [32, 51],
        iconAnchor: [16, 48],
        popupAnchor: [0, -51]
    });
    /***************
     * CHANGE
     ***************/

    /***************
     * RENDER
     ***************/
    self.on('mount', () => {
      createMap();
      createMarker();
    });
    self.on('unmount', () => {});
    self.on('update', () => {});
    self.on('updated', () => {});

    /***************
     * ACTION
     ***************/
    function createMap() {
      if (self.map) destroyMap();

      self.map = L.map(self.id, self.map_options);
      self.map.setView(self.center);
      self.map.setZoom(+self.map_options.zoom || 17);
      // Add google maps
      var googleLayer = new L.Google('ROADMAP');
      self.map.addLayer(googleLayer);
    }

    function createMarker() {
      self.markers = _.map(self.markers_center, center => {
        return L.marker(center, {
            icon: self.YPIcon,
            interactive: false,
            keyboard: false,
            riseOnHover: true
          })
          .addTo(self.map);
      });

      const bounds = new L.LatLngBounds(self.markers_center);
      // offset bounds to show pin card on right half
      const ne = bounds.getNorthEast();
      bounds.extend([ne.lat, ne.lng + 0.002]);
      self.map.fitBounds(bounds);
    }

    function destroyMap() {
      if (self.map) {
        self.map.remove();
        delete self.map;
      }
    }
