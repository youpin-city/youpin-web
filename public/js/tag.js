'use strict';

riot.tag2('map-box', '<div class="map-box-container" id="{id}-container"> <div class="map-box-widget" id="{id}"></div> </div>', 'map-box .map-box-container,[riot-tag="map-box"] .map-box-container,[data-is="map-box"] .map-box-container{ position: relative; width: 100%; height: 400px; } map-box .map-box-container .map-box-widget,[riot-tag="map-box"] .map-box-container .map-box-widget,[data-is="map-box"] .map-box-container .map-box-widget{ position: absolute; top: 0; bottom: 0; left: 0; right: 0; } map-box .leaflet-map-pane,[riot-tag="map-box"] .leaflet-map-pane,[data-is="map-box"] .leaflet-map-pane{ z-index: 2 !important; } map-box .leaflet-google-layer,[riot-tag="map-box"] .leaflet-google-layer,[data-is="map-box"] .leaflet-google-layer{ z-index: 1 !important; }', '', function (opts) {
  var self = this;
  self.id = 'map-box-' + util.uniqueId();

  var regex_options = /^options/i;
  self.map = null;
  self.map_options = {
    zoom: 17

  };
  _.forEach(opts, function (value, key) {
    if (regex_options.test(key)) {
      var opt_key = _.camelCase(key.replace(regex_options, ''));
      if (!opt_key) return;
      if (value === 'false') self.map_options[opt_key] = false;else if (value === 'true') self.map_options[opt_key] = true;else self.map_options[opt_key] = value;
    }
  });

  self.center = app.get('location.default');
  self.markers = [];
  self.pin_clickable = opts.pinClickable !== 'false';
  self.pins = _.filter(opts.pins || [], function (pin) {
    if (!_.get(pin, 'location.coordinates')) return false;
    return true;
  });

  self.YPIcon = L.icon({
    iconUrl: util.site_url('/public/image/marker-m-3d.png'),
    iconSize: [36, 54],
    iconAnchor: [16, 51],
    popupAnchor: [0, -51]
  });

  self.on('mount', function () {
    createMap();
    createMarker();
  });
  self.on('unmount', function () {});
  self.on('update', function () {});
  self.on('updated', function () {});

  function createMap() {
    if (self.map) destroyMap();

    self.map = L.map(self.id, self.map_options);
    self.map.setView(self.center);
    self.map.setZoom(self.map_options.zoom === 'auto' ? 15 : +self.map_options.zoom);

    var HERE_normalDay = L.tileLayer('https://{s}.{base}.maps.cit.api.here.com/maptile/2.1/{type}/{mapID}/{scheme}/{z}/{x}/{y}/{size}/{format}?app_id={app_id}&app_code={app_code}&lg={language}&style={style}&ppi={ppi}', {
      attribution: 'Map &copy; 1987-2014 <a href="https://developer.here.com">HERE</a>',
      subdomains: '1234',
      mapID: 'newest',
      app_id: app.get('service.here.app_id'),
      app_code: app.get('service.here.app_code'),
      base: 'base',
      maxZoom: 20,
      type: 'maptile',
      scheme: 'ontouchstart' in window ? 'normal.day.mobile' : 'normal.day',
      language: 'tha',
      style: 'default',
      format: 'png8',
      size: '256',
      ppi: 'devicePixelRatio' in window && window.devicePixelRatio >= 2 ? '250' : '72'
    });
    self.map.addLayer(HERE_normalDay);
  }

  function getTransform(el) {
    var results = $(el).css('transform').match(/matrix(?:(3d)\(\d+(?:, \d+)*(?:, (\d+))(?:, (\d+))(?:, (\d+)), \d+\)|\(\d+(?:, \d+)*(?:, (\d+))(?:, (\d+))\))/);
    if (!results) return [0, 0, 0];
    if (results[1] == '3d') return results.slice(2, 5);
    results.push(0);
    return results.slice(5, 8);
  }

  function createMarker() {
    self.markers = _.map(self.pins, function (pin) {
      var marker = L.marker(_.get(pin, 'location.coordinates'), {
        icon: self.YPIcon,
        interactive: false,
        keyboard: false,
        riseOnHover: true
      });
      if (self.pin_clickable) {
        marker.bindPopup('<a href="#pins/' + pin._id + '" target="_blank">' + '<div class="pin-image" style="background-image: url(' + (_.get(pin, 'photos.0') || util.site_url("/public/image/pin_photo.png")) + ');"></div>' + '</a>' + '<div style="margin: 1rem 0;">' + '<strong data-url="#user/' + pin.owner + '">@' + app.get('app_user.name').toLowerCase() + '</strong> ' + pin.detail + '<a href="#pins/' + pin._id + '" target="_blank" style="margin: 0 0.4rem;">View Pin</a>' + '</div>');
      }
      marker.addTo(self.map);
      return marker;
    });

    if (self.markers.length > 0) {
      var bounds = new L.LatLngBounds(_.map(self.pins, function (pin) {
        return _.get(pin, 'location.coordinates');
      }));

      self.map.fitBounds(bounds);
      if (self.map_options.zoom !== 'auto') {
        self.map.setZoom(+self.map_options.zoom || 17);
      }
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
});

riot.tag2('page-feed', '<div id="page-feed"> <div class="container no-padding-s"> <div class="spacing"></div> <h5 class="center" if="{title}">{title}</h5> <div class="row"> <div class="col s12 m6 l4" each="{pin in pins}"> <div class="card hover-card"><a class="card-image" href="#pins/{pin._id}{pin.mock ? &quot;?mock=1&quot; : &quot;&quot;}" riot-style="background-image: url({pin.photos &amp;&amp; pin.photos.length &gt; 0 ? pin.photos[0] : util.site_url(&quot;/public/image/pin_photo.png&quot;)})"></a> <div class="card-content"> <div class="card-description"> <div class="card-author"><strong data-url="#user/{pin.owner}">@{app.get(\'app_user.name\').toLowerCase()}</strong></div> <div class="card-text" html="{util.parse_tags(pin.detail)}"></div> <div class="tag-list" if="{pin.categories &amp;&amp; pin.categories.length &gt; 0}"><a class="tag-item" each="{cat in pin.categories}" href="#tags/{cat}">{cat}</a></div> </div> <div class="card-meta"> <div class="meta meta-time right">{moment(pin.created_time).fromNow()}</div> <div class="meta meta-status left" data-status="{pin.status}">{pin.status}</div> </div> </div> </div> </div> </div> <div class="center"> <button class="btn waves-effect waves-light white light-blue-text" if="{has_more &amp;&amp; !is_loading}" type="button" onclick="{clickLoadMore}"><i class="icon material-icons light-blue-text">expand_more</i>โหลดเพิ่ม</button> <preloader class="small" if="{is_loading}"></preloader> </div> <div class="spacing-large"></div> </div> </div>', '', '', function (opts) {
  var self = this;

  self.title = opts.title;
  self.pins = opts.pins || [];
  self.has_more = false;
  self.skip = 0;
  self.limit = 30;
  self.query = opts.query || {};

  self.is_loading = false;

  self.on('mount', function () {

    loadNext();
  });
  self.on('updated', function () {

    $(self.root).find('.card-text').each(function (i, el) {
      var $text = $(el);
      $text.html($text.attr('html'));
    });
  });

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
    }).done(function (data) {
      var new_pins = data.data || [];
      self.skip += Math.min(new_pins.length, self.limit);
      self.has_more = new_pins.length >= self.limit;
      self.pins = self.pins.concat(new_pins);
    }).always(function () {
      self.is_loading = false;
      app.busy(false);
      self.update();
    });
  }

  self.clickLoadMore = function (e) {
    loadNext();
  };
});

