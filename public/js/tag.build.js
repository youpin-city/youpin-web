
riot.tag2('page-report', '<div class="modal bottom-sheet full-sheet" id="report-input-modal"> <div class="modal-header"> <nav> <ul class="left"> <li><a class="modal-action modal-close" href="#!">ยกเลิก</a></li> </ul> <div class="center"><a class="brand-logo" href="#"></a> <div class="modal-title">ใส่ข้อมูล</div> </div> <ul class="right"> <li><a href="#!" onclick="{clickSubmitReport}">ปักพิน</a></li> </ul> </nav> </div> <div class="modal-content no-padding"> <form> <div class="card"> <div class="card-image"> <div class="slider-container"> <div class="image-slider" id="photo-slider"> <div class="slider-item" each="{photo, i in photos}" data-i="{i}"><a class="image-item" data-i="{i}" href="#!" onclick="{clickPhoto}"> <div class="image" riot-style="background-image: url(&quot;{util.site_url(photo.url)}&quot;)"></div></a></div> </div> </div> </div> <div class="card-content"> <div class="input-field"><i class="icon material-icons prefix">chat_bubble_outline</i> <input class="validate" type="text" name="name" placeholder="ตั้งชื่อพิน"> </div> <div class="input-field"><i class="icon material-icons prefix">place</i> <input class="validate" type="text" name="location" placeholder="ใส่ตำแหน่ง" value="{location_text}" readonly onfocus="{clickLocation}"> </div> <div class="input-field"><i class="icon material-icons prefix">style</i> <input class="validate" type="text" name="category" placeholder="หมวด"> </div> <div class="input-field"><i class="icon material-icons prefix">local_offer</i> <input class="validate" type="text" name="tag" placeholder="แท็ก"> </div> </div> </div> </form> </div> </div> <div class="modal bottom-sheet full-sheet" id="report-photo-modal"> <div class="modal-header"> <nav> <ul class="left"> <li><a class="modal-action modal-close" href="#!"><i class="icon material-icons">arrow_back</i></a></li> </ul> <div class="center"><a class="brand-logo" href="#"></a> <div class="modal-title">ใส่ภาพถ่าย</div> </div> </nav> </div> <div class="modal-content no-padding"> <div class="row card-list"> <div class="col s12 m6 l4" each="{photo, i in photos}"> <div class="card" data-i="{i}"> <div class="card-image"><img riot-src="{util.site_url(photo.url)}"></div> <div class="card-content"> <div class="input-field"> <input class="validate" type="text" name="photo[{i}][text]" value="{photo.text}" placeholder="ใส่คำอธิบาย" data-i="{i}" onchange="{changePhotoText}"> </div> </div> </div> </div> <div class="col s12 m6 l4"> <div class="card"> <div class="card-image"> <div class="drop-image-preview hide"></div> <div class="card-title center drop-image valign-wrapper" name="dropzone-el"><i class="icon material-icons">photo_camera</i>เพิ่มรูป</div> </div> </div> </div> </div> </div> </div> <div class="modal bottom-sheet full-sheet" id="report-map-modal"> <div class="modal-header"> <nav> <ul class="left"> <li><a class="modal-action modal-close" href="#!"><i class="icon material-icons">check</i></a></li> </ul> <div class="center"><a class="brand-logo" href="#"></a> <div class="modal-title">ใส่ตำแหน่ง</div> </div> <ul class="right"> <li><a href="#!" onclick="{setMapLocationByGeolocation}"><i class="icon material-icons">gps_fixed</i></a></li> </ul> </nav> </div> <div class="modal-content no-padding"> <div class="input-location-map" id="input-location-map"></div> </div> </div> <div class="modal" id="report-uploading-modal"> <div class="modal-content"> <div class="progress"> <div class="indeterminate"></div> </div> <h4 class="center">กำลังอัพโหลด</h4> </div> </div> <div class="modal" id="report-saving-modal"> <div class="modal-content"> <div class="progress"> <div class="indeterminate"></div> </div> <h4 class="center">กำลังพิน</h4> </div> </div>', 'page-report .input-location-map,[riot-tag="page-report"] .input-location-map,[data-is="page-report"] .input-location-map{ position: absolute; top: 0; bottom: 0; left: 0; right: 0; } page-report .leaflet-map-pane,[riot-tag="page-report"] .leaflet-map-pane,[data-is="page-report"] .leaflet-map-pane{ z-index: 2 !important; } page-report .leaflet-google-layer,[riot-tag="page-report"] .leaflet-google-layer,[data-is="page-report"] .leaflet-google-layer{ z-index: 1 !important; }', '', function(opts) {
    const self = this;

    self.dropzone = null;
    self.slider = false;
    self.photos = [];
    self.target = opts.target;
    self.map = null;
    self.map_id = 'input-location-map';
    self.location = null;

    self.DEFAULT_LOCATION = { lat: 13.7302295, lng: 100.5724075 };
    self.YPIcon = L.icon({
        iconUrl: util.site_url('/public/image/marker-m.png'),
        iconSize: [32, 51],
        iconAnchor: [16, 48],
        popupAnchor: [0, -51]
    });

    self.on('update', () => {
      self.location_text = self.location
        ? `${self.location.lat},${self.location.lng}`
        : '';
    });
    self.on('mount', () => {

    });
    self.on('unmount', () => {

    });
    self.on('updated', () => {
      initDropzone();
    });

    function resetReportModal() {
      destroyMap();
      destroyPhotoSlider();

      self.photos = [];
      self.target = opts.target;
      self.map = null;
      self.location = null;
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
          fallback: function() {
            $(self.root).find('.dropzone').hide();
            $(self.root).find('.dropzone-error').show();
          }
        });
        self.dropzone
          .on('addedfile', function(file) {

          })
          .on('sendingmultiple', function(file, xhr, form_data) {
            uploadPhotoList();
          })
          .on('successmultiple', function(files, results) {
            for (let i = 0; i < files.length; i++) {
              const photo = results[i];
              _.assignIn(photo, {
                width: files[i].width,
                height: files[i].height
              });
              self.photos.push(photo);
            };
          })
          .on('errormultiple', function(files) { console.error('error:', arguments); })
          .on('completemultiple', function(files) {
            uploadPhotoListComplete();
          });
      }
    }

    function uploadPhotoList() {
      $('#report-uploading-modal').openModal({
        dismissible: false,
      });
    }

    function uploadPhotoListComplete() {
      $('#report-uploading-modal').closeModal();
      const $input_modal = $(self['report-input-modal']);
      const $photo_modal = $(self['report-photo-modal']);
      if ($input_modal.hasClass('open')) {
        $photo_modal.openModal();
      } else {
        $input_modal.openModal({
          ready: function() {

          },
          complete: function() {
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
      self.$slider
      .on('init reinit', function(e) {
      })
      .on('setPosition', function(e, slick) {
      })
      .slick({
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
      self.map.on('locationfound', e => {
        updateMarkerLocation(self.map.getCenter());
      });
      self.map.on('locationerror', err => {
        console.error(err.message);
        self.map.setView([13.7302295, 100.5724075], 16);
      });

      var googleLayer = new L.Google('ROADMAP');
      self.map.addLayer(googleLayer);

      self.map_marker = L.marker([self.DEFAULT_LOCATION.lat, self.DEFAULT_LOCATION.lng], { icon: self.YPIcon })
        .bindPopup('ที่นี่มีหลุมบ่อ น้ำท่วมขังบ่อย ส่งกลิ่นเหม็นทุกเย็นเลย')
        .addTo(self.map);

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
        dismissible: false,
      });
      setTimeout(submitReportComplete, 3000);
    }

    function submitReportComplete() {
      $('#report-saving-modal').closeModal();
      $('#report-input-modal').closeModal();
    }

    self.clickPhoto = function(e) {
      e.preventDefault();
      e.stopPropagation();
      openPhoto();
    };

    self.changePhotoText = function(e) {
      const i = +$(e.target).attr('data-i');
      self.photos[i].text = e.value;
    };

    self.clickLocation = function(e) {
      e.preventDefault();
      e.stopPropagation();
      $('#report-map-modal').openModal({
        ready: function() {
          if (!self.map) {
            createMap();
          }
        }
      });
    };

    self.setMapLocationByGeolocation = function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (self.map) {
        self.map.locate({ setView: true, maxZoom: 16 });
      }
    };

    self.clickSubmitReport = function(e) {
      e.preventDefault();
      e.stopPropagation();
      submitReport();
    };
});