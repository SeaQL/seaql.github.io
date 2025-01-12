# Overview

## File Folder

All TOML config should be placed under the `pro_admin` folder by convention.

The config files are parsed on runtime and merged into one big config object, which is then served to the frontend on application start.

So these config files should be part of the application deployment, just like other static assets.

In development, we recommend reloading the config on every client request. This allows you to change the config of the admin panel on-the-fly! Simply hit "Refresh" in the browser.

In production, we recommend loading this config once-only on startup. So if you'd like to apply config changes, you don't have to rebuild the application, you can simply update the config and restart the application.