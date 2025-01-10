# Västtrafik Lovelace card

This is a custom card for Home Assistant that displays Västtrafik time table for a specific stop. Just like you were standing in the rain watching the time table screen, but from the comfort of your home.

## Deployment with FTP

### Install and configure the [Home Assistant FTP add-on](https://my.home-assistant.io/redirect/supervisor_addon/?addon=a0d7b954_ftp&repository_url=https%3A%2F%2Fgithub.com%2Fhassio-addons%2Frepository)

In the add-on configuration, create a username and password for the FTP server. Also, make sure `config`and `allow_upload` are set to `true`.

``` yaml
# Example add-on configuration
log_level: info
port: 21
data_port: 20
banner: Welcome to the Hass.io FTP service.
pasv: true
pasv_min_port: 30000
pasv_max_port: 30010
pasv_address: ""
ssl: false
certfile: fullchain.pem # Only required if ssl is true
keyfile: privkey.pem # Only required if ssl is true
implicit_ssl: false
max_clients: 5
users:
  - username: hassio
    password: changeme
    allow_chmod: true
    allow_download: true
    allow_upload: true
    allow_dirlist: true
    addons: false
    backup: true
    config: true
    media: true
    share: true
    ssl: false
```

### Add to FTP credentials `~/.netrc` file in your home directory

``` .netrc
machine HOMEASSISTANT_IP
  login HOMEASSISTANT_FTP_USERNAME
  password HOMEASSISTANT_FTP_PASSWORD
```

### Run the `deploy.sh` script

``` bash
# chmod +x deploy.sh
./deploy.sh
```
