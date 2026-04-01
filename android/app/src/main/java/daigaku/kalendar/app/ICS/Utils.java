package daigaku.kalendar.app.ICS;

import java.util.Random;

public class Utils {
    private static final Random random = new Random();

    public static String randomHexColor() {
        float h = random.nextFloat() * 360f;
        float s = 0.6f + random.nextFloat() * 0.4f; // 60% → 100%
        float l = 0.35f + random.nextFloat() * 0.4f; // 35% → 75%

        int[] rgb = hslToRgb(h, s, l);

        return String.format("#%02X%02X%02X", rgb[0], rgb[1], rgb[2]);
    }

    private static int[] hslToRgb(float h, float s, float l) {
        float c = (1 - Math.abs(2 * l - 1)) * s;
        float x = c * (1 - Math.abs((h / 60f) % 2 - 1));
        float m = l - c / 2;

        float r1 = 0, g1 = 0, b1 = 0;

        if (h < 60) {
            r1 = c;
            g1 = x;
        } else if (h < 120) {
            r1 = x;
            g1 = c;
        } else if (h < 180) {
            g1 = c;
            b1 = x;
        } else if (h < 240) {
            g1 = x;
            b1 = c;
        } else if (h < 300) {
            r1 = x;
            b1 = c;
        } else {
            r1 = c;
            b1 = x;
        }

        int r = Math.round((r1 + m) * 255);
        int g = Math.round((g1 + m) * 255);
        int b = Math.round((b1 + m) * 255);

        return new int[] { r, g, b };
    }
}
