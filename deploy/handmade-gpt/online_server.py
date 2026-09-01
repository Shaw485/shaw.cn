"""Production wrapper for the verified M036 local runtime.

The signed release keeps address reuse disabled for a one-shot local desktop
process. A supervised web service must be able to bind again immediately after
an intentional restart, so this wrapper changes only that socket policy before
delegating to the verified runtime entry point.
"""

from __future__ import annotations

import app


app.DemoHTTPServer.allow_reuse_address = True


if __name__ == "__main__":
    raise SystemExit(app.main())
