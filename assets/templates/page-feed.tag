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
                  a(href='#user/{ pin.owner }') @{ pin.owner }
                .card-text(html='{ util.parse_tags(pin.detail) }')
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
                .meta.meta-time.right { moment(pin.created_time, ['x', 'M/D/YYYY, h:mm A']).fromNow() }
                .meta.meta-status.left(data-status='{ pin.status }') { pin.status }

  script.
    const self = this;
    /***************
     * DEFAULT
     ***************/
    self.title = opts.title;
    self.pins = opts.pins || [];

    /***************
     * CHANGE
     ***************/

    /***************
     * RENDER
     ***************/
     self.on('mount', () => {
      // console.log('mount:', self.opts);
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
