import './LoginComponent.css';
import { authentication } from '../firebase';

import { useState } from 'react';
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

function LoginComponent() {
    const [phoneNumber, setphoneNumber] = useState();
    const [otp, setOTP] = useState();
    const [isOTPSent, setIsOTPSent] = useState(false);

    const generateRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(authentication, 'recaptcha-form', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                // ...
            },
            'expired-callback': () => {
                // Response expired. Ask user to solve reCAPTCHA again.
                // ...
            }
        }, authentication);
    }
    const requestOPT = () => {
        console.log(phoneNumber);
        // if (phoneNumber.length = 12) {
        generateRecaptcha();
        let appVerifier = window.recaptchaVerifier;

        console.log(phoneNumber);
        signInWithPhoneNumber(authentication, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                setIsOTPSent(true);
                // ...
            }).catch((error) => {
                // Error; SMS not sent
                // ...
            });
        // }
    }

    const verifyOTP = () => {
        if (otp.length === 6) {
            let confirmationResult = window.confirmationResult;
            confirmationResult.confirm(otp).then((result) => {
                // User signed in successfully.
                const user = result.user;
                console.log(user);
                // ...
            }).catch((error) => {
                // User couldn't sign in (bad verification code?)
                // ...
            });
        }
    }

    signInWithPhoneNumber(authentication, phoneNumber)
        .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            // ...
        }).catch((error) => {
            // Error; SMS not sent
            // ...
        });
    return (
        <div className="form-outline main-div-login">
            <input type="text" pattern="[1-9]{1}[0-9]{9}" required id="typePhone" placeholder="Enter Phone Number" className="form-control" onChange={e => setphoneNumber(e.target.value)} />
            <button type="submit" onClick={requestOPT} className="btn btn-primary mb-2 mt-3">Submit</button>

            {isOTPSent && <div className='mt-4'>
                <input type="input" placeholder='Enter OTP'  id="typeOTP" className="form-control" onChange={e => setOTP(e.target.value)} />
                <button type="submit" onClick={verifyOTP} className="btn btn-primary mb-2 mt-3">Submit OTP</button>
            </div>
            }

            <div id='recaptcha-form'></div>
        </div>
    );
}

export default LoginComponent;
