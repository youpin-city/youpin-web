page-login
  #user-login-modal.modal.bottom-sheet.full-sheet
    .modal-header
      nav
        ul.left
          li
            a.modal-action.modal-close(href='#', onclick='{ clickCloseModal }')
              | ปิด
        .center
          a.brand-logo(href='#')
          .modal-title Login
        ul.right
          //- li
          //-   a(href='#!', onclick='{ clickSubmitReport }')
          //-    | ปักพิน

    .modal-content.no-padding-s
      .container.no-padding-s
    .container
      .row
        .col.s12.m8.offset-m2
          #login-box.content-padding.opaque-bg
            .row
              .col.s12.m8.offset-m2
                .site-logo.bg

                .input-field
                  a.facebook-login.btn.btn-block(href='{ login_url }')
                    | Login with Facebook

  script.
    const self = this;
    self.login_url = opts.loginUrl;

    /***************
     * ACTION
     ***************/
    function resetReportModal() {
      destroyMap();
      destroyPhotoSlider();

      self.update();
    }

    function closeReportView() {
      $('#report-saving-modal').closeModal();
      $('#report-input-modal').closeModal();
      $('#report-input-modal').removeClass('inactive');
    }


    function showLoginView() {
      self.redirect = app.current_hash || '#feed';
      if (self.redirect === '#report') self.redirect = '#feed';
      app.goto('login');
      self.update();
      // createPhotoSlider();
    }
    self.showLoginView = showLoginView;

    self.clickCloseModal = function(e) {
      e.preventDefault();
      e.stopPropagation();

      resetReportModal();
      closeReportView();

      // app.goto('feed');
      // $('#feed-tab-btn').click();
      app.goto(self.redirect);
    }