riot.tag2('page-map', '<div id="page-map"> <map-box id="map-{id}" options-zoom="auto" options-scroll-wheel-zoom="false"></map-box> <div class="container no-padding-s" id="overlay-layer"> <button class="btn-floating waves-effect waves-light white" type="button" onclick="{setMapLocationByGeolocation}"><i class="icon material-icons light-blue-text">gps_fixed</i></button> </div> </div>', '', '', function (opts) {
  var self = this;
  self.id = 'page-map-' + util.uniqueId();

  self.title = opts.title;
  self.pins = opts.pins || [];
  self.has_more = false;
  self.skip = 0;
  self.limit = 50;
  self.query = opts.query || {};

  self.on('mount', function () {

    loadNext();
  });

  function locationError(err) {
    console.error(err.message);
    Materialize.toast('ไม่สามารถแสดงตำแหน่งปัจจุบันได้ <a href="/help" target="_blank">อ่านที่นี่เพื่อแก้ไข</a>', 5000, 'dialog-error');
    self.map.setView(app.get('location.default'), 16);
  }

  self.setMapLocationByGeolocation = function (e) {
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
    }).done(function (data) {
      var new_pins = data.data || [];
      self.skip += Math.min(new_pins.length, self.limit);
      self.has_more = new_pins.length >= self.limit;
      self.pins = self.pins.concat(new_pins);

      if (self.has_more && self.pins.length < 500) {
        loadNext();
      } else {
        updateMap();
      }
    }).always(function () {
      self.is_loading = false;
      app.busy(false);
    });
  }

  function updateMap() {
    riot.mount('#map-' + self.id, { pins: self.pins });
    self.map = _.get(self['map-' + self.id], '_tag.map');
  }
});

