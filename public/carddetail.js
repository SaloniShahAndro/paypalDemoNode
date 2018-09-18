braintree.client.create({
    authorization: 'sandbox_gnqqzn2m_s7v27h9jmgtdfj9m'
  }, function(err, clientInstance) {
    if (err) {
      console.error(err);
      return;
    }
  
    braintree.hostedFields.create({
      client: clientInstance,
      styles: {
        'input': {
          'font-size': '16px',
          'font-family': 'roboto, verdana, sans-serif',
          'font-weight': 'lighter',
          'color': 'black'
        },
        ':focus': {
          'color': 'black'
        },
        '.valid': {
          'color': 'black'
        },
        '.invalid': {
          'color': 'black'
        }
      },
      fields: {
        number: {
          selector: '#card-number',
          placeholder: '1111 1111 1111 1111'
        },
        cvv: {
          selector: '#cvv',
          placeholder: '111'
        },
        expirationDate: {
          selector: '#expiration-date',
          placeholder: 'MM/YY'
        },
        postalCode: {
          selector: '#postal-code',
          placeholder: '11111'
        }
      }
    }, function(err, hostedFieldsInstance) {
      if (err) {
        console.error(err);
        return;
      }
      
      function findLabel(field) {
        return $('.hosted-field--label[for="' + field.container.id + '"]');
      }
  
      hostedFieldsInstance.on('focus', function (event) {
        var field = event.fields[event.emittedBy];
        
        findLabel(field).addClass('label-float').removeClass('filled');
      });
      
      // Emulates floating label pattern
      hostedFieldsInstance.on('blur', function (event) {
        var field = event.fields[event.emittedBy];
        var label = findLabel(field);
        
        if (field.isEmpty) {
          label.removeClass('label-float');
        } else if (field.isValid) {
          label.addClass('filled');
        } else {
          label.addClass('invalid');
        }
      });
      
      hostedFieldsInstance.on('empty', function (event) {
        var field = event.fields[event.emittedBy];
  
        findLabel(field).removeClass('filled').removeClass('invalid');
      });
      
      hostedFieldsInstance.on('validityChange', function (event) {
        var field = event.fields[event.emittedBy];
        var label = findLabel(field);
  
        if (field.isPotentiallyValid) {
          label.removeClass('invalid');
        } else {
          label.addClass('invalid');  
        }
      });
  
      $('#cardForm').submit(function (event) {
        event.preventDefault();
        hostedFieldsInstance.tokenize(function (err, payload) {
          if (err) {
            console.error(err);
            return;
          }
          console.log(">>payload>>",payload)
          // This is where you would submit payload.nonce to your server
          console.log(">>payload nonce>>",payload.nonce)


          $.ajax({
            type: 'POST',
            url: '/checkout',
            data: {'paymentMethodNonce': payload.nonce}
          }).done(function(result) {
            
            if (result.success) {
              console.log("success",result.transaction.status)
              window.location.href = "/data/"+result.transaction.status
              //$('#checkout-message').html('<h1>Success</h1><p>Your Drop-in UI is working! Check your <a href="https://sandbox.braintreegateway.com/login">sandbox Control Panel</a> for your test transactions.</p><p>Refresh to try another transaction.</p>');
            } else {
              console.log(result.message);
              window.location.href = "/data/"+result.message
              //$('#checkout-message').html('<h1>Error</h1><p>Check your console.</p>');
            }
          });
        });
      });
    });
  });