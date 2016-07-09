'use strict';

riot.tag2('map-box', '<div class="map-box-container" id="{id}-container"> <div class="map-box-widget" id="{id}"></div> </div>', 'map-box .map-box-container,[riot-tag="map-box"] .map-box-container,[data-is="map-box"] .map-box-container{ position: relative; width: 100%; height: 400px; } map-box .map-box-container .map-box-widget,[riot-tag="map-box"] .map-box-container .map-box-widget,[data-is="map-box"] .map-box-container .map-box-widget{ position: absolute; top: 0; bottom: 0; left: 0; right: 0; } map-box .leaflet-map-pane,[riot-tag="map-box"] .leaflet-map-pane,[data-is="map-box"] .leaflet-map-pane{ z-index: 2 !important; } map-box .leaflet-google-layer,[riot-tag="map-box"] .leaflet-google-layer,[data-is="map-box"] .leaflet-google-layer{ z-index: 1 !important; }', '', function (opts) {
  var self = this;
  self.id = 'map-box-' + util.uniqueId();

  var regex_options = /^options/i;
  self.map = null;
  self.map_options = {
    zoom: 16,
    fadeAnimation: false,
    zoomAnimation: false,
    markerZoomAnimation: false
  };
  _.forEach(opts, function (value, key) {
    if (regex_options.test(key)) {
      var opt_key = _.camelCase(key.replace(regex_options, ''));
      if (!opt_key) return;
      if (value === 'false') self.map_options[opt_key] = false;else if (value === 'true') self.map_options[opt_key] = true;else self.map_options[opt_key] = value;
    }
  });

  self.center = { lat: 13.7304311, lng: 100.5696901 };
  self.markers = [];
  self.markers_center = opts.markers_center || [];

  self.YPIcon = L.icon({
    iconUrl: util.site_url('/public/image/marker-m.png'),
    iconSize: [32, 51],
    iconAnchor: [16, 48],
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
    self.map.setZoom(+self.map_options.zoom || 17);

    var googleLayer = new L.Google('ROADMAP');
    self.map.addLayer(googleLayer);
  }

  function createMarker() {
    self.markers = _.map(self.markers_center, function (center) {
      return L.marker(center, {
        icon: self.YPIcon,
        interactive: false,
        keyboard: false,
        riseOnHover: true
      }).addTo(self.map);
    });

    var bounds = new L.LatLngBounds(self.markers_center);

    self.map.fitBounds(bounds);
  }

  function destroyMap() {
    if (self.map) {
      self.map.remove();
      delete self.map;
    }
  }
});

riot.tag2('page-feed', '<div id="page-feed"> <div class="container no-padding-s"> <h4 class="center" if="{title}">{title}</h4> <div class="row"> <div class="col s12 m6 l4" each="{pin in pins}"> <div class="card hover-card"><a class="card-image" href="#pins/{pin.id}{pin.mock ? &quot;?mock=1&quot; : &quot;&quot;}" riot-style="background-image: url({pin.photos &amp;&amp; pin.photos.length &gt; 0 ? pin.photos[0] : util.site_url(&quot;/public/image/pin_photo.png&quot;)})"></a> <div class="card-content"> <div class="card-description"> <div class="card-author"><a href="#user/{pin.owner}">@{pin.owner}</a></div> <div class="card-text">{pin.detail}</div> <div class="tag-list" if="{pin.tags &amp;&amp; pin.tags.length &gt; 0}"><a class="tag-item" each="{tag in pin.tags}" href="#tag/{tag}">{tag}</a></div> <div class="card-area" if="{pin.neighborhood}">ย่าน{pin.neighborhood}</div> </div> <div class="card-stat"> <div class="meta meta-like left">เห็นด้วย {pin.voters.length} คน</div> <div class="meta meta-comment left"><i class="icon material-icons tiny">chat_bubble_outline</i>ความเห็น {pin.comments.length}</div> </div> <div class="card-meta"> <div class="meta meta-time right">{moment(pin.created_time, [\'x\', \'M/D/YYYY, h:mm A\']).fromNow()}</div> <div class="meta meta-status left" data-status="{pin.status}">{pin.status}</div> </div> </div> </div> </div> </div> </div> </div>', '', '', function (opts) {
  var self = this;

  self.title = opts.title;
  self.pins = opts.pins || [];

  self.on('mount', function () {});
});

riot.tag2('page-pin', '<div id="page-pin"> <div class="map-container"> <map-box options-scroll-wheel-zoom="false" options-tap="false" options-keyboard="false"></map-box> </div> <div class="fluid-container no-padding-s"> <div class="row"> <div class="col s12 m6 offset-m6"> <div class="spacing"></div> <div class="card"> <div class="card-image responsive"> <div class="slider-container"> <div class="image-slider" id="photo-slider"> <div class="slider-item" each="{photo in pin.photos}"> <div class="image-item"> <div class="image" riot-style="background-image: url(&quot;{util.site_url(photo)}&quot;)"></div> </div> </div> </div> </div> </div> <div class="card-content"> <div class="pin-content"> <div class="card-description"> <div class="card-author"><a href="#user/{pin.owner}">@{pin.owner}</a></div> <div class="card-text">{pin.detail}</div> <div class="tag-list" if="{pin.tags &amp;&amp; pin.tags.length &gt; 0}"><a class="tag-item" each="{tag in pin.tags}" href="#tag/{tag}">{tag}</a></div> <div class="card-area" if="{pin.neighborhood}">ย่าน{pin.neighborhood}</div> </div> <div class="card-stat"> <div class="meta meta-like left">เห็นด้วย {pin.voters.length} คน</div> <div class="meta meta-comment left"><i class="icon material-icons tiny">chat_bubble_outline</i>ความเห็น {pin.comments.length}</div> </div> <div class="card-meta"> <div class="meta meta-time right">{moment(pin.created_time, [\'x\', \'M/D/YYYY, h:mm A\']).fromNow()}</div> <div class="meta meta-status left" data-status="{pin.status}">{pin.status}</div> </div> </div> <div if="{pin.comments &amp;&amp; pin.comments.length &gt; 0}"> <div class="divider"></div> <h5 class="section-name">ความคิดเห็น</h5> <div class="comment-list"> <div class="comment-item" each="{comment in pin.comments}"> <div class="card-description"> <div class="card-author"><a href="#user/{comment.commented_by}">@{comment.commented_by}</a></div> <div class="card-text">{comment.detail}</div> <div class="tag-list" if="{comment.tags &amp;&amp; comment.tags.length &gt; 0}"><a class="tag-item" each="{tag in comment.tags}" href="#tag/{tag}">{tag}</a></div> </div> <div class="card-stat"> <div class="meta meta-like left"><i class="icon material-icons tiny">person</i>{comment.voter.length} คน</div> </div> </div> </div> </div> </div> </div> </div> </div> </div> <div class="spacing-large"></div> </div>', '', '', function (opts) {
  var self = this;

  self.pin = opts;
  self.slider = false;

  self.on('mount', function () {

    riot.mount('#page-pin map-box', 'map-box', { markers_center: [self.pin.location] });
  });

  self.on('updated', function () {
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

riot.tag2('page-report', '<div class="modal bottom-sheet full-sheet" id="report-input-modal"> <div class="modal-header"> <nav> <ul class="left"> <li><a class="modal-action modal-close" href="#!">ยกเลิก</a></li> </ul> <div class="center"><a class="brand-logo" href="#"></a> <div class="modal-title">ใส่ข้อมูล</div> </div> <ul class="right"> <li><a href="#!" onclick="{clickSubmitReport}">ปักพิน</a></li> </ul> </nav> </div> <div class="modal-content"> <div class="container no-padding-s"> <div class="row"> <div class="col s12 m6 offset-m3 l4 offset-l4"> <form id="report-form"> <input type="hidden" name="location[]:number" value="{location.lat}"> <input type="hidden" name="location[]:number" value="{location.lng}"> <input each="{photo in photos}" type="hidden" name="photos[]" value="{photo.url}"> <input type="hidden" name="status" value="open"> <input type="hidden" name="owner" value="youpin"> <input type="hidden" name="level" value="normal"> <input type="hidden" name="neighborhood" value="{neighborhood}"> <div class="card"> <div class="card-image responsive"> <div class="slider-container"> <div class="image-slider" id="photo-slider"> <div class="slider-item" each="{photo, i in photos}" data-i="{i}"><a class="image-item" data-i="{i}" href="#!" onclick="{clickPhoto}"> <div class="image" riot-style="background-image: url(&quot;{util.site_url(photo.url)}&quot;)"></div></a></div> </div> </div> </div> <div class="card-content"> <div class="input-field"><i class="icon material-icons prefix">chat_bubble_outline</i> <input class="validate" type="text" name="detail" placeholder="ตั้งชื่อพิน" value="{detail}"> </div> <div class="input-field"><i class="icon material-icons prefix {location.lat ? &quot;active&quot; : &quot;&quot;}">place</i><a class="location-input input" href="#" onclick="{clickLocation}">{location_text}</a></div> <div class="input-field"><i class="icon material-icons prefix">inbox</i> <input class="validate" type="text" name="categories" placeholder="หมวด" value="{categories}"> </div> </div> </div> </form> </div> </div> </div> </div> </div> <div class="modal bottom-sheet full-sheet" id="report-photo-modal"> <div class="modal-header"> <nav> <ul class="left"> <li><a class="modal-action modal-close" href="#!"><i class="icon material-icons">arrow_back</i></a></li> </ul> <div class="center"><a class="brand-logo" href="#"></a> <div class="modal-title">ใส่ภาพถ่าย</div> </div> <ul class="right"></ul> </nav> </div> <div class="modal-content"> <div class="container no-padding-s"> <div class="row card-list"> <div class="col s12 m6 offset-m3 l4 offset-l4" each="{photo, i in photos}"> <div class="card" data-i="{i}"> <div class="card-image responsive"><img riot-src="{util.site_url(photo.url)}"></div> <div class="card-content"> <div class="input-field"> <input class="validate" type="text" name="photo[{i}][text]" value="{photo.text}" placeholder="ใส่คำอธิบาย" data-i="{i}" onchange="{changePhotoText}"> </div> </div> </div> </div> <div class="col s12 m6 offset-m3 l4 offset-l4"> <div class="card"> <div class="card-image responsive"> <div class="drop-image-preview hide"></div> <div class="card-title center drop-image valign-wrapper" name="dropzone-el"><i class="icon material-icons">photo_camera</i>เพิ่มรูป</div> </div> </div> </div> </div> </div> </div> </div> <div class="modal bottom-sheet full-sheet" id="report-map-modal"> <div class="modal-header"> <nav> <ul class="left"> <li><a class="modal-action modal-close" href="#!"><i class="icon material-icons">check</i></a></li> </ul> <div class="center"><a class="brand-logo" href="#"></a> <div class="modal-title">ใส่ตำแหน่ง</div> </div> <ul class="right"> <li><a href="#!" onclick="{setMapLocationByGeolocation}"><i class="icon material-icons">gps_fixed</i></a></li> </ul> </nav> </div> <div class="modal-content no-padding"> <div class="input-location-map" id="input-location-map"></div> </div> </div> <div class="modal" id="report-uploading-modal"> <div class="modal-content"> <div class="progress"> <div class="indeterminate"></div> </div> <h4 class="center">กำลังอัพโหลด</h4> </div> </div> <div class="modal" id="report-saving-modal"> <div class="modal-content"> <div class="progress"> <div class="indeterminate"></div> </div> <h4 class="center">กำลังพิน</h4> </div> </div>', 'page-report .input-location-map,[riot-tag="page-report"] .input-location-map,[data-is="page-report"] .input-location-map{ position: absolute; top: 0; bottom: 0; left: 0; right: 0; } page-report .leaflet-map-pane,[riot-tag="page-report"] .leaflet-map-pane,[data-is="page-report"] .leaflet-map-pane{ z-index: 2 !important; } page-report .leaflet-google-layer,[riot-tag="page-report"] .leaflet-google-layer,[data-is="page-report"] .leaflet-google-layer{ z-index: 1 !important; }', '', function (opts) {
  var self = this;

  self.dropzone = null;
  self.slider = false;

  self.detail = '';
  self.categories = '';
  self.photos = [];
  self.target = opts.target;
  self.map = null;
  self.map_id = 'input-location-map';
  self.location = { lat: '', lng: '' };
  self.neighborhood = 'สีลม';

  self.DEFAULT_LOCATION = { lat: 13.7302295, lng: 100.5724075 };
  self.YPIcon = L.icon({
    iconUrl: util.site_url('/public/image/marker-m.png'),
    iconSize: [32, 51],
    iconAnchor: [16, 48],
    popupAnchor: [0, -51]
  });

  self.on('update', function () {
    self.location_text = self.location && typeof self.location.lat === 'number' ? 'ปักพินแล้ว' : 'เลือกตำแหน่ง';
  });
  self.on('mount', function () {});
  self.on('unmount', function () {});
  self.on('updated', function () {
    initDropzone();
  });

  function resetReportModal() {
    destroyMap();
    destroyPhotoSlider();

    self.target = opts.target;

    self.detail = '';
    self.categories = '';
    self.photos = [];
    self.map = null;
    self.location = null;
    $(self.root).find('input[name="detail"]').val('');
    $(self.root).find('input[name="categories"]').val('');
    self.update();
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
        clickable: [$(self.target)[0], self['dropzone-el']],
        uploadMultiple: true,
        fallback: function fallback() {
          $(self.root).find('.dropzone').hide();
          $(self.root).find('.dropzone-error').show();
        }
      });
      self.dropzone.on('addedfile', function (file) {}).on('sendingmultiple', function (file, xhr, form_data) {
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
      }).on('errormultiple', function (files) {
        console.error('error:', arguments);
      }).on('completemultiple', function (files) {
        uploadPhotoListComplete();
      });
    }
  }

  function uploadPhotoList() {
    $('#report-uploading-modal').openModal({
      dismissible: false
    });
  }

  function uploadPhotoListComplete() {
    $('#report-uploading-modal').closeModal();
    var $input_modal = $(self['report-input-modal']);
    var $photo_modal = $(self['report-photo-modal']);
    if ($input_modal.hasClass('open')) {
      $photo_modal.openModal();
    } else {
      $input_modal.openModal({
        ready: function ready() {},
        complete: function complete() {
          resetReportModal();
        }
      });
    }
    self.update();
    createPhotoSlider();
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

  function createMap() {
    if (self.map) destroyMap();

    self.map = L.map(self.map_id);
    self.map.locate({ setView: true, maxZoom: 16 });
    self.map.on('locationfound', function (e) {
      updateMarkerLocation(self.map.getCenter());
    });
    self.map.on('locationerror', function (err) {
      console.error(err.message);
      self.map.setView([13.7302295, 100.5724075], 16);
    });

    var googleLayer = new L.Google('ROADMAP');
    self.map.addLayer(googleLayer);

    self.map_marker = L.marker([self.DEFAULT_LOCATION.lat, self.DEFAULT_LOCATION.lng], { icon: self.YPIcon }).bindPopup('ที่นี่มีหลุมบ่อ น้ำท่วมขังบ่อย ส่งกลิ่นเหม็นทุกเย็นเลย').addTo(self.map);

    self.map.on('drag', _.throttle(function () {
      updateMarkerLocation(self.map.getCenter());
    }, 100));
    self.map.on('dragend', function (e) {
      updateMarkerLocation(self.map.getCenter());
    });
  }

  function destroyMap() {
    if (self.map) {
      self.map.remove();
      delete self.map;
    }
  }

  function updateMarkerLocation(latlng) {
    self.location = latlng;
    self.map_marker.setLatLng(latlng);
    self.update();
  }

  function openPhoto(e) {
    $('#report-photo-modal').openModal();
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
    form_data.created_time = Date.now();
    form_data.updated_time = form_data.created_time;

    $.ajax({
      url: util.site_url('/pins', app.get('service.api.url')),
      method: 'post',
      headers: {
        'Authorization': 'Basic ' + app.get('service.api.hash_key')
      },
      beforeSend: function beforeSend(xhrObj) {
        xhrObj.setRequestHeader('Content-Type', 'application/json');
        xhrObj.setRequestHeader('Accept', 'application/json');
      },
      dataType: 'json',
      data: JSON.stringify(form_data)
    }).done(function (data) {
      submitReportComplete();
      app.goto('pins/' + data.name);
    }).fail(function (error) {
      console.error('error:', err);
    });
  }

  function submitReportComplete() {
    resetReportModal();
    $('#report-saving-modal').closeModal();
    $('#report-input-modal').closeModal();
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

  self.clickLocation = function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('#report-map-modal').openModal({
      ready: function ready() {
        if (!self.map) {
          createMap();
        }
      }
    });
  };

  self.setMapLocationByGeolocation = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (self.map) {
      self.map.locate({ setView: true, maxZoom: 16 });
    }
  };

  self.clickSubmitReport = function (e) {
    e.preventDefault();
    e.stopPropagation();
    submitReport();
  };
});
