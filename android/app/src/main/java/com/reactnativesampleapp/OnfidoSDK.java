package com.reactnativesampleapp;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.onfido.android.sdk.capture.Onfido;
import com.onfido.android.sdk.capture.ExitCode;
import com.onfido.android.sdk.capture.OnfidoConfig;
import com.onfido.android.sdk.capture.OnfidoFactory;
import com.onfido.api.client.data.Applicant;
import com.onfido.android.sdk.capture.upload.Captures;
import android.widget.Toast;

import java.util.GregorianCalendar;

public class OnfidoSDK extends ReactContextBaseJavaModule {

    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
    private static final String E_FAILED_TO_SHOW_ONFIDO = "E_FAILED_TO_SHOW_ONFIDO";
    private final Onfido client;

    private Promise mOnfidoPromise;
    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(final Activity activity, int requestCode, int resultCode, Intent data) {
            super.onActivityResult(requestCode, resultCode, data);
            client.handleActivityResult(resultCode, data, new Onfido.OnfidoResultListener() {
                @Override
                public void userCompleted(Applicant applicant, Captures captures) {
                    Toast.makeText(activity, "Flow completed!", Toast.LENGTH_SHORT).show();
                }

                @Override
                public void userExited(ExitCode exitCode, Applicant applicant) {
                    Toast.makeText(activity, "Flow cancelled!", Toast.LENGTH_SHORT).show();
                }
            });
        }
    };

    public OnfidoSDK(ReactApplicationContext reactContext) {
        super(reactContext);
        client = OnfidoFactory.create(reactContext).getClient();
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "OnfidoSDK";
    }

    @ReactMethod
    public void startSDK(final Promise promise) {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        // Store the promise to resolve/reject when picker returns data
        mOnfidoPromise = promise;

        try {
            Applicant applicant = Applicant.builder()
                    .withFirstName("React User")
                    .withLastName("Test")
                    .withDateOfBirth(new GregorianCalendar(1974, 04, 25).getGregorianChange())
                    .build();
            OnfidoConfig onfidoConfig = OnfidoConfig.builder()
                    .withApplicant(applicant)
                    .withToken("YOUR TOKEN")
                    .build();
            client.startActivityForResult(currentActivity, 1, onfidoConfig);
        }
        catch (Exception e) {
            mOnfidoPromise.reject(E_FAILED_TO_SHOW_ONFIDO, e);
            mOnfidoPromise = null;
        }
    }
}