riot.tag2('page-pin', '<div id="page-pin"> <div class="fluid-container no-padding-s"> <div class="row"> <div class="col s12 m6 offset-m6"> <div class="spacing"></div> <div class="card"> <div class="card-image" if="{pin.photos.length === 0}" href="#pins/{pin._id}" riot-style="background-image: url({util.site_url(&quot;/public/image/pin_photo.png&quot;)})"></div> <div class="card-image responsive" if="{pin.photos.length &gt; 0}"> <div class="slider-container"> <div class="image-slider" id="photo-slider"> <div class="slider-item" each="{photo in pin.photos}"> <div class="image-item"> <div class="image" riot-style="background-image: url(&quot;{util.site_url(photo)}&quot;)"></div> </div> </div> </div> </div> </div> <div class="card-content"> <div class="pin-content"> <div class="card-description"> <div class="card-author"><strong data-url="#user/{pin.owner}">@{app.get(\'app_user.name\').toLowerCase()}</strong></div> <div class="card-text" html="{util.parse_tags(pin.detail)}"></div> <div class="tag-list" if="{pin.categories &amp;&amp; pin.categories.length &gt; 0}"><a class="tag-item" each="{cat in pin.categories}" href="#tags/{cat}">{cat}</a></div> </div> <div class="card-meta"> <div class="meta meta-time right">{moment(pin.created_time).fromNow()}</div> <div class="meta meta-status left" data-status="{pin.status}">{pin.status}</div> </div> </div> <div if="{pin.comments &amp;&amp; pin.comments.length &gt; 0}"> <div class="divider"></div> <h5 class="section-name">ความคิดเห็น</h5> <div class="comment-list"> <div class="comment-item" each="{comment in pin.comments}"> <div class="card-description"> <div class="card-author"><a href="#user/{comment.commented_by}">@{comment.commented_by}</a></div> <div class="card-text" html="{util.parse_tags(comment.detail)}"></div> </div> </div> </div> </div> </div> </div> </div> </div> </div> <div class="map-container"> <map-box pin-clickable="false" options-zoom="17" options-scroll-wheel-zoom="false" options-tap="false" options-keyboard="false"></map-box> </div> <div class="spacing-large"></div> </div>', '', '', function (opts) {
  var _this = this;

  var self = this;

  self.pin = opts;
  self.slider = false;

  self.on('mount', function () {

    riot.mount('#page-pin map-box', 'map-box', { pins: [self.pin] });
  });

  self.on('updated', function () {

    var $text = $(_this.root).find('.card-text');
    $text.html($text.attr('html'));

    createPhotoSlider();
  });

  function createPhotoSlider() {

    if (self.slider) {
      destroyPhotoSlider();
    }
    self.$slider = $(self.root).find('#photo-slider');
    self.$slider.on('init reinit', function (e) {}).on('setPosition', function (e, slick) {}).slick({
      infinite: true,
      speed: 400,
      fade: self.fade,
      autoplay: false,
      autoplaySpeed: self.autoplay_speed,

      accessibility: false,
      cssEase: 'ease-in'
    });
    self.slider = true;
  }

  function destroyPhotoSlider() {

    if (self.slider) {
      self.$slider.slick('unslick');
      self.slider = false;
    }
  }
});

riot.tag2('page-report', '<div class="modal bottom-sheet full-sheet" id="report-input-modal"> <div class="modal-header"> <nav> <ul class="left"> <li><a class="modal-action modal-close" href="#" onclick="{clickCloseReport}">ยกเลิก</a></li> </ul> <div class="center"><a class="brand-logo" href="#"></a> <div class="modal-title">ใส่ข้อมูลพิน</div> </div> <ul class="right"></ul> </nav> </div> <div class="modal-content no-padding-s"> <div class="container no-padding-s"> <div class="row"> <div class="col s12 m6 offset-m3 l4 offset-l4"> <form id="report-form"> <input type="hidden" name="location[coordinates][]:number" value="{location.lat}"> <input type="hidden" name="location[coordinates][]:number" value="{location.lng}"> <input type="hidden" name="location[type][]:string" value="Point"> <input each="{photo in photos}" type="hidden" name="photos[]" value="{photo.url}"> <input type="hidden" name="status" value="{status}"> <input type="hidden" name="owner" value="{owner}"> <input each="{provider in providers}" type="hidden" name="provider[]" value="{provider}"> <input type="hidden" name="level" value="normal"> <input type="hidden" name="neighborhood" value="{neighborhood}"> <div class="card"> <div class="card-image" if="{photos.length === 0}" href="#report" riot-style="background-image: url({util.site_url(&quot;/public/image/pin_photo_upload.png&quot;)})"> <button class="btn-floating btn-large waves-effect waves-light white" id="add-first-image-btn" type="button" onclick="{clickPhoto}"><i class="icon material-icons large light-blue-text">add</i></button> </div> <div class="card-image responsive" if="{photos.length &gt; 0}"> <div class="slider-container"> <div class="image-slider" id="photo-slider"> <div class="slider-item" each="{photo, i in photos}" data-i="{i}"> <div class="image-item" data-i="{i}" href="#!"> <div class="image" riot-style="background-image: url(&quot;{util.site_url(photo.url)}&quot;)"></div> </div> </div> </div> </div><a class="btn-floating btn-large waves-effect waves-light" id="add-image-btn" href="#report" onclick="{clickPhoto}"><i class="icon material-icons">add</i></a> </div> <div class="input-field" id="input-detail"> <textarea class="validate materialize-textarea" name="detail" placeholder="ใส่คำอธิบายปัญหาหรือข้อเสนอแนะ" oninput="{changeDetail}">{detail}</textarea> </div> <div class="card-content"> <div class="input-field" id="input-categories"><i class="icon material-icons prefix">local_offer</i> <select id="select-categories" name="categories" onchange="{changeCategories}"> <option value="">เลือกหมวดหมู่</option> <option each="{cat in choice_categories}" value="{cat.value}" __selected="{cat.selected}">{cat.text}</option> </select> </div> <div class="input-field" id="input-location" if="{!location}"><i class="icon material-icons prefix {location.lat ? &quot;active&quot; : &quot;&quot;}">place</i><a class="location-input input" href="#" onclick="{clickMapLocation}">{location_text}<i class="icon material-icons green-text small" if="{location}" style="vertical-align: top">check</i></a></div> </div> <div id="input-location-complete" if="{location}"> <map-box id="input-location-map" pin-clickable="false" options-dragging="false" options-zoom="17" options-zoom-control="false" options-scroll-wheel-zoom="false" options-double-click-zoom="false" options-touch-zoom="false" options-tap="false" options-keyboard="false"></map-box> <button class="btn-floating btn-large waves-effect waves-light white" id="edit-location-btn" type="button" onclick="{clickMapLocation}"><i class="icon material-icons large light-blue-text">edit</i></button> </div> </div> </form> </div> </div> </div> <div class="container no-padding-s"> <div class="row"> <div class="col s12 m6 offset-m3 l4 offset-l4"> <button class="btn btn-large btn-block {is_pin_complete ? &quot;&quot; : &quot;disabled&quot;}" id="submit-pin-btn" type="button" onclick="{clickSubmitReport}" __disabled="{!is_pin_complete}">โพสต์พิน</button> </div> </div> </div> </div> </div> <div class="modal bottom-sheet full-sheet" id="report-photo-modal"> <div class="modal-header"> <nav> <ul class="left"> <li><a class="modal-action modal-close" href="#report" onclick="{clickClosePhoto}">กลับ</a></li> </ul> <div class="center"><a class="brand-logo" href="#"></a> <div class="modal-title">เลือกภาพถ่าย</div> </div> <ul class="right"></ul> </nav> </div> <div class="modal-content no-padding-s"> <div class="container no-padding-s"> <div class="row card-list"> <div class="col s12 m6 offset-m3 l4 offset-l4" each="{photo, i in photos}"> <div class="card" data-i="{i}"> <div class="card-image responsive"><img riot-src="{util.site_url(photo.url)}"></div> </div> </div> <div class="col s12 m6 offset-m3 l4 offset-l4"> <div class="spacing"></div> <div class="drop-image-preview hide"></div> <div class="card-title center drop-image" name="dropzone-el"><i class="icon material-icons">photo_camera</i>เพิ่มรูป</div> </div> </div> </div> </div> </div> <div class="modal bottom-sheet full-sheet" id="report-map-modal"> <div class="modal-header"> <nav> <ul class="left"> <li><a class="modal-action modal-close" href="#report" onclick="{clickCloseMap}">กลับ</a></li> </ul> <div class="center"><a class="brand-logo" href="#"></a> <div class="modal-title">ตำแหน่งพิน</div> </div> <ul class="right"> <li><a href="#!" onclick="{clickLocateMe}"><i class="icon material-icons">gps_fixed</i></a></li> </ul> </nav> </div> <div class="modal-content no-padding-s"> <div class="input-location-map" id="edit-location-map"></div><a class="btn btn-large btn-block modal-close" id="submit-location-btn" onclick="{clickCloseMap}">ใช้ตำแหน่งนี้</a> </div> </div> <div class="modal" id="report-uploading-modal"> <div class="modal-content"> <div class="progress"> <div class="indeterminate"></div> </div> <h4 class="center">กำลังอัพโหลด</h4> </div> </div> <div class="modal" id="report-saving-modal"> <div class="modal-content"> <div class="progress"> <div class="indeterminate"></div> </div> <h4 class="center">กำลังพิน</h4> </div> </div>', 'page-report .input-location-map,[riot-tag="page-report"] .input-location-map,[data-is="page-report"] .input-location-map{ position: absolute; top: 0; bottom: 0; left: 0; right: 0; } page-report .leaflet-map-pane,[riot-tag="page-report"] .leaflet-map-pane,[data-is="page-report"] .leaflet-map-pane{ z-index: 2 !important; } page-report .leaflet-google-layer,[riot-tag="page-report"] .leaflet-google-layer,[data-is="page-report"] .leaflet-google-layer{ z-index: 1 !important; }', '', function (opts) {
  var self = this;

  self.dropzone = null;
  self.slider = false;
  self.is_pin_complete = false;
  self.redirect = '';

  self.detail = '';
  self.categories = '';
  self.photos = [];
  self.target = opts.target;
  self.map = null;
  self.map_id = 'edit-location-map';
  self.location = null;
  self.default_status = 'verified';
  self.status = self.default_status;
  self.neighborhood = '';
  self.owner = app.get('app_user._id');
  self.providers = [app.get('app_user._id')];

  self.YPIcon = L.icon({
    iconUrl: util.site_url('/public/image/marker-m.png'),
    iconSize: [32, 51],
    iconAnchor: [16, 48],
    popupAnchor: [0, -51]
  });

  self.choice_categories = [{ value: 'footpath', text: 'ทางเท้า', selected: false }, { value: 'pollution', text: 'มลภาวะ', selected: false }, { value: 'roads', text: 'ถนน', selected: false }, { value: 'publictransport', text: 'ขนส่งสาธารณะ', selected: false }, { value: 'garbage', text: 'ขยะ', selected: false }, { value: 'drainage', text: 'ระบายน้ำ', selected: false }, { value: 'trees', text: 'ต้นไม้', selected: false }, { value: 'safety', text: 'ความปลอดภัย', selected: false }, { value: 'violation', text: 'ละเมิดสิทธิ', selected: false }];

  self.on('update', function () {
    self.location_text = self.location && typeof self.location.lat === 'number' ? 'ปักตำแหน่งแล้ว' : 'ใส่ตำแหน่ง';
    checkReportComplete();
  });
  self.on('mount', function () {});
  self.on('unmount', function () {});
  self.on('updated', function () {
    initDropzone();
    initMap();

    $('#select-categories').material_select('destroy');
    $('#select-categories').material_select();
  });

  function resetReportModal() {
    destroyMap();
    destroyPhotoSlider();

    self.target = opts.target;

    self.detail = '';
    self.categories = '';
    self.status = self.default_status;
    self.photos = [];
    self.map = null;
    self.location = null;
    $(self.root).find('textarea[name="detail"]').val('');
    $(self.root).find('select[name="categories"]').val('');
    self.update();
  }

  function to_decimal($deg, $min, $sec, $hem) {
    var $d = $deg + ($min / 60 + $sec / 3600);
    return $d * ($hem == 'S' || $hem == 'W' ? -1 : 1);
  }

  function base64ToFile(dataURI, origFile) {
    var byteString = void 0;
    if (dataURI.split(',')[0].indexOf('base64') !== -1) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = decodeURI(dataURI.split(',')[1]);
    }
    var mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var content = [];
    for (var i = 0; i < byteString.length; i++) {
      content[i] = byteString.charCodeAt(i);
    }
    var new_file = new Blob([new Uint8Array(content)], { type: 'image/png' });

    var origProps = ['upload', 'status', 'previewElement', 'previewTemplate', 'accepted'];
    $.each(origProps, function (i, p) {
      new_file[p] = origFile[p];
    });
    return new_file;
  }

  function initDropzone() {
    if (!self.dropzone) {
      self.dropzone = new Dropzone(self['dropzone-el'], {
        url: util.site_url('/api/image'),
        method: 'POST',
        acceptedFiles: 'image/*',
        paramName: 'image',
        maxFilesize: 5,
        previewsContainer: '.drop-image-preview',
        previewTemplate: '<div class="dz-preview-template" style="display: none;"></div>',
        dictDefaultMessage: '',
        clickable: _.filter([$(self.target)[0], self['dropzone-el'], self['add-first-image-btn']]),
        uploadMultiple: true,
        autoQueue: false,
        fallback: function fallback() {
          $(self.root).find('.dropzone').hide();
          $(self.root).find('.dropzone-error').show();
        }
      });
      self.dropzone.on('addedfile', function (origFile) {
        var MAX_WIDTH = 800;
        var MAX_HEIGHT = 800;
        var dropzone = self.dropzone;
        var reader = new FileReader();

        reader.addEventListener('load', function (event) {
          var orig_img = new Image();
          orig_img.src = event.target.result;
          orig_img.addEventListener('load', function (event) {
            var width = event.target.width;
            var height = event.target.height;

            if (width <= MAX_WIDTH && height <= MAX_HEIGHT) {
              dropzone.enqueueFile(origFile);
              return;
            }

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            EXIF.getData(origFile, function () {
              var exifdata = this.exifdata;
              var orientation = exifdata.Orientation || false;
              var gps_location = null;
              if (exifdata.GPSLatitude && exifdata.GPSLongitude) {
                var lat = to_decimal(_.get(exifdata, 'GPSLatitude.0', 0), _.get(exifdata, 'GPSLatitude.1', 0), _.get(exifdata, 'GPSLatitude.2', 0), _.get(exifdata, 'GPSLatitudeRef', 'N'));
                var lng = to_decimal(_.get(exifdata, 'GPSLongitude.0', 0), _.get(exifdata, 'GPSLongitude.1', 0), _.get(exifdata, 'GPSLongitude.2', 0), _.get(exifdata, 'GPSLongitudeRef', 'N'));
                gps_location = [lat, lng];
              }

              var canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;

              var ctx = canvas.getContext('2d');
              ctx.save();

              if (orientation) {
                if (orientation > 4) {
                  canvas.width = height;
                  canvas.height = width;
                }
                switch (orientation) {
                  case 2:
                    ctx.translate(width, 0);ctx.scale(-1, 1);break;
                  case 3:
                    ctx.translate(width, height);ctx.rotate(Math.PI);break;
                  case 4:
                    ctx.translate(0, height);ctx.scale(1, -1);break;
                  case 5:
                    ctx.rotate(0.5 * Math.PI);ctx.scale(1, -1);break;
                  case 6:
                    ctx.rotate(0.5 * Math.PI);ctx.translate(0, -height);break;
                  case 7:
                    ctx.rotate(0.5 * Math.PI);ctx.translate(width, -height);ctx.scale(-1, 1);break;
                  case 8:
                    ctx.rotate(-0.5 * Math.PI);ctx.translate(-width, 0);break;
                }
              }

              ctx.drawImage(orig_img, 0, 0, width, height);
              ctx.restore();

              if (gps_location) {
                if (!self.location) {
                  setLocation(gps_location);
                }
              }

              var resized_file = base64ToFile(canvas.toDataURL('image/jpeg'), origFile);

              var orig_file_index = dropzone.files.indexOf(origFile);
              dropzone.files[orig_file_index] = resized_file;

              dropzone.enqueueFile(resized_file);
            });
          });
        });

        reader.readAsDataURL(origFile);
      }).on('sendingmultiple', function (file, xhr, form_data) {
        uploadPhotoList();
      }).on('successmultiple', function (files, results) {
        for (var i = 0; i < files.length; i++) {
          var photo = results[i];
          _.assignIn(photo, {
            width: files[i].width,
            height: files[i].height
          });
          self.photos.push(photo);
        };
        $('#report-uploading-modal').closeModal();
        showReportView();
      }).on('errormultiple', function (files, reason) {
        console.error('error:', arguments);
        Materialize.toast('ไม่สามารถอัพโหลดรูปได้ (' + reason + ')', 5000, 'dialog-error');
        $('#report-uploading-modal').closeModal();
      }).on('completemultiple', function (files) {});
    }
  }

  function uploadPhotoList() {
    $('#report-uploading-modal').openModal({
      dismissible: false
    });
  }

  function showReportView() {
    self.redirect = app.current_hash || '#feed';
    if (self.redirect === '#report') self.redirect = '#feed';
    app.goto('report');
    var $input_modal = $(self['report-input-modal']);
    var $photo_modal = $(self['report-photo-modal']);
    if ($input_modal.hasClass('open')) {

      if (self.photos.length <= 1) {

        $photo_modal.find('.modal-close').click();
      }
    } else {
      $input_modal.openModal({
        ready: function ready() {},
        complete: function complete() {
          resetReportModal();
          closeReportView();

          app.goto(self.redirect.slice(1));
        }
      });
    }
    self.update();
    createPhotoSlider();
  }
  self.showReportView = showReportView;

  self.changeDetail = function (e) {
    self.detail = e.currentTarget.value;
    self.update();
  };

  self.changeCategories = function (e) {
    self.categories = e.currentTarget.value;
    self.update();
  };

  function checkReportComplete() {
    self.is_pin_complete = true;
    if (!self.location) self.is_pin_complete = false;
    if (!self.detail) self.is_pin_complete = false;
    if (!self.categories) self.is_pin_complete = false;
    if (self.photos.length === 0) self.is_pin_complete = false;
  }

  function createPhotoSlider() {

    if (self.slider) {
      destroyPhotoSlider();
    }
    self.$slider = $(self.root).find('#photo-slider');
    self.$slider.on('init reinit', function (e) {}).on('setPosition', function (e, slick) {}).slick({
      infinite: true,
      speed: 400,
      fade: self.fade,
      autoplay: false,
      autoplaySpeed: self.autoplay_speed,

      accessibility: false,
      cssEase: 'ease-in'
    });
    self.slider = true;
  }

  function destroyPhotoSlider() {

    if (self.slider) {
      self.$slider.slick('unslick');
      self.slider = false;
    }
  }

  function initMap() {
    if (self.map) return;
    if (!self.location) return;

    self.map = L.map(self.map_id);

    var HERE_normalDay = L.tileLayer('https://{s}.{base}.maps.cit.api.here.com/maptile/2.1/{type}/{mapID}/{scheme}/{z}/{x}/{y}/{size}/{format}?app_id={app_id}&app_code={app_code}&lg={language}&style={style}', {
      attribution: 'Map &copy; 1987-2014 <a href="https://developer.here.com">HERE</a>',
      subdomains: '1234',
      mapID: 'newest',
      app_id: app.get('service.here.app_id'),
      app_code: app.get('service.here.app_code'),
      base: 'base',
      maxZoom: 20,
      type: 'maptile',
      scheme: 'ontouchstart' in window ? 'normal.day.mobile' : 'normal.day',
      language: 'tha',
      style: 'default',
      format: 'png8',
      size: '256'
    });
    self.map.addLayer(HERE_normalDay);
    self.map_marker = L.marker(app.get('location.default'), { icon: self.YPIcon }).addTo(self.map);

    updateMarkerLocation(self.location, { zoom: true });

    self.map.on('move', _.throttle(function () {
      updateMarkerLocation(self.map.getCenter());
    }, 100));
    self.map.on('moveend zoomend resize', function (e) {
      updateMarkerLocation(self.map.getCenter());
    });
  }

  function destroyMap() {
    if (self.map) {
      self.map.remove();
      delete self.map;
    }
  }

  function setMapLocationByGeolocation() {
    if (!self.map) return false;
    self.map.locate({
      setView: true,
      maxZoom: 16,
      enableHighAccuracy: true
    });

    self.map.on('locationfound', function (e) {
      updateMarkerLocation(self.map.getCenter(), { zoom: 15 });
    });
    self.map.on('locationerror', function (err) {
      console.error(err.message);
      Materialize.toast('ไม่สามารถแสดงตำแหน่งปัจจุบันได้ <a href="/help" target="_blank">อ่านที่นี่เพื่อแก้ไข</a>', 5000, 'dialog-error');
      self.map.setView(app.get('location.default'), 16);
    });
    return true;
  }

  function setLocation(latlng) {
    updateMarkerLocation(latlng, { zoom: 16 });
    self.location = latlng;
    self.update();

    riot.mount('#input-location-map', { pins: [{ location: {
          coordinates: self.location,
          type: 'Point'
        } }] });
  }

  function updateMarkerLocation(latlng) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (!self.map || !self.map_marker) return false;
    self.map_marker.setLatLng(latlng);

    if (options.zoom) {
      var bounds = new L.LatLngBounds([latlng]);
      self.map.fitBounds(bounds);
      if (typeof options.zoom === 'number') {
        self.map.setZoom(options.zoom);
      }
    }
    return true;
  }

  function updateMap() {
    _.forEach([self].concat($(self.root).find('map-box').map(function () {
      var el = this;
      return el._tag;
    }).toArray()), function (tag) {
      if (tag.map) {
        tag.map.invalidateSize();
      }
    });
  }

  function openPhoto(e) {
    $('#report-input-modal').addClass('inactive');
    $('#report-photo-modal').openModal({
      ready: function ready() {},
      complete: function complete() {
        createPhotoSlider();
        updateMap();
      }
    });
  }

  function submitReport() {
    $('#report-saving-modal').openModal({
      dismissible: false
    });

    var form_data = $('#report-form').serializeJSON();
    form_data.categories = _.map(form_data.categories && typeof form_data.categories === 'string' ? form_data.categories.split(',') : [], function (cat) {
      return _.trim(cat);
    });
    form_data.tags = util.extract_tags(form_data.detail);

    form_data.tags = form_data.tags.concat(form_data.categories);
    form_data.created_time = Date.now();
    form_data.updated_time = form_data.created_time;

    $.ajax({
      url: util.site_url('/pins', app.get('service.api.url')),
      method: 'post',
      headers: {
        'Authorization': 'Bearer ' + app.get('app_token')
      },
      beforeSend: function beforeSend(xhrObj) {
        xhrObj.setRequestHeader('Content-Type', 'application/json');
        xhrObj.setRequestHeader('Accept', 'application/json');
      },
      dataType: 'json',
      data: JSON.stringify(form_data)
    }).done(function (data) {
      resetReportModal();
      closeReportView();
      app.goto('pins/' + data._id);
    }).fail(function (error) {
      console.error('error:', error);
      Materialize.toast('ไม่สามารถพินปัญหาได้ (' + error + ')', 5000, 'dialog-error');
    });
  }

  function closeReportView() {
    $('#report-saving-modal').closeModal();
    $('#report-input-modal').closeModal();
    $('#report-input-modal').removeClass('inactive');
  }

  self.clickPhoto = function (e) {
    e.preventDefault();
    e.stopPropagation();
    openPhoto();
  };

  self.changePhotoText = function (e) {
    var i = +$(e.target).attr('data-i');
    self.photos[i].text = e.value;
  };

  self.clickMapLocation = function (e) {
    e.preventDefault();
    e.stopPropagation();
    openMapLocation();
  };

  function openMapLocation() {
    $('#report-input-modal').addClass('inactive');
    $('#report-map-modal').openModal({
      ready: function ready() {
        if (self.map) {
          updateMap();
        }
      },
      complete: function complete() {
        if (self.location) {
          updateMap();
        }
      }
    });
  }

  self.clickLocateMe = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setMapLocationByGeolocation();
  };

  self.clickSubmitReport = function (e) {
    e.preventDefault();
    e.stopPropagation();
    submitReport();
  };

  self.clickClosePhoto = function (e) {
    $('#report-input-modal').removeClass('inactive');
  };

  self.clickCloseMap = function (e) {
    setLocation(self.map.getCenter());
    $('#report-input-modal').removeClass('inactive');
  };

  self.clickCloseReport = function (e) {
    e.preventDefault();
    e.stopPropagation();

    resetReportModal();
    closeReportView();

    app.goto(self.redirect);
  };
});

riot.tag2('preloader', '<div class="preloader-wrapper active {class}"> <div class="spinner-layer spinner-blue-only"> <div class="circle-clipper left"> <div class="circle"></div> </div> <div class="gap-patch"> <div class="circle"></div> </div> <div class="circle-clipper right"> <div class="circle"></div> </div> </div> </div>', '', '', function (opts) {
  var self = this;
  self.class = opts.class;
});
