# Shared Server

## Synology NAS Shared Storage

The company uses Synology NAS devices to provide centralized file storage and sharing services.

### Key Features

- **File Sharing**: Supports SMB/CIFS, NFS, AFP and other protocols
- **Permission Management**: Granular access control based on users and groups
- **Remote Access**: Secure access via QuickConnect or VPN
- **Data Backup**: Automatic backup of critical data to prevent data loss
- **Collaboration**: Synology Drive enables team file collaboration

### Access Methods

#### Windows
1. Open File Explorer
2. Enter `\\NAS-address\shared-folder` in the address bar
3. Enter username and password to log in

#### macOS
1. Finder → Go → Connect to Server
2. Enter `smb://NAS-address/shared-folder`
3. Enter credentials to connect

### FAQ

::: tip Unable to Connect
Check that your network connection is working and the NAS device is powered on and reachable.
:::

::: warning Insufficient Permissions
If you see a permission error, please contact the administrator to verify your account permissions.
:::
