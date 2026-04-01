package daigaku.kalendar.app;

import android.content.Context;
import android.util.Log;

import java.io.BufferedReader;
import java.io.File;
import com.getcapacitor.JSObject;
import com.getcapacitor.JSArray;
import com.getcapacitor.Plugin;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import daigaku.kalendar.app.ICS.Event;
import daigaku.kalendar.app.ICS.ICSReader;

import org.json.JSONException;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@CapacitorPlugin(name = "LocalBackend")
public class LocalBackend extends Plugin {

    private ICSReader reader;

    @Override
    public void load() {
        super.load();
        reader = new ICSReader(getConfigUrl());
        Log.e("PLUGIN_DEBUG", "LocalBackendPlugin chargé par Capacitor");
    }

    private void saveMapColorFile(Map<String, String> map) {
        Context context = getContext();
        JSObject j = new JSObject();
        for(Map.Entry<String, String> e : map.entrySet()) {
            j.put(e.getKey(), e.getValue());
        }
        try {
            FileOutputStream fos = context.openFileOutput("color_event.json", Context.MODE_PRIVATE);
            String jstring = j.toString();
            fos.write(jstring.getBytes("UTF-8"));
            fos.close();
        } catch (IOException  e) {
            e.printStackTrace();
        }
    }

    private Map<String, String> getMapColorFile() {
        TreeMap<String, String> map = new TreeMap<>();
        Context context = getContext();

        StringBuilder sb = new StringBuilder();
        try {
            File file = new File(context.getFilesDir(), "color_event.json");

            if (!file.exists()) {
                saveMapColorFile(map);
                return getMapColorFile(); // ou valeur par défaut
            }

            BufferedReader r = new BufferedReader(new InputStreamReader(context.openFileInput("color_event.json"), "UTF-8"));
            String line;
            while((line = r.readLine()) != null) {
                sb.append(line);
            }
            r.close();
            JSObject j = new JSObject(sb.toString());
            Iterator<String> it = j.keys();
            while(it.hasNext()) {
                String key = it.next();
                map.put(key, j.getString(key));
            }
        } catch (IOException | JSONException e) {
            e.printStackTrace();
        }
        return map;
    }

    private void saveConfigUrl(String url) {
        Context context = getContext();
        JSObject j = new JSObject();
        j.put("url", url);

        try {
            FileOutputStream fos = context.openFileOutput("config_url.json", Context.MODE_PRIVATE);
            String jstring = j.toString();
            fos.write(jstring.getBytes("UTF-8"));
            fos.close();
        } catch (IOException  e) {
            e.printStackTrace();
        }
    }

    private String getConfigUrl() {
        String url = "";
        Context context = getContext();

        StringBuilder sb = new StringBuilder();
        try {
            File file = new File(context.getFilesDir(), "config_url.json");

            if (!file.exists()) {
                return ""; // ou valeur par défaut
            }

            FileInputStream fi = context.openFileInput("config_url.json");

            BufferedReader r = new BufferedReader(new InputStreamReader(fi, "UTF-8"));
            String line;
            while ((line = r.readLine()) != null) {
                sb.append(line);
            }
            r.close();
            JSObject j = new JSObject(sb.toString());
            url = j.get("url").toString();
        } catch (IOException | JSONException e) {
            e.printStackTrace();
        }
        return url;
    }

    @PluginMethod
    public void setURL(PluginCall call) {
        String url = call.getString("url");
        saveConfigUrl(url);
        reader.setURLICS(url);
        call.resolve();
    }

    @PluginMethod
    public void getUrl(PluginCall call) {
        JSObject result = new JSObject();
        String url = getConfigUrl();
        System.out.println("-=-=-=-=-=-===========--------------------------=--=--=-=-==--=-=-=-==-=-=-=-");
        System.out.println(url);
        result.put("url", url);
        call.resolve(result);
    }

    @PluginMethod
    public void getEvents(PluginCall call) {
        int time_difference = call.getInt("time_difference");

        Map<String, String> map = getMapColorFile();

        reader.readColor(map);
        List<Event> events = reader.getEvents(time_difference, true);

        saveMapColorFile(reader.colors);

        JSArray eventsArray = new JSArray();

        for (Event e : events) {
            JSObject eventJson = new JSObject();
            eventJson.put("title", e.getTitle());
            eventJson.put("color", e.getColor());
            eventJson.put("description", e.getDescription());
            eventJson.put("location", e.getLocation());
            eventJson.put("start", e.getStart());
            eventJson.put("end", e.getEnd());
            eventsArray.put(eventJson);
        }

        JSObject result = new JSObject();
        result.put("events", eventsArray);

        call.resolve(result);
    }
}
