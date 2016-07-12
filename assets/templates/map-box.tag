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
      zoom: 17,
      // fadeAnimation: false,
      // zoomAnimation: false,
      // markerZoomAnimation: false
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
    self.pin_clickable = opts.pinClickable !== 'false';
    self.pins = _.filter(opts.pins || [], pin => {
      if (!pin.location) return false;
      return true;
    });
    // Define
    self.YPIcon = L.icon({
      iconUrl: util.site_url('/public/image/marker-m-3d.png'),
      iconSize: [36, 54],
      iconAnchor: [16, 51],
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
      self.map.setZoom(+self.map_options.zoom);

      // // Add google maps
      // var googleLayer = new L.Google('ROADMAP');
      // self.map.addLayer(googleLayer);

      // // Add nostramap
      // var NostraMap = L.tileLayer('https://map.nostramap.com/Nostramap/proxy.ashx?https://map.nostramap.com/ArcGIS/rest/services/StreetMap/MapServer/tile/{z}/{y}/{x}', {
      //   maxZoom: 19,
      //   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      // });
      // self.map.addLayer(NostraMap);

      // // Add openstreetmap
      // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      // }).addTo(self.map);

      // // https: also suppported.
      // var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //   maxZoom: 19,
      //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      // });
      // self.map.addLayer(OpenStreetMap_Mapnik);

      // var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
      //   maxZoom: 18,
      //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      // });
      // self.map.addLayer(OpenStreetMap_BlackAndWhite);

      // // https: also suppported.
      // var Stamen_Toner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
      //   attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      //   subdomains: 'abcd',
      //   minZoom: 0,
      //   maxZoom: 20,
      //   ext: 'png'
      // });
      // self.map.addLayer(Stamen_Toner);

      // // Stamen watercolor layer
      // // https: also suppported.
      // var Stamen_Watercolor = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
      //   attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      //   subdomains: 'abcd',
      //   minZoom: 1,
      //   maxZoom: 20,
      //   ext: 'png'
      // });
      // self.map.addLayer(Stamen_Watercolor);

      // // https: also suppported.
      // // http://b.tile.stamen.com/toner-hybrid/14/2621/6331.png
      // var Stamen_TonerHybrid = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}.{ext}', {
      //   attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      //   subdomains: 'abcd',
      //   minZoom: 0,
      //   maxZoom: 20,
      //   ext: 'png'
      // });
      // self.map.addLayer(Stamen_TonerHybrid);

      // // https: also suppported.
      // var Stamen_TonerLabels = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.{ext}', {
      //   attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      //   subdomains: 'abcd',
      //   minZoom: 0,
      //   maxZoom: 20,
      //   ext: 'png'
      // });
      // self.map.addLayer(Stamen_TonerLabels);

      // // mapquest open overlay
      // var MapQuestOpen_HybridOverlay = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
      //   type: 'hyb',
      //   ext: 'png',
      //   attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      //   subdomains: '1234',
      //   opacity: 0.9
      // });
      // self.map.addLayer(MapQuestOpen_HybridOverlay);

      // // CartoDB
      // var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      //   subdomains: 'abcd',
      //   maxZoom: 19
      // });
      // self.map.addLayer(CartoDB_Positron);

      // // BingMaps
      // const BING_API_KEY = app.get('service.bing.api_key');
      // var BingMaps = new L.BingLayer(BING_API_KEY, { type: 'Road' });  //The type can also be 'Aerial' or 'AerialWithLabels'
      // self.map.addLayer(BingMaps);

      // HERE Maps
      // @see https://developer.here.com/rest-apis/documentation/enterprise-map-tile/topics/resource-base-maptile.html
      // https: also suppported.
      var HERE_normalDay = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/{type}/{mapID}/{scheme}/{z}/{x}/{y}/{size}/{format}?app_id={app_id}&app_code={app_code}&lg={language}&style={style}', {
        attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
        subdomains: '1234',
        mapID: 'newest',
        app_id: app.get('service.here.app_id'),
        app_code: app.get('service.here.app_code'),
        base: 'base',
        maxZoom: 20,
        type: 'maptile',
        scheme: 'ontouchstart' in window ? 'normal.day.mobile' : 'normal.day',
        language: 'tha',// 'eng',
        style: 'default',
        format: 'png8',
        size: '256'
      });
      self.map.addLayer(HERE_normalDay);
    }

    function createMarker() {
      self.markers = _.map(self.pins, pin => {
        const marker = L.marker(pin.location, {
          icon: self.YPIcon,
          interactive: false,
          keyboard: false,
          riseOnHover: true
        });
        if (self.pin_clickable) {
          marker.bindPopup(
            '<a href="#pins/'+pin.id+'" target="_blank">'
            + '<div class="pin-image" style="background-image: url('+(_.get(pin, 'photos.0') || util.site_url("/public/image/pin_photo.png"))+');"></div>'
            + '</a>'
            + '<div>' + pin.detail + '</div>'
            + '<div><a href="#pins/'+pin.id+'" target="_blank">View Pin</a></div>'
          );
        }
        marker.addTo(self.map);
        return marker;
      });

      if (self.markers.length > 0) {
        const bounds = new L.LatLngBounds(_.map(self.pins, pin => pin.location));
        // // offset bounds to show pin card on right half
        // const ne = bounds.getNorthEast();
        // bounds.extend([ne.lat, ne.lng + 0.002]);
        self.map.fitBounds(bounds);
        self.map.setZoom(+self.map_options.zoom || 17);
      } else {
        console.log('No pins attached');
      }
    }

    function destroyMap() {
      if (self.map) {
        self.map.remove();
        delete self.map;
      }
    }
