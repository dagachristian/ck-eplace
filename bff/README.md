# CK BFF

### Sample src/config/local.env.json

```
{
  "api": {
    "endpoint": "localhost"
  },
  "signed": {
    "cookie": {
      "secret": ["secret"]
    }
  },
  "db": {
    "host": "localhost",
    "database": "ck-api",
    "port": 5432,
    "user": "postgres",
    "password": "postgres",
    "poolMax": 10
  },
  "jwt": {
    "secret": "secret",
    "expiresIn": "24h"
  }
}
```