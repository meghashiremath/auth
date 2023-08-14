//---- first auth capcha then call action control
let runVerify = async function(e) {
    //--- stop default submit action
    e.preventDefault();

    //---- create a captche toke from google
    const captchaToken =await grecaptcha.execute('reCAPTCHA_site_key', {action: 'homepage'})

    console.log(captchaToken);

    //---- checking the auth, of the captcha
    let response = await fetch('/users/captchaValidate',{
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({captcha:captchaToken})
    });

    let data = await response.json();

    if(data.success){
        document.getElementById('verify-form').submit();
    }else{
        //alert("Captcha Failed, try again");
        new Noty({
            theme: 'relax',
            text: "Captcha Failed, try again! ",
            type: 'error',
            layout: 'topRight',
            timeout: 1500
            
        }).show();
    }
}
document.getElementById('verify-form').addEventListener('submit',runVerify);