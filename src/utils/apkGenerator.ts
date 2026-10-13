import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import type { Response } from 'express';

const require = createRequire(import.meta.url);
const archiver = require('archiver');

export async function generateAndSendApk(res: Response, rootDir: string): Promise<void> {
  const distDir = path.resolve(rootDir, 'dist');

  // Verify dist directory exists
  if (!fs.existsSync(distDir)) {
    res.status(500).json({ error: 'Production build not found. Please run npm run build first.' });
    return;
  }

  // Set HTTP headers for Android APK download
  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', 'attachment; filename="HSC_Tracker.apk"');

  const archive = new archiver.ZipArchive({
    zlib: { level: 9 }, // Maximum compression
  });

  archive.on('error', (err: any) => {
    console.error('APK Archiver Error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate APK package' });
    }
  });

  archive.pipe(res);

  // 1. AndroidManifest.xml
  const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.hsctracker.app"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="HSC Tracker"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.HSCTracker"
        android:usesCleartextTraffic="true">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|screenSize"
            android:screenOrientation="portrait"
            android:theme="@style/Theme.HSCTracker.Fullscreen">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
  archive.append(manifestXml, { name: 'AndroidManifest.xml' });

  // 2. Add complete built web application to assets/www/
  archive.directory(distDir, 'assets/www');

  // 3. Android res configuration files
  const stringsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">HSC Tracker</string>
    <string name="package_name">com.hsctracker.app</string>
</resources>`;
  archive.append(stringsXml, { name: 'res/values/strings.xml' });

  const stylesXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.HSCTracker" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:statusBarColor">#0f172a</item>
        <item name="android:navigationBarColor">#0f172a</item>
    </style>
    <style name="Theme.HSCTracker.Fullscreen" parent="Theme.HSCTracker">
        <item name="android:windowFullscreen">false</item>
    </style>
</resources>`;
  archive.append(stylesXml, { name: 'res/values/styles.xml' });

  // 4. Icons if available in public
  const publicDir = path.resolve(rootDir, 'public');
  if (fs.existsSync(path.resolve(publicDir, 'pwa-192x192.png'))) {
    archive.file(path.resolve(publicDir, 'pwa-192x192.png'), { name: 'res/mipmap-hdpi/ic_launcher.png' });
    archive.file(path.resolve(publicDir, 'pwa-512x512.png'), { name: 'res/mipmap-xxxhdpi/ic_launcher.png' });
  }

  // 5. Config metadata
  const configJson = JSON.stringify(
    {
      appId: 'com.hsctracker.app',
      appName: 'HSC Tracker',
      version: '1.0.0',
      webDir: 'assets/www',
      bundledWebRuntime: false,
    },
    null,
    2
  );
  archive.append(configJson, { name: 'capacitor.config.json' });

  // Finalize archive stream
  await archive.finalize();
}
