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
              input(type='hidden', name='location[]:number', value='{ location.lat }')
              input(type='hidden', name='location[]:number', value='{ location.lng }')
              input(each='{ photo in photos }', type='hidden', name='photos[]', value='{ photo.url }')
              input(type='hidden', name='status', value='open')
              input(type='hidden', name='owner', value='youpin')
              input(type='hidden', name='level', value='normal')
              input(type='hidden', name='neighborhood', value='{ neighborhood }')

              .card
                .card-image(if='{ photos.length === 0 }', href='#report', style='background-image: url({ util.site_url("/public/image/pin_photo_upload.png") });')
                  button#add-image-btn.btn-floating.btn-large.waves-effect.waves-light.white(type='button', onclick='{ clickPhoto }')
                    i.icon.material-icons.large.light-blue-text add

                .card-image.responsive(if='{ photos.length > 0 }')
                  .slider-container
                    #photo-slider.image-slider
                      .slider-item(each='{ photo, i in photos }', data-i='{ i }')
                        .image-item(data-i='{ i }', href='#!')
                          .image(style='background-image: url("{ util.site_url(photo.url) }");')
                  a#add-image-btn.btn-floating.btn-large.waves-effect.waves-light(href='#report', onclick='{ clickPhoto }')
                    i.icon.material-icons add
                #input-detail.input-field
                  //- i.icon.material-icons.prefix chat_bubble_outline
                  textarea.validate.materialize-textarea(name='detail', placeholder='ใส่คำอธิบายปัญหาหรือข้อเสนอแนะ', oninput='{ changeDetail }') { detail }

                .card-content
                  #input-categories.input-field
                    i.icon.material-icons.prefix local_offer
                    select#select-categories(name='categories', onchange='{ changeCategories }')
                      option(each='{ cat in choice_categories }', value='{ cat.value }', selected='{ cat.selected }') { cat.text }
                    //- input.validate(type='text', name='categories', placeholder='หมวด', value='{ categories }')

                  #input-location.input-field(if='{ !location }')
                    i.icon.material-icons.prefix(class='{ location.lat ? "active" : "" }') place
                    a.location-input.input(href='#', onclick='{ clickLocation }') { location_text }
                      i.icon.material-icons.green-text.small(if='{ location }', style='vertical-align: top;') check
                    //- input.validate(type='text', name='location', placeholder='ใส่ตำแหน่ง', value='{ location_text }', readonly, onfocus='{ clickLocation }')

                #input-location-complete(if='{ location }')
                  map-box#input-location-map(pin-clickable='false', options-dragging='false', options-zoom='15', options-zoom-control='false', options-scroll-wheel-zoom='false', options-double-click-zoom='false', options-touch-zoom='false', options-tap='false', options-keyboard='false')
                  button#edit-location-btn.btn-floating.btn-large.waves-effect.waves-light.white(type='button', onclick='{ clickLocation }')
                    i.icon.material-icons.large.light-blue-text edit

      .fluid-container
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
              .card-content
                .input-field
                  input.validate(type='text', name='photo[{ i }][text]', value='{ photo.text }', placeholder='ใส่คำอธิบาย', data-i='{ i }', onchange='{ changePhotoText }')

          .col.s12.m6.offset-m3.l4.offset-l4
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
            a(href='#!', onclick='{ setMapLocationByGeolocation }')
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

    self.detail = '';
    self.categories = '';
    self.photos = [];
    self.target = opts.target;
    self.map = null;
    self.map_id = 'edit-location-map';
    self.location = null;
    self.neighborhood = 'สีลม';
    // Define
    self.DEFAULT_LOCATION = { lat: 13.7302295, lng: 100.5724075 };
    self.YPIcon = L.icon({
        iconUrl: util.site_url('/public/image/marker-m.png'),
        iconSize: [32, 51],
        iconAnchor: [16, 48],
        popupAnchor: [0, -51]
    });

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
      $('#select-categories').material_select('destroy');
      $('#select-categories').material_select();
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
      self.photos = [];
      self.map = null;
      self.location = null;
      $(self.root).find('textarea[name="detail"]').val('');
      $(self.root).find('select[name="categories"]').val('');
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
          clickable: _.filter([$(self.target)[0], self['dropzone-el']]),
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
      app.goto('report');
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
            closeReportView();
            app.goto('feed');
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

      // // Add google maps
      // var googleLayer = new L.Google('ROADMAP');
      // self.map.addLayer(googleLayer);
      //
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

      self.map_marker = L.marker([self.DEFAULT_LOCATION.lat, self.DEFAULT_LOCATION.lng], { icon: self.YPIcon })
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
      riot.mount('#input-location-map', { pins: [{ location: self.location }] })
    }

    function openPhoto(e) {
      $('#report-input-modal').addClass('inactive');
      $('#report-photo-modal').openModal();
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
      form_data.created_time = Date.now();
      form_data.updated_time = form_data.created_time;

      $.ajax({
        url: util.site_url('/pins', app.get('service.api.url')),
        method: 'post',
        headers: {
          'Authorization': 'Basic ' + app.get('service.api.hash_key')
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
        app.goto('pins/' + data.name);
      })
      .fail(error => {
        console.error('error:', error);
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

    self.clickLocation = function(e) {
      e.preventDefault();
      e.stopPropagation();
      $('#report-input-modal').addClass('inactive');
      $('#report-map-modal').openModal({
        ready: function() { // when modal open
          if (!self.map) {
            createMap();
          }
        },
        complete: function() { // when modal close
          updateMarkerLocation(self.map.getCenter());
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

    self.clickClosePhoto = function(e) {
      $('#report-input-modal').removeClass('inactive');
    }

    self.clickCloseMap = function(e) {
      $('#report-input-modal').removeClass('inactive');
    }

    self.clickCloseReport = function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeReportView();
      app.goto('feed');
    }
