package com.newshanip;

import android.Manifest;
import android.app.Activity;
import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Calendar;

public class NewsHanipNativeModule extends ReactContextBaseJavaModule {
    public static final String MODULE_NAME = "NewsHanipNative";
    public static final String PREF_NAME = "news_hanip_pref";
    public static final String KEY_NOTIFICATION_ENABLED = "notification_enabled";
    public static final String KEY_NOTIFICATION_HOUR = "notification_hour";
    public static final String KEY_NOTIFICATION_MINUTE = "notification_minute";
    public static final String KEY_NOTIFICATION_TITLE = "notification_title";
    public static final String KEY_NOTIFICATION_MESSAGE = "notification_message";
    public static final String CHANNEL_ID = "news_hanip_morning_channel";
    private static final int REQUEST_NOTIFICATION_PERMISSION = 2301;
    private static final int DAILY_NOTIFICATION_REQUEST = 5901;

    private final ReactApplicationContext reactContext;

    public NewsHanipNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        createNotificationChannel(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void saveString(String key, String value, Promise promise) {
        try {
            SharedPreferences prefs = reactContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
            prefs.edit().putString(key, value).apply();
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("SAVE_FAILED", e);
        }
    }

    @ReactMethod
    public void getString(String key, Promise promise) {
        try {
            SharedPreferences prefs = reactContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
            String value = prefs.getString(key, null);
            promise.resolve(value);
        } catch (Exception e) {
            promise.reject("READ_FAILED", e);
        }
    }

    @ReactMethod
    public void requestNotificationPermission(Promise promise) {
        try {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
                promise.resolve(true);
                return;
            }
            Activity activity = getCurrentActivity();
            if (activity == null) {
                promise.resolve(false);
                return;
            }
            if (ContextCompat.checkSelfPermission(activity, Manifest.permission.POST_NOTIFICATIONS)
                    == PackageManager.PERMISSION_GRANTED) {
                promise.resolve(true);
                return;
            }
            ActivityCompat.requestPermissions(
                    activity,
                    new String[]{Manifest.permission.POST_NOTIFICATIONS},
                    REQUEST_NOTIFICATION_PERMISSION
            );
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("PERMISSION_FAILED", e);
        }
    }

    @ReactMethod
    public void scheduleDailyNotification(int hour, int minute, String title, String message, Promise promise) {
        try {
            Context context = reactContext.getApplicationContext();
            saveNotificationPref(context, true, hour, minute, title, message);
            setDailyAlarm(context, hour, minute, title, message);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("SCHEDULE_FAILED", e);
        }
    }

    @ReactMethod
    public void cancelDailyNotification(Promise promise) {
        try {
            Context context = reactContext.getApplicationContext();
            SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
            prefs.edit().putBoolean(KEY_NOTIFICATION_ENABLED, false).apply();

            AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            PendingIntent pendingIntent = getNotificationPendingIntent(
                    context,
                    8,
                    0,
                    "뉴스한입",
                    "오늘의 주요 뉴스를 확인해 보세요."
            );
            if (alarmManager != null) {
                alarmManager.cancel(pendingIntent);
            }
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("CANCEL_FAILED", e);
        }
    }

    @ReactMethod
    public void openUrl(String url, Promise promise) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.startActivity(intent);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("OPEN_URL_FAILED", e);
        }
    }

    @ReactMethod
    public void openAppNotificationSettings(Promise promise) {
        try {
            Intent intent = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            intent.putExtra(Settings.EXTRA_APP_PACKAGE, reactContext.getPackageName());
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.startActivity(intent);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("OPEN_SETTINGS_FAILED", e);
        }
    }

    public static void saveNotificationPref(
            Context context,
            boolean enabled,
            int hour,
            int minute,
            String title,
            String message
    ) {
        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        prefs.edit()
                .putBoolean(KEY_NOTIFICATION_ENABLED, enabled)
                .putInt(KEY_NOTIFICATION_HOUR, hour)
                .putInt(KEY_NOTIFICATION_MINUTE, minute)
                .putString(KEY_NOTIFICATION_TITLE, title)
                .putString(KEY_NOTIFICATION_MESSAGE, message)
                .apply();
    }

    public static void setDailyAlarm(Context context, int hour, int minute, String title, String message) {
        createNotificationChannel(context);
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) {
            return;
        }

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, hour);
        calendar.set(Calendar.MINUTE, minute);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);

        if (calendar.getTimeInMillis() <= System.currentTimeMillis()) {
            calendar.add(Calendar.DAY_OF_YEAR, 1);
        }

        PendingIntent pendingIntent = getNotificationPendingIntent(context, hour, minute, title, message);
        alarmManager.setInexactRepeating(
                AlarmManager.RTC_WAKEUP,
                calendar.getTimeInMillis(),
                AlarmManager.INTERVAL_DAY,
                pendingIntent
        );
    }

    private static PendingIntent getNotificationPendingIntent(
            Context context,
            int hour,
            int minute,
            String title,
            String message
    ) {
        Intent intent = new Intent(context, NotificationReceiver.class);
        intent.putExtra("title", title);
        intent.putExtra("message", message);
        intent.putExtra("hour", hour);
        intent.putExtra("minute", minute);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        return PendingIntent.getBroadcast(context, DAILY_NOTIFICATION_REQUEST, intent, flags);
    }

    public static void createNotificationChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager notificationManager =
                    (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (notificationManager == null) {
                return;
            }
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "뉴스한입 아침 알림",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            channel.setDescription("매일 아침 뉴스 요약을 알려주는 알림입니다.");
            notificationManager.createNotificationChannel(channel);
        }
    }
}
