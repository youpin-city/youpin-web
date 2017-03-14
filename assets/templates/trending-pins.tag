trending-pins
  .card-carousel(each='{pin in pins}')
    .card.disabled
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

        .card-meta
          .meta.meta-time.right { moment(pin.created_time).fromNow() }
          .meta.meta-status.left(data-status='{ pin.status }') { pin.status }



  script.
    const self = this;
    self.pins = [];

    self.on('mount', () => {
      self.loadTrendingPins();
    });

    self.on('updated', () => {
      // interpolate html
      const $text = $(this.root).find('.card-text');
      $text.html($text.attr('html'));
    });


    self.loadTrendingPins = () => {
      $.ajax({
        url: util.site_url('/pins?status=resolved&$limit=4&$sort=-resolved_time', app.get('service.api.url')),
        dataType: 'json'
      })
      .done(data => {
        self.pins = data.data;
        self.update();
      })
      .fail(error => {
        console.error('error:', error);
      });
    };