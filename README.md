# Västtrafik Lovelace Card

A [Home Assistant Dashboard Card](https://www.home-assistant.io/dashboards/) showing real-time departures from Västtrafik public transit stops in western Sweden. Just like standing at the stop watching the departure board, but from the comfort of your home.

## Configuration

### Minimal Configuration

```yaml
type: custom:vasttrafik-lovelace-card
stop_name: Brunnsparken
client_id: your_vasttrafik_client_id
client_secret: your_vasttrafik_client_secret
```

### Full Configuration

```yaml
type: custom:vasttrafik-lovelace-card
stop_name: Brunnsparken
gid: "9021014001760000"
client_id: your_vasttrafik_client_id
client_secret: your_vasttrafik_client_secret
time_table_height: 250
limit: 50
refresh_interval: 60
```

### Options

| Name | Type | Requirement | Description | Default |
| ---- | ---- | ----------- | ----------- | ------- |
| `type` | string | **Required** | `custom:vasttrafik-lovelace-card` | |
| `stop_name` | string | **Required*** | Name of the stop area (e.g. `Brunnsparken`). Used to look up departures. | `''` |
| `gid` | string | Optional | The 16-digit Västtrafik GID for the stop area. If provided, overrides `stop_name`. | `''` |
| `client_id` | string | **Required** | Your Västtrafik API Client ID. See [Getting API Credentials](#getting-api-credentials). | |
| `client_secret` | string | **Required** | Your Västtrafik API Client Secret. See [Getting API Credentials](#getting-api-credentials). | |
| `time_table_height` | number | Optional | Height of the departure table in pixels. | `250` |
| `limit` | number | Optional | Maximum number of departures to fetch from the API. | `50` |
| `refresh_interval` | number | Optional | How often to refresh departures, in seconds. See [Rate Limits](#rate-limits). | `60` |

\* Either `stop_name` or `gid` is required. If both are provided, `gid` takes precedence.

### Rate Limits

The Västtrafik API has an unknown monthly rate limit. A refresh interval of 60 seconds or more is known to work fine. Setting a lower value may cause you to hit the rate limit.

### Getting API Credentials

1. Go to [Västtrafik Developer Portal](https://developer.vasttrafik.se/)
2. Create an account or sign in
3. Create a new application to get your Client ID and Client Secret
4. Subscribe your application to the "Planera Resa v4" API

## Installation

### Manual Installation

1. Download `vasttrafik-lovelace-card.js` from the [latest release](https://github.com/your-username/vasttrafik-lovelace-card/releases/latest).
2. Place the file in your Home Assistant's `config/www` folder.
3. Add the resource to your Lovelace configuration:

```yaml
resources:
  - url: /local/vasttrafik-lovelace-card.js
    type: module
```

1. Add the card configuration to your dashboard.

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
