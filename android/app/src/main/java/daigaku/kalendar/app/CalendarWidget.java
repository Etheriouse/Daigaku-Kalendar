package daigaku.kalendar.app;

import static android.util.Log.DEBUG;
import static android.view.View.GONE;
import static android.view.View.VISIBLE;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.RemoteViews;

import daigaku.kalendar.app.ICS.Event;
import daigaku.kalendar.app.ICS.ICSReader;

import java.util.List;

public class CalendarWidget extends AppWidgetProvider {

    // TODO A REFAIRE AVEC LA LECTURE DU CONFIG URL + il est pas decter sur mon telephone la
    private ICSReader reader = new ICSReader();
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] widgetIds) {
        new Thread(() -> {
            reader.setURLICS("https://planning.univ-rennes1.fr/jsp/custom/modules/plannings/x3dM7mYe.shu");
            List<Event> events = reader.getEvents(0, true);
            Event e = reader.getSoonEvent(events);
            String s[] = new String[3];
            if(e != null) {
                Log.println(DEBUG, "Println", String.valueOf(e));
                Log.println(DEBUG, "Println", String.valueOf(e.getDescription()));
                s = new String[]{e.getTitle(), e.getLocation(), reader.formatDate(e.getStart()), e.getDescription()};
            }
            updateWidget(context, "Aucun événement aujourd'hui", e != null, s);
        }).start();
    }


    public static void updateWidget(Context context, String text, Boolean notNothing, String event[]) {
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        ComponentName thisWidget = new ComponentName(context, CalendarWidget.class);
        int[] appWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget);

        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_calendar);
            if(!notNothing) {
                views.setTextViewText(R.id.NoneContent, text);
                views.setViewVisibility(R.id.NoneContent, VISIBLE);
                views.setViewVisibility(R.id.EventContent, GONE);
            } else {
                views.setTextViewText(R.id.EventContentTitle, event[0]);
                views.setTextViewText(R.id.EventContentLocation, event[1]);
                views.setTextViewText(R.id.EventContentHour, event[2]);
                views.setTextViewText(R.id.EventContentDescription, event[3]);
                views.setViewVisibility(R.id.EventContent, VISIBLE);
                views.setViewVisibility(R.id.NoneContent, GONE);
            }

            Intent intent = new Intent(context, MainActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            PendingIntent pendingIntent = PendingIntent.getActivity(
                    context,
                    0,
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            views.setOnClickPendingIntent(R.id.WidgetMain, pendingIntent);


            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}
