page-pin

  #page-pin
    .fluid-container.no-padding-s
      .row
        .col.s12.m6.offset-m6
          .spacing
          .card
            .card-image(if='{ pin.photos.length === 0 }', href='#pins/{ pin._id }', style='background-image: url({ util.site_url("/public/image/pin_photo.png") });')
            .card-image.responsive(if='{ pin.photos.length > 0 }')
              .slider-container
                #photo-slider.image-slider
                  .slider-item(each='{ photo in pin.photos }')
                    .image-item
                      .image(style='background-image: url("{ util.site_url(photo) }");')

            .card-content

              .pin-content

                .card-description
                  .card-author
                    strong(data-url='#user/{ pin.owner }') @{ app.get('app_user.name').toLowerCase() }
                    //- a(href='#user/{ pin.owner }') @{ pin.owner }
                  .card-text(html='{ util.parse_tags(pin.detail) }')
                  .tag-list(if='{ pin.categories && pin.categories.length > 0 }')
                    a.tag-item(each='{ cat in pin.categories }', href=('#tags/{ cat }')) {cat}
                  //- .card-area(if='{ pin.neighborhood }') ย่าน{ pin.neighborhood }

                //- .card-stat
                  .meta.meta-like.left
                    //- i.icon.material-icons.tiny thumb_up
                    | เห็นด้วย { pin.voters.length } คน
                  .meta.meta-comment.left
                    i.icon.material-icons.tiny chat_bubble_outline
                    | ความเห็น { pin.comments.length }

                .card-meta
                  .meta.meta-time.right { moment(pin.created_time).fromNow() }
                  .meta.meta-status.left(data-status='{ pin.status }') { pin.status }

              div(if='{ pin.comments && pin.comments.length > 0 }')
                .divider
                h5.section-name ความคิดเห็น
                .comment-list
                  .comment-item(each='{ comment in pin.comments }')
                    .card-description
                      .card-author
                        a(href='#user/{ comment.commented_by }') @{ comment.commented_by }
                      .card-text(html='{ util.parse_tags(comment.detail) }')
                      //- .tag-list(if='{ comment.tags && comment.tags.length > 0 }')
                      //-   a.tag-item(each='{ tag in comment.tags }', href=('#tag/{ tag }')) { tag }
                    //- .card-stat
                      //- .meta.meta-like.left เห็นด้วย { comment.voter.length } คน
                      .meta.meta-like.left
                        i.icon.material-icons.tiny person
                        | { comment.voter.length } คน

    .map-container
      map-box(pin-clickable='false', options-zoom='17', options-scroll-wheel-zoom='false', options-tap='false', options-keyboard='false')

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
      riot.mount('#page-pin map-box', 'map-box', { pins: [ self.pin ] })
    });

    self.on('updated', () => {
      // interpolate html
      const $text = $(this.root).find('.card-text');
      $text.html($text.attr('html'));

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
