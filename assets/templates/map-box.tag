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
    self.map = null;
    self.map_options = {
      zoomControl: opts.zoom !== 'false'
    };
    self.location = null;
    // Define
    self.DEFAULT_LOCATION = { lat: 13.7302295, lng: 100.5724075 };
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
      self.map.locate({ setView: true, maxZoom: 16 });
      self.map.on('locationfound', e => {
        updateMarkerLocation(self.map.getCenter());
      });
      self.map.on('locationerror', err => {
        console.error(err.message);
        self.map.setView(_.values(self.DEFAULT_LOCATION), 16);
      });

      // Add google maps
      var googleLayer = new L.Google('ROADMAP');
      self.map.addLayer(googleLayer);

      self.map_marker = L.marker([self.DEFAULT_LOCATION.lat, self.DEFAULT_LOCATION.lng], { icon: self.YPIcon })
        .bindPopup('ที่นี่มีหลุมบ่อ น้ำท่วมขังบ่อย ส่งกลิ่นเหม็นทุกเย็นเลย')
        .addTo(self.map);
      //- self.map.addLayer(cities);

      self.map.on('drag', _.throttle(() => {
        updateMarkerLocation(self.map.getCenter());
      }, 100));
      self.map.on('dragend', e => {
        updateMarkerLocation(self.map.getCenter());
      });
    }

    function destroyMap() {
      if (self.map) {
        self.map.remove();
        delete self.map;
      }
    }
