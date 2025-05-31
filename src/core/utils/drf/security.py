def security_settings(env):
  # Security middleware settings
  return {
    'SECURE_SSL_REDIRECT' : env.get('prod'), # Redirects all HTTP requests to HTTPS. (only in prod)
    'SESSION_COOKIE_SECURE' : env.get('prod'), # Ensures session cookies are only sent over HTTPS. Prevents cookie theft via man-in-the-middle (MITM) attacks in production. (only in prod)
    'CSRF_COOKIE_SECURE' : env.get('prod'), # Like above, ensures CSRF cookies are only sent over HTTPS. Strengthens CSRF protection in production.(only in prod)
    'SECURE_BROWSER_XSS_FILTER' : True, # Adds X-XSS-Protection: 1; mode:block to HTTP headers . Tells the browser to block the page if a potential XSS attack is detected.
    'SECURE_CONTENT_TYPE_NOSNIFF' : True, # Adds X-Content-Type-Options: nosniff to prevent MIME type sniffing.  Stops browsers from guessing file types, which could lead to executing malicious content.
    'X_FRAME_OPTIONS' : 'DENY', # Prevents your site from being embedded in an <iframe>. Blocks clickjacking attacks.
    'SECURE_HSTS_SECONDS' : 31536000 if env.get('prod') else 0,  #  Enables HTTP Strict Transport Security (HSTS) for 1 year in production. Enforces HTTPS by instructing the browser to never make unencrypted requests again.
    'SECURE_HSTS_INCLUDE_SUBDOMAINS' : env.get('prod'), #  Applies HSTS to all subdomains as well. Ensures *.yourdomain.com also uses HTTPS only.
    'SECURE_HSTS_PRELOAD' : env.get('prod'), # Ensures *.yourdomain.com also uses HTTPS only. Prevents even the first HTTP request from being made.
    'SECURE_PROXY_SSL_HEADER' : ('HTTP_X_FORWARDED_PROTO', 'https') #Tells Django to trust the proxy (e.g., Nginx, load balancer) that sets X-Forwarded-Proto: https. Ensures Django knows whether the request was made over HTTPS behind a reverse proxy.
  }

