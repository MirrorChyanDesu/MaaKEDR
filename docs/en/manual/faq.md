---
order: 2
icon: ph:question-fill
---

# FAQ

## Installation & Download

### What do the filenames mean?

MaaKEDR release archives are named as:

```
MaaKEDR-<os>-<arch>-<version>-<frontend>.<ext>
```

For example, `MaaKEDR-win-x86_64-v1.0.2-MFAA.zip`:

- **OS**: `win` (Windows)
- **Arch**: `x86_64` (64-bit Intel/AMD)
- **Version**: `v1.0.2`
- **Frontend**: `MFAA` (GUI, requires .NET)
- **Extension**: `zip`

### Slow download speed?

GitHub download speeds vary. Try:

- Using a mirror proxy like [ghproxy](https://ghproxy.com/)
- Check the MaaKEDR community group for backup links (see `CONTACT` file)

---

## Crashes

### Missing DLL error (e.g. `VCRUNTIME140.dll`)

VCRedist is not installed. Download and install [vc_redist.x64.exe](https://aka.ms/vs/17/release/vc_redist.x64.exe).

### MFAA does not start or shows .NET errors

.NET Desktop Runtime is not installed. Download from the [.NET download page](https://dotnet.microsoft.com/download/dotnet).

### App crashes without an error message

Check `debug/maafw.log` for details. Common causes:

- Path contains non-ASCII characters or spaces → move to a plain English path
- Incomplete extraction → re-extract
- Antivirus deleted files → add an exclusion

### MXU is slow or shows a black screen

Update your GPU drivers. Try switching the rendering mode in MXU settings.

---

## Connection

### Emulator not auto-detected

- Make sure ADB debugging is enabled in your emulator
- Ensure only one emulator instance is running
- Try clicking "Refresh"
- Confirm the resolution is set to 1280x720 (landscape)

### How to configure manually?

Click "Customize" in the connection panel. Default ADB ports:

| Emulator     | Default ADB Address |
| :----------- | :------------------ |
| MuMu 12      | `127.0.0.1:16384`   |
| BlueStacks 5 | `127.0.0.1:5555`    |
| LDPlayer 9   | `127.0.0.1:5555`    |
| NoxPlayer    | `127.0.0.1:62001`   |

### Connected but tasks don't run

- Verify the game is installed and updated
- Confirm the correct resource type (Official/Bilibili/TapTap) is selected
- Check screenshots in `debug/` for recognition accuracy

---

## Task Execution

### Agent startup timeout

First launch requires downloading Python dependencies, which may take a while. Do not click "Stop". If it times out repeatedly:

- Check your network connection
- Verify the mirror in `config/pip_config.json` is accessible

### Tasks not running as expected

- Confirm the task is enabled (checkbox checked)
- Read each task's description and configure options accordingly
- Ensure the game is on the correct screen (main menu or target feature)
- Review `debug/maafw.log` for details

### Farm resources stage list is incomplete

Only preset stages are included. To add more stages, refer to the Pipeline guide in the developer documentation.

---

## Miscellaneous

### Where are the logs?

Logs: `debug/maafw.log`. Screenshots: `debug/` directory. Include these files when reporting issues.

### How to update MaaKEDR?

MaaKEDR supports in-app updates. In the software settings, select **GitHub** as the update source, then click "Check for Updates" to automatically download and install the latest version.

For manual updates: download the latest release, extract to a new directory, then copy your old `config/` folder to the new directory to keep your settings.
