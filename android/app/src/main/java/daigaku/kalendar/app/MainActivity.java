package daigaku.kalendar.app;

import android.os.Bundle;
import android.util.Log;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {

        // Bridge automatic registration usually works
        registerPlugin(LocalBackend.class);
        Log.e("PLUGIN_DEBUG", "LocalBackendPlugin enregistré");

        super.onCreate(savedInstanceState);
    }
}
