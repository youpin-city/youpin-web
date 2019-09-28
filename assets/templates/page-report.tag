page-report

  #report-input-modal.modal.bottom-sheet.full-sheet
    .modal-header
      nav
        ul.left
          li
            a.modal-action.modal-close(href='#', onclick='{ clickCloseReport }')
              | ยกเลิก
        .center
          a.brand-logo(href='#')
          .modal-title ใส่ข้อมูลพิน
        ul.right
          //- li
          //-   a(href='#!', onclick='{ clickSubmitReport }')
          //-    | ปักพิน

    .modal-content.no-padding-s
      .container.no-padding-s
        .row
          .col.s12.m6.offset-m3.l4.offset-l4
            form#report-form
              input(type='hidden', name='location[coordinates][]:number', value='{ location.lat }')
              input(type='hidden', name='location[coordinates][]:number', value='{ location.lng }')
              input(type='hidden', name='location[type][]:string', value='Point')
              input(each='{ photo in photos }', type='hidden', name='photos[]', value='{ photo.url }')
              input(type='hidden', name='status', value='{ status }')
              input(type='hidden', name='owner', value='{ owner }')
              input(each='{ provider in providers }', type='hidden', name='provider[]', value='{ provider }')
              input(type='hidden', name='level', value='normal')
              input(type='hidden', name='neighborhood', value='{ neighborhood }')

              .card
                .card-image(if='{ photos.length === 0 }', href='#report', style='background-image: url({ util.site_url("/public/image/pin_photo_upload.png") });')
                  button#add-first-image-btn.btn-floating.btn-large.waves-effect.waves-light.white(type='button', onclick='{ clickPhoto }')
                    i.icon.material-icons.large.light-blue-text add

                .card-image.responsive(if='{ photos.length > 0 }')
                  .slider-container
                    #photo-slider.image-slider
                      .slider-item(each='{ photo, i in photos }', data-i='{ i }')
                        .image-item(data-i='{ i }', href='#!')
                          .image(style='background-image: url("{ util.site_url(photo.url) }");')
                  a#add-image-btn.btn-floating.btn-large.waves-effect.waves-light(href='#report', onclick='{ clickPhoto }')
                    i.icon.material-icons add
                //- #input-detail.input-field
                //-   //- i.icon.material-icons.prefix chat_bubble_outline
                //-   textarea.validate.materialize-textarea(name='detail', placeholder='ใส่คำอธิบายปัญหาหรือข้อเสนอแนะ', oninput='{ changeDetail }') { detail }

                .card-content
                  #input-tree-name.input-field
                    i.icon.material-icons.prefix local_florist
                    .input(style='margin-left: 30px;')
                      input(name='tree_name', placeholder='ชื่อพันธุ์ไม้', oninput='{ changeTreeName }')

                  #input-tree-height.input-field
                    i.icon.material-icons.prefix swap_vert
                    .input(style='margin-left: 30px;')
                      input(type='number', step='0.1', name='tree_height', placeholder='ความสูง (m)', oninput='{ changeTreeHeight }')

                  #input-tree-canopy-radius.input-field
                    i.icon.material-icons.prefix swap_horiz
                    .input(style='margin-left: 30px;')
                      input(type='number', step='0.1', name='tree_canopy_radius', placeholder='รัศมีทรงพุ่ม (m)', oninput='{ changeTreeCanopyRadius }')

                  #input-tree-circumference.input-field
                    i.icon.material-icons.prefix refresh
                    .input(style='margin-left: 30px;')
                      input(type='number', step='1', name='tree_circumference', placeholder='เส้นรอบวง (cm)', oninput='{ changeTreeCircumference }')

                  #input-categories.input-field
                    i.icon.material-icons.prefix local_offer
                    .input
                      select#select-categories.browser-default(name='categories', onchange='{ changeCategories }')
                        option(value='') เลือกหมวดหมู่
                        option(each='{ cat in choice_categories }', value='{ cat.value }', selected='{ cat.selected }') { cat.text }

                  #input-location.input-field(if='{ !location }')
                    i.icon.material-icons.prefix(class='{ location.lat ? "active" : "" }') place
                    .input
                      button.location-input.btn.btn-block.btn-native(type='button', onclick='{ clickMapLocation }') { location_text }

                #input-detail.input-field
                  //- i.icon.material-icons.prefix chat_bubble_outline
                  textarea.validate.materialize-textarea(name='detail', placeholder='ใส่คำอธิบายปัญหาหรือข้อเสนอแนะ', oninput='{ changeDetail }') { detail }

                #input-location-complete(if='{ location }')
                  map-box#preview-location(pin-clickable='false', options-dragging='false', options-zoom='{ default_zoom }', options-zoom-control='false', options-scroll-wheel-zoom='false', options-double-click-zoom='false', options-touch-zoom='false', options-tap='false', options-keyboard='false')
                  button#edit-location-btn.btn-floating.btn-large.waves-effect.waves-light.white(type='button', onclick='{ clickMapLocation }')
                    i.icon.material-icons.large.light-blue-text edit

      .container.no-padding-s
        .row
          .col.s12.m6.offset-m3.l4.offset-l4
            button#submit-pin-btn.btn.btn-large.btn-block(type='button', onclick='{ clickSubmitReport }', class='{ is_pin_complete ? "" : "disabled" }', disabled='{ !is_pin_complete }') โพสต์พิน

  #report-photo-modal.modal.bottom-sheet.full-sheet
    .modal-header
      nav
        ul.left
          li
            a.modal-action.modal-close(href='#report', onclick='{ clickClosePhoto }')
              //- i.icon.material-icons arrow_back
              | กลับ
        .center
          a.brand-logo(href='#')
          .modal-title เลือกภาพถ่าย
        ul.right

    .modal-content.no-padding-s
      .container.no-padding-s
        .row.card-list
          .col.s12.m6.offset-m3.l4.offset-l4(each='{ photo, i in photos }')
            .card(data-i='{ i }')
              .card-image.responsive
                img(src='{ util.site_url(photo.url) }')
              //- .card-content
              //-   .input-field
              //-     input.validate(type='text', name='photo[{ i }][text]', value='{ photo.text }', placeholder='ใส่คำอธิบาย', data-i='{ i }', onchange='{ changePhotoText }')

          .col.s12.m6.offset-m3.l4.offset-l4
            .spacing
            .drop-image-preview.hide
            .card-title.center.drop-image(name='dropzone-el')
              i.icon.material-icons photo_camera
              | เพิ่มรูป

  #report-map-modal.modal.bottom-sheet.full-sheet
    .modal-header
      nav
        ul.left
          li
            a.modal-action.modal-close(href='#report', onclick='{ clickCloseMap }')
              //- i.icon.material-icons check
              | กลับ
        .center
          a.brand-logo(href='#')
          .modal-title ตำแหน่งพิน
        ul.right
          li
            a(href='#!', onclick='{ clickLocateMe }')
              i.icon.material-icons gps_fixed

    .modal-content.no-padding-s
      #edit-location-map.input-location-map
      a#submit-location-btn.btn.btn-large.btn-block.modal-close(onclick='{ clickCloseMap }') ใช้ตำแหน่งนี้

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
    self.is_pin_complete = false;
    self.redirect = '';

    self.detail = '';
    self.categories = '';
    self.photos = [];
    self.target = opts.target;
    self.map = null;
    self.map_id = 'edit-location-map';
    self.location = null;
    self.default_zoom = 16;
    self.default_status = 'unverified';
    self.status = self.default_status;
    self.neighborhood = '';
    self.owner = app.get('app_user._id');
    self.providers = [app.get('app_user._id')];
    // Define
    self.YPIcon = L.icon({
        iconUrl: util.site_url('/public/image/marker-m.png'),
        iconSize: [32, 51],
        iconAnchor: [16, 48],
        popupAnchor: [0, -51]
    });

    self.choice_categories = [
      { value: 'bigtree', text: 'Big Tree', selected: true },
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

    function check_fileapi_support() {
      return !!(window.File && window.FileList && window.FileReader);
    }

    function check_canvas_support() {
      var elem = document.createElement('canvas');
      return !!(elem.getContext && elem.getContext('2d'));
    }

    function check_blob_support() {
      try {
        return !!new Blob();
      } catch (e) {
        return false;
      }
    }
    const support_blob = check_blob_support();
    const support_canvas = check_canvas_support();
    const support_fileapi = check_fileapi_support();

    /***************
     * CHANGE
     ***************/

    /***************
     * RENDER
     ***************/
    self.on('update', () => {
      self.location_text = self.location && typeof self.location.lat === 'number'
        ? 'ปักตำแหน่งแล้ว'
        : 'ใส่ตำแหน่ง';
      checkReportComplete();
    });
    self.on('mount', () => {
      // console.log('page report mounted.');
    });
    self.on('unmount', () => {
      // console.log('page report unmounted.');
    });
    self.on('updated', () => {
      initDropzone();
      initMap();

      // $('#select-categories').material_select('destroy');
      // $('#select-categories').material_select();
    });

    /***************
     * ACTION
     ***************/
    function resetReportModal() {
      destroyMap();
      destroyPhotoSlider();

      // self.dropzone = null;
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

    function to_decimal($deg, $min, $sec, $hem){
      const $d = $deg + (($min/60) + ($sec/3600));
      return $d * (($hem =='S' || $hem=='W') ? -1 : 1);
    }

    function base64ToFile(data_uri, orig_file) {
      let byteString;
      if (data_uri.split(',')[0].indexOf('base64') !== -1) {
        byteString = atob(data_uri.split(',')[1]);
      } else {
        byteString = decodeURI(data_uri.split(',')[1]);
      }
      const mimestring = data_uri.split(',')[0].split(':')[1].split(';')[0];
      const content = [];
      for (let i = 0; i < byteString.length; i++) {
        content[i] = byteString.charCodeAt(i);
      }
      const new_file = new Blob([new Uint8Array(content)], {type: 'image/png'});
      // Copy props set by the dropzone in the original file
      const origProps = [
        'upload', 'status', 'previewElement', 'previewTemplate', 'accepted'
      ];
      $.each(origProps, function(i, p) {
        new_file[p] = orig_file[p];
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
          maxFilesize: 25, // MB
          previewsContainer: '.drop-image-preview',
          previewTemplate: '<div class="dz-preview-template" style="display: none;"></div>',
          dictDefaultMessage: '',
          clickable: _.filter([$(self.target)[0], self['dropzone-el'], self['add-first-image-btn']]),
          uploadMultiple: true,
          autoQueue: false, // to normalize orientation and resize image
          fallback: function() {
            $(self.root).find('.dropzone').hide();
            $(self.root).find('.dropzone-error').show();
          }
        });
        self.dropzone
          .on('addedfile', function(orig_file) {
            uploadPhotoList();

            if (!support_blob || !support_fileapi || !support_canvas) {
              dropzone.enqueueFile(orig_file);
              return;
            }

            const MAX_WIDTH  = 800;
            const MAX_HEIGHT = 800;
            const dropzone = self.dropzone;
            const reader = new FileReader();

            // Convert file to img
            reader.addEventListener('load', function(event) {
              const orig_img = new Image();
              orig_img.src = event.target.result;
              orig_img.addEventListener('load', function(event) {
                let width  = event.target.width;
                let height = event.target.height;
                // Don't resize if it's small enough
                if (width <= MAX_WIDTH && height <= MAX_HEIGHT) {
                  dropzone.enqueueFile(orig_file);
                  return;
                }
                // Calc new dims otherwise
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

                // Read EXIF metadata
                EXIF.getData(orig_file, function() {
                  const exifdata = this.exifdata;
                  const orientation = exifdata.Orientation || false;
                  let gps_location = null;
                  if (exifdata.GPSLatitude && exifdata.GPSLongitude) {
                    const lat = to_decimal(
                      _.get(exifdata, 'GPSLatitude.0', 0),
                      _.get(exifdata, 'GPSLatitude.1', 0),
                      _.get(exifdata, 'GPSLatitude.2', 0),
                      _.get(exifdata, 'GPSLatitudeRef', 'N')
                    );
                    const lng = to_decimal(
                      _.get(exifdata, 'GPSLongitude.0', 0),
                      _.get(exifdata, 'GPSLongitude.1', 0),
                      _.get(exifdata, 'GPSLongitude.2', 0),
                      _.get(exifdata, 'GPSLongitudeRef', 'N')
                    );
                    gps_location = [lat, lng];
                  }

                  // Resize
                  var canvas = document.createElement('canvas');
                  canvas.width = width;
                  canvas.height = height;

                  // Canvas
                  var ctx = canvas.getContext('2d');
                  ctx.save();

                  // Correct orientation
                  if (orientation) {
                    if (orientation > 4) {
                      canvas.width  = height;
                      canvas.height = width;
                    }
                    switch (orientation) {
                      case 2: ctx.translate(width, 0);     ctx.scale(-1, 1); break;
                      case 3: ctx.translate(width, height); ctx.rotate(Math.PI); break;
                      case 4: ctx.translate(0, height);     ctx.scale(1, -1); break;
                      case 5: ctx.rotate(0.5 * Math.PI);   ctx.scale(1, -1); break;
                      case 6: ctx.rotate(0.5 * Math.PI);   ctx.translate(0, -height); break;
                      case 7: ctx.rotate(0.5 * Math.PI);   ctx.translate(width, -height); ctx.scale(-1, 1); break;
                      case 8: ctx.rotate(-0.5 * Math.PI);  ctx.translate(-width, 0); break;
                    }
                  }

                  ctx.drawImage(orig_img, 0, 0, width, height);
                  ctx.restore();

                  // Use GPS location of photo
                  if (gps_location) {
                    if (!self.location) {
                      setLocation(gps_location);
                    }
                  }

                  // Create normalized file
                  const resized_file = base64ToFile(canvas.toDataURL('image/jpeg'), orig_file);
                  // Replace original with resized
                  const orig_file_index = dropzone.files.indexOf(orig_file);
                  dropzone.files[orig_file_index] = resized_file;

                  // Enqueue added file manually making it available for
                  // further processing by dropzone
                  dropzone.enqueueFile(resized_file);
                });
              });
            });

            reader.readAsDataURL(orig_file);
          })
          .on('sendingmultiple', function(file, xhr, form_data) {
            // uploadPhotoList();
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
            $('#report-uploading-modal').closeModal();
            showReportView();
          })
          .on('errormultiple', function(files, reason) {
            console.error('error:', arguments);
            Materialize.toast('ไม่สามารถอัพโหลดรูปได้ (' + reason + ')', 5000, 'dialog-error');
            $('#report-uploading-modal').closeModal();
          })
          .on('completemultiple', function(files) {});
      }
    }

    function uploadPhotoList() {
      $('#report-uploading-modal').openModal({
        dismissible: false,
      });
    }

    function showReportView() {
      self.redirect = app.current_hash || '#feed';
      if (self.redirect === '#report') self.redirect = '#feed';
      app.goto('report');
      const $input_modal = $(self['report-input-modal']);
      const $photo_modal = $(self['report-photo-modal']);
      if ($input_modal.hasClass('open')) {
        // $photo_modal.openModal();
        if (self.photos.length <= 1) {
          setTimeout(function() {
            // next tick, auto close photo view when there's only one photo
            $photo_modal.find('.modal-close').click();
          }, 1);
        }
      } else {
        $input_modal.openModal({
          ready: function() {
            // console.log('ready');
          },
          complete: function() { // when modal close
            resetReportModal();
            closeReportView();
            // app.goto('feed');
            // $('#feed-tab-btn').click();
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

    self.changeTreeName = function (e) {
      self.tree_name = e.currentTarget.value;
      self.update();
    };

    self.changeTreeHeight = function (e) {
      self.tree_height = e.currentTarget.value ? +e.currentTarget.value : undefined;
      self.update();
    };

    self.changeTreeCanopyRadius = function (e) {
      self.tree_canopy_radius = e.currentTarget.value ? +e.currentTarget.value : undefined;
      self.update();
    };

    self.changeTreeCircumference = function (e) {
      self.tree_circumference = e.currentTarget.value ? +e.currentTarget.value : undefined;
      self.update();
    };

    self.changeCategories = function (e) {
      self.categories = e.currentTarget.value;
      self.update();
    };

    function checkReportComplete() {
      self.is_pin_complete = true;
      if (!self.location) self.is_pin_complete = false;
      if (!self.tree_name) self.is_pin_complete = false;
      //- if (!self.detail) self.is_pin_complete = false;
      //- if (!self.categories) self.is_pin_complete = false;
      if (self.photos.length === 0) self.is_pin_complete = false;
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

    function initMap() {
      if (self.map) return;
      if (!self.location) return;

      self.map = L.map(self.map_id);

      // // Add google maps
      // var googleLayer = new L.Google('ROADMAP');
      // self.map.addLayer(googleLayer);
      //
      // HERE Maps
      // @see https://developer.here.com/rest-apis/documentation/enterprise-map-tile/topics/resource-base-maptile.html
      // https: also suppported.
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
        language: 'tha',// 'eng',
        style: 'default',
        format: 'png8',
        size: '256'
      });
      self.map.addLayer(HERE_normalDay);
      self.map_marker = L.marker(app.get('location.default'), { icon: self.YPIcon })
        .addTo(self.map);

      updateMarkerLocation(self.location, { zoom: 16 });

      // self.map.on('drag', _.throttle(() => {
      //   updateMarkerLocation(self.map.getCenter());
      // }, 100));
      // self.map.on('dragend', e => {
      //   updateMarkerLocation(self.map.getCenter());
      // });
      self.map.on('move', _.throttle(() => {
        updateMarkerLocation(self.map.getCenter());
      }, 100));
      self.map.on('moveend zoomend resize', e => {
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

      self.map.on('locationfound', e => {
        updateMarkerLocation(self.map.getCenter(), { zoom: 18 });
      });
      self.map.on('locationerror', err => {
        console.error(err.message);
        Materialize.toast('ไม่สามารถแสดงตำแหน่งปัจจุบันได้ <a href="/help" target="_blank">อ่านที่นี่เพื่อแก้ไข</a>', 5000, 'dialog-error');
        // self.map.setView(app.get('location.default'), 16);
      });
      return true;
    }

    function setLocation(latlng) {
      updateMarkerLocation(latlng, { zoom: 17 });
      self.location = L.latLng(latlng);
      self.update();

      riot.mount('#preview-location', { pins: [{ location: {
        coordinates: self.location,
        type: 'Point'
      }}] });
    }

    function updateMarkerLocation(latlng, options = {}) {
      if (!self.map || !self.map_marker) return false;
      self.map_marker.setLatLng(latlng);

      if (options.zoom) {
        const bounds = new L.LatLngBounds([latlng]);
        self.map.fitBounds(bounds);
        if (typeof options.zoom === 'number') {
          setTimeout(function() {
            self.map.setZoom(options.zoom);
          }, 300);
        }
      }
      return true;
    }

    function updateMap() {
      _.forEach([self].concat($(self.root).find('map-box').map(function() {
        const el = this;
        return el._tag;
      }).toArray()), tag => {
        if (tag.map) {
          tag.map.setView(self.location);
          setTimeout(function() {
            tag.map.setZoom(self.default_zoom); // options.zoom);
          }, 300);
          tag.map.invalidateSize();
        }
      });
    }

    function openPhoto(e) {
      $('#report-input-modal').addClass('inactive');
      $('#report-photo-modal').openModal({
        ready: function() { // when modal open
          // if (!self.map) {
          //   initMap();
          // }
        },
        complete: function() { // when modal close
          createPhotoSlider();
          updateMap();
        }
      });
    }

    function submitReport() {
      $('#report-saving-modal').openModal({
        dismissible: false,
      });

      const form_data = $('#report-form').serializeJSON();
      form_data.categories = _.map(
        form_data.categories && typeof form_data.categories === 'string' ? form_data.categories.split(',') : [],
        cat => _.trim(cat)
      );
      form_data.tags = util.extract_tags(form_data.detail);
      // treat categories as tags for now
      // TODO: discard categories as tags when API support filter by categories
      form_data.tags = form_data.tags.concat(form_data.categories);
      form_data.created_time = Date.now();
      form_data.updated_time = form_data.created_time;
      form_data.organization = '583ddb7a3db23914407f9b50';

      $.ajax({
        url: util.site_url('/pins', app.get('service.api.url')),
        method: 'post',
        headers: {
          'Authorization': 'Bearer ' + app.get('app_token')
        },
        beforeSend: function(xhrObj){
          xhrObj.setRequestHeader('Content-Type', 'application/json');
          xhrObj.setRequestHeader('Accept', 'application/json');
        },
        dataType: 'json',
        data: JSON.stringify(form_data)
      })
      .done(data => {
        resetReportModal();
        closeReportView();
        app.goto('pins/' + data._id);
      })
      .fail(error => {
        console.error('error:', error);
        Materialize.toast('ไม่สามารถพินปัญหาได้ (' + error + ')', 5000, 'dialog-error');
        $('#report-saving-modal').closeModal();
      });
    }

    function closeReportView() {
      $('#report-saving-modal').closeModal();
      $('#report-input-modal').closeModal();
      $('#report-input-modal').removeClass('inactive');
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

    self.clickMapLocation = function(e) {
      e.preventDefault();
      e.stopPropagation();
      openMapLocation();
    };

    function openMapLocation() {
      $('#report-input-modal').addClass('inactive');
      $('#report-map-modal').openModal({
        ready: function() { // when modal open
          if (self.map) {
            updateMap();
          } else {
            if (!self.location) {
              self.location = app.get('location.default');
            }
            self.update();
          }
        },
        complete: function() { // when modal close
          if (self.location) {
            updateMap();
          }
        }
      });
    }

    self.clickLocateMe = function(e) {
      e.preventDefault();
      e.stopPropagation();
      setMapLocationByGeolocation();
    };

    self.clickSubmitReport = function(e) {
      e.preventDefault();
      e.stopPropagation();
      submitReport();
    };

    self.clickClosePhoto = function(e) {
      $('#report-input-modal').removeClass('inactive');
    }

    self.clickCloseMap = function(e) {
      setLocation(self.map.getCenter());
      $('#report-input-modal').removeClass('inactive');
    }

    self.clickCloseReport = function(e) {
      e.preventDefault();
      e.stopPropagation();

      resetReportModal();
      closeReportView();
      // app.goto('feed');
      // $('#feed-tab-btn').click();
      app.goto(self.redirect);
    }

