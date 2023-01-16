const sendEmail = () => {
    emailjs.init('kHoitZF7nkdgZZRGX');
    let templateParams  = {
        name : document.getElementById('from_name').value,
        email : document.getElementById('email').value,
        message : document.getElementById('message').value,
    }
    console.log(templateParams);
    emailjs.send('service_ouokkk77', 'template_7tkouux', templateParams).then(function(response){
        console.log('Success!', response.status, response.text);
        setStatus('success');
    }, function(error){
        console.log('Failed...', error);
        setStatus('fail');
    })
}