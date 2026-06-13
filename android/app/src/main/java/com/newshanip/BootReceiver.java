package com.newshanip;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null || !Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            return;
        }

        SharedPreferences prefs = context.getSharedPreferences(
                NewsHanipNativeModule.PREF_NAME,
                Context.MODE_PRIVATE
        );

        boolean enabled = prefs.getBoolean(NewsHanipNativeModule.KEY_NOTIFICATION_ENABLED, false);
        if (!enabled) {
            return;
        }

        int hour = prefs.getInt(NewsHanipNativeModule.KEY_NOTIFICATION_HOUR, 8);
        int minute = prefs.getInt(NewsHanipNativeModule.KEY_NOTIFICATION_MINUTE, 0);
        String title = prefs.getString(NewsHanipNativeModule.KEY_NOTIFICATION_TITLE, "뉴스한입");
        String message = prefs.getString(
                NewsHanipNativeModule.KEY_NOTIFICATION_MESSAGE,
                "오늘의 주요 뉴스를 확인해 보세요."
        );

        NewsHanipNativeModule.setDailyAlarm(context, hour, minute, title, message);
    }
}
