document.addEventListener('DOMContentLoaded', function() {


    document.querySelector('#contact-form').addEventListener('submit', function(e){
        
        e.preventDefault();

        const form = document.querySelector('#contact-form');
        const captcha_token = grecaptcha.getResponse();

        const is_recaptcha = grecaptcha && captcha_token.length !== 0;
        if (!is_recaptcha) {
            alert('Please fill out the captcha verification to proceed!')
            return;
        }

        const form_inputs = {
            email: form.querySelector('input[name="email"]').value,
            name: form.querySelector('input[name="name"]').value,
            company: form.querySelector('input[name="company"]').value,
            iama: form.querySelector('#iama').value,
            interestedin: Array.from(form.querySelectorAll('input[type=checkbox]:checked'), checkbox => checkbox.getAttribute('name')),
            inquiry: form.querySelector('textarea[id="comments"]').value
        }

        const loader_modal = new bootstrap.Modal('#loading-modal');
        const loader_el = document.querySelector('#loader-text');
        loader_el.innerHTML = `Sending message...`

        loader_modal.show();

        const await_validate = postApi(`validate_recaptcha`, body = {token: captcha_token, form_inputs: form_inputs}, 30, false)
        
        await_validate.then(function(resp) {
            const email_result = resp.success ?? 0;
            if (email_result === 1) {
                loader_el.innerHTML = `Form sent successfully. We will reach out to <b>${form_inputs.email}</b> as soon as possible.`
            } else {
                loader_el.innerHTML = `Sorry, there was an error sending your form. Try submitting the form again, or reach out directly over email.`
            }
            
            grecaptcha.reset();
            
        }).catch(function(err) {
            console.log('err', err);  
            loader_el.innerHTML = `Sorry, there was an error sending your form. Try submitting the form again, or reach out directly over email.`
            grecaptcha.reset();
        });


     });

});