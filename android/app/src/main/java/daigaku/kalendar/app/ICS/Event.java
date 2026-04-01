package daigaku.kalendar.app.ICS;

public class Event {

    private String title;
    private String location;
    private String description;
    private String start;
    private String end;
    private String color;

    public Event() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getEnd() {
        return end;
    }

    public void setEnd(String end) {
        this.end = end;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public void clear() {
        this.start = "";
        this.end = "";
        this.color = "";
        this.title = "";
        this.location = "";
        this.description = "";
    }

    @Override
    public String toString() {
        return String.format("title: %s\nlocation: %s\ndescription: %s\nstart: %s\nend: %s\ncolor: %s\n", title,
                location, description, start, end, color);
    }

}
