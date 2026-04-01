package daigaku.kalendar.app.ICS;

import static android.util.Log.DEBUG;

import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;
import java.util.TreeMap;
import java.net.URI;
import java.net.URISyntaxException;
import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class ICSReader {

    public ICSReader() {

    }

    public ICSReader(String url) {
        this.URL = url;
    }

    private String[] getFileFromURL(String url_) {
        String file = "";
        if(url_.equals("")) {
            return new String[]{};
        }
        try {
            URL url = (new URI(url_)).toURL();
            BufferedInputStream bis = new BufferedInputStream(url.openStream());
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();

            int n;
            byte[] data = new byte[4096];
            while ((n = bis.read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, n);
            }

            bis.close();
            file = buffer.toString(StandardCharsets.UTF_8.name());
            file = file.replace("\\n", "\n").replaceAll("\n{2,}", "\n").trim();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return file.split("BEGIN:VEVENT");
    }

    private Date now;

    private List<Event> parseIcs(String file[], boolean do_not_pickup_pause) {
        List<Event> events = new ArrayList<>(100);

        Event e = null;
        String start = null;
        boolean not_add = false;
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'").withZone(ZoneOffset.UTC);
        for (String line : file) {
            line = line.trim();
            if (line.isEmpty() || !line.contains("DTSTART:")) continue; // ignorer le bloc avant le premier VEVENT

            start = getField(line, "DTSTART", "DTEND").trim();
            //Log.d("Debug", Arrays.toString(start.getBytes()));
            if (!sameWeek(now, Date.from(dtf.parse(start, Instant::from)))) continue;

            e = new Event();
            e.setStart(start);
            e.setEnd(getField(line, "DTEND", "SUMMARY").trim());
            e.setLocation(getField(line, "LOCATION", "DESCRIPTION").trim());
            e.setDescription(getField(line, "DESCRIPTION", "UID").trim());

            String title = getField(line, "SUMMARY", "LOCATION").trim();
            e.setTitle(title);
            if(title.equals("Pause déjeuner") && do_not_pickup_pause) {
                not_add = true;
            }
            String key = e.getTitle().split(" ")[0];
            if(!colors.containsKey(key)) {
                colors.put(key, Utils.randomHexColor());
            }
            e.setColor(colors.get(key));

            if (!not_add) {
                events.add(e);
            }
            e = null;
            not_add = false;
        }
        return events;
    }

    private String getField(String content, String fieldName, String nextFieldName) {
        int start = content.indexOf(fieldName + ":");
        int end = content.indexOf(nextFieldName + ":");
        if (start != -1 && end != -1 && end > start) {
            return content.substring(start + fieldName.length() + 1, end);
        }
        return "";
    }

    private boolean sameWeek(Date d1, Date d2) {
        ZoneId zone = ZoneId.systemDefault();

        LocalDate ld1 = d1.toInstant().atZone(zone).toLocalDate();
        LocalDate ld2 = d2.toInstant().atZone(zone).toLocalDate();

        WeekFields wf = WeekFields.of(Locale.getDefault());

        int week1 = ld1.get(wf.weekOfWeekBasedYear());
        int week2 = ld2.get(wf.weekOfWeekBasedYear());

        int year1 = ld1.get(wf.weekBasedYear());
        int year2 = ld2.get(wf.weekBasedYear());

        return week1 == week2 && year1 == year2;
    }

    public void readColor(Map<String, String> map) {
        for (Map.Entry<String, String> e : map.entrySet()) {
            colors.put(e.getKey(), e.getValue());
        }
    }
    public Map<String, String> colors = new TreeMap<>();

    private String URL = "";

    public void setURLICS(String url) {
        this.URL = url;
    }

    public List<Event> getEvents(int week_difference, boolean do_not_pickup_pause) throws IllegalAccessError {
        this.now = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(now);
        cal.add(Calendar.WEEK_OF_YEAR, week_difference);
        this.now = cal.getTime();
        return parseIcs(getFileFromURL(this.URL), do_not_pickup_pause);
    }

    public String formatDate(String date) {
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm", Locale.FRANCE);
        sdf.setTimeZone(TimeZone.getTimeZone("Europe/Paris"));
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'").withZone(ZoneOffset.UTC);
        return sdf.format(Date.from(Instant.from(dtf.parse(date))));
    }
    public Event getSoonEvent(List<Event> events) {
        Event ev = null;
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'").withZone(ZoneOffset.UTC);
        Instant now = Instant.now();//.minusSeconds(12 * 60 * 60);;
        try {
            for (Event e : events) {
                Instant timeEvent = Instant.from(dtf.parse(e.getStart()));
                LocalDate eventDate = timeEvent.atZone(ZoneOffset.UTC).toLocalDate();

                if(eventDate.equals(today) && timeEvent.isAfter(now)) {
                    if(ev == null) {
                        ev = e;
                    } else {
                        Instant evTime = Instant.from(dtf.parse(ev.getStart()));
                        if (timeEvent.isBefore(evTime)) {
                            ev = e;
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ev;
    }
}
