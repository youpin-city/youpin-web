page-error

  #page-error
    .container
      .row
        .col.s12.m6.offset-m3.l4.offset-l4

          .spacing-large

          .center
            i.icon.material-icons.title-icon { icon }
            h4.center { title }
            h5 { message }

          .spacing-large

  script.
    const self = this;
    self.title = opts.title || 'เกิดปัญหาขึ้น!';
    self.message = opts.message || 'ลองดูใหม่นะ';
    self.icon = opts.icon || 'info_outline'
