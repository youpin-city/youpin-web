page-feed

  #page-feed
    .container.no-padding-s
      .spacing
      h5.center(if='{ title }') { title }
      .row
        .col.s12.m6.l4(each='{ pin in pins }')
          .card.hover-card
            a.card-image(href='#pins/{ pin._id }{ pin.mock ? "?mock=1" : "" }', style='background-image: url({ pin.photos && pin.photos.length > 0 ? pin.photos[0] : util.site_url("/public/image/pin_photo.png") });')
            .card-content
              .card-description
                .card-author
                  strong(data-url='#user/{ _.get(pin, "owner._id") }') @{ _.snakeCase(_.get(pin, 'owner.name')) }
                  //- a(href='#user/{ pin.owner }') @{ pin.owner }
                .card-text(html='{ util.parse_tags(pin.detail) }')
                .tag-list(if='{ pin.categories && pin.categories.length > 0 }')
                  a.tag-item(each='{ cat in pin.categories }', href=('#tags/{ cat }')) {cat}
                //- .tag-list(if='{ pin.tags && pin.tags.length > 0 }')
                //-   a.tag-item(each='{ tag in pin.tags }', href=('#tag/{ tag }')) {tag}
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

      .center
        button.btn.waves-effect.waves-light.white.light-blue-text(if='{ has_more && !is_loading }', type='button', onclick='{ clickLoadMore }')
          i.icon.material-icons.light-blue-text expand_more
          | โหลดเพิ่ม
        preloader(if='{ is_loading }', class='small')

      .spacing-large

  script.
    const self = this;
    /***************
     * DEFAULT
     ***************/
    self.title = opts.title;
    self.pins = opts.pins || [];
    self.has_more = false;
    self.skip = 0;
    self.limit = 30;
    self.query = opts.query || {};

    self.is_loading = false;

    /***************
     * CHANGE
     ***************/

    /***************
     * RENDER
     ***************/
     self.on('mount', () => {
      // console.log('mount:', self.opts);
      loadNext();
     });
     self.on('updated', () => {
      // interpolate html
      $(self.root).find('.card-text').each((i, el) => {
        const $text = $(el);
        $text.html($text.attr('html'));
      });
     });

    /***************
     * ACTION
     ***************/
    function loadNext() {
      app.busy();
      self.is_loading = true;
      $.ajax({
        url: util.site_url('/pins', app.get('service.api.url')),
        data: _.assign({
          $sort: '-created_time',
          owner: app.get('user._id')
        }, self.query, {
          $skip: self.skip,
          $limit: self.limit
        })
      })
      .done(function(data) {
        var new_pins = data.data || [];
        self.skip += Math.min(new_pins.length, self.limit);
        self.has_more = new_pins.length >= self.limit;
        self.pins = self.pins.concat(new_pins);
      })
      .always(function() {
        self.is_loading = false;
        app.busy(false);
        self.update();
      });
    }

    self.clickLoadMore = function(e) {
      loadNext();
    }
