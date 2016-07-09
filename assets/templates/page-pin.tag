page-pin

  #page-pin
    .map-container
      map-box
    .container.no-padding-s
      .row
        .col.s12.m6
          .card
            .card-image.responsive
              .slider-container
                #photo-slider.image-slider
                  .slider-item(each='{ photo in pin.photos }')
                    .image-item
                      .image(style='background-image: url("{ util.site_url(photo) }");')

        .col.s12.m6.l5.offset-l1
          .card
            .card-content

              .pin-content

                .card-description
                  .card-author
                    a(href='#user/{ pin.owner }') @{ pin.owner }
                  .card-text { pin.detail }
                  .tag-list(if='{ pin.tags && pin.tags.length > 0 }')
                    a.tag-item(each='{ tag in pin.tags }', href=('#tag/{ tag }')) {tag}
                  .card-area(if='{ pin.neighborhood }') ย่าน{ pin.neighborhood }

                .card-stat
                  .meta.meta-like.left
                    //- i.icon.material-icons.tiny thumb_up
                    | เห็นด้วย { pin.voters.length } คน
                  .meta.meta-comment.left
                    i.icon.material-icons.tiny chat_bubble_outline
                    | ความเห็น { pin.comments.length }

                .card-meta
                  .meta.meta-time.right { moment(pin.created_time, ['x', 'M/D/YYYY, h:mm A']).fromNow() }
                  .meta.meta-status.left(data-status='{ pin.status }') { pin.status }

              div(if='{ pin.comments && pin.comments.length > 0 }')
                .divider
                h5.section-name ความคิดเห็น
                .comment-list
                  .comment-item(each='{ comment in pin.comments }')
                    .card-description
                      .card-author
                        a(href='#user/{ comment.commented_by }') @{ comment.commented_by }
                      .card-text { comment.detail }
                      .tag-list(if='{ comment.tags && comment.tags.length > 0 }')
                        a.tag-item(each='{ tag in comment.tags }', href=('#tag/{ tag }')) { tag }
                    .card-stat
                      //- .meta.meta-like.left เห็นด้วย { comment.voter.length } คน
                      .meta.meta-like.left
                        i.icon.material-icons.tiny person
                        | { comment.voter.length } คน

    .spacing-large
  script.
    const self = this;
    /***************
     * DEFAULT
     ***************/
    self.pin = opts;
    self.slider = false;

    /***************
     * CHANGE
     ***************/

    /***************
     * RENDER
     ***************/
    self.on('mount', () => {
      // console.log('mount:', self.opts);
      riot.mount('#page-pin map-box', 'map-box', { markers_center: [ self.pin.location ] })
    });

    self.on('updated', () => {
      createPhotoSlider();
    });

    /***************
     * ACTION
     ***************/
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
