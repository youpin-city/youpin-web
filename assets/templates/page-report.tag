page-report

  #report-uploading-modal.modal
    .modal-content
      .progress
        .indeterminate
      h4.center กำลังอัพโหลด

  #report-saving-modal.modal
    .modal-content
      .progress
        .indeterminate
      h4.center กำลังพิน

  #report-input-modal.modal.bottom-sheet.full-sheet
    .modal-header
      nav
        ul.left
          li
            a.modal-action.modal-close(href='#!')
              | ยกเลิก
        .center
          a.brand-logo(href='#')
          .modal-title ใส่ข้อมูล
        ul.right
          li
            a(href='#!', onclick='{ clickSubmitReport }')
              | ปักพิน

    .modal-content.no-padding
      form
        .card
          .card-image
            .slider-container
              #photo-slider.image-slider
                .slider-item(each='{ photo, i in photos }', data-i='{ i }')
                  a.image-item(data-i='{ i }', href='#!', onclick='{ clickPhoto }')
                    .image(style='background-image: url("{ util.site_url(photo.url) }");')
          .card-content
            .input-field
              i.icon.material-icons.prefix chat_bubble_outline
              input.validate(type='text', name='name', placeholder='ตั้งชื่อพิน')

            .input-field
              i.icon.material-icons.prefix place
              input.validate(type='text', name='location', placeholder='ใส่ตำแหน่ง', value='{ location_text }', readonly, onfocus='{ clickLocation }')

            .input-field
              i.icon.material-icons.prefix style
              input.validate(type='text', name='category', placeholder='หมวด')

            .input-field
              i.icon.material-icons.prefix local_offer
              input.validate(type='text', name='tag', placeholder='แท็ก')

  #report-photo-modal.modal.bottom-sheet.full-sheet
    .modal-header
      nav
        ul.left
          li
            a.modal-action.modal-close(href='#!')
              i.icon.material-icons arrow_back
        .center
          a.brand-logo(href='#')
          .modal-title ใส่ภาพถ่าย

    .modal-content.no-padding

      .row.card-list
        .col.s12.m6.l4(each='{ photo, i in photos }')
          .card(data-i='{ i }')
            .card-image
              img(src='{ util.site_url(photo.url) }')
            .card-content
              .input-field
                input.validate(type='text', name='photo[{ i }][text]', value='{ photo.text }', placeholder='ใส่คำอธิบาย', data-i='{ i }', onchange='{ changePhotoText }')

        .col.s12.m6.l4
          .card
            .card-image
              .drop-image-preview.hide
              .card-title.center.drop-image.valign-wrapper(name='dropzone-el')
                i.icon.material-icons photo_camera
                | เพิ่มรูป

  #report-map-modal.modal.bottom-sheet.full-sheet
    .modal-header
      nav
        ul.left
          li
            a.modal-action.modal-close(href='#!')
              i.icon.material-icons check
        .center
          a.brand-logo(href='#')
          .modal-title ใส่ตำแหน่ง
        ul.right
          li
            a(href='#!', onclick='{ setMapLocationByGeolocation }')
              i.icon.material-icons gps_fixed

    .modal-content.no-padding
      #input-location-map.input-location-map

  style(type='scss', scoped).
    :scope {
      .input-location-map {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
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
    /***************
     * DEFAULT
     ***************/
    self.dropzone = null;
    self.slider = false;
    self.photos = [];
    self.target = opts.target;
    self.map = null;
    self.map_id = 'input-location-map';
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
    self.on('update', () => {
      self.location_text = self.location
        ? `${self.location.lat},${self.location.lng}`
        : '';
    });
    self.on('mount', () => {
      // console.log('page report mounted.');
    });
    self.on('unmount', () => {
      // console.log('page report unmounted.');
    });
    self.on('updated', () => {
      initDropzone();
    });

    /***************
     * ACTION
     ***************/
    function resetReportModal() {
      destroyMap();
      destroyPhotoSlider();

      // self.dropzone = null;
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
          maxFilesize: 5, // MB
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
            // console.log(file);
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
            // console.log('ready');
          },
          complete: function() { // when modal close
            resetReportModal();
          }
        });
      }
      self.update();
      createPhotoSlider();
    }

    function createPhotoSlider() {
      // make slider
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
        // arrows: self.arrows,
        accessibility: false,
        cssEase: 'ease-in'
      });
      self.slider = true;
    }

    function destroyPhotoSlider() {
      // make slider
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
      setTimeout(submitReportSuccess, 3000);
    }

    function submitReportSuccess() {
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
        ready: function() { // when modal open
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
