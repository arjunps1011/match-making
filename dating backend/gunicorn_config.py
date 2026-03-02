import multiprocessing
import os

# Balanced for stability and performance
workers = 2
worker_class = 'gevent'
worker_connections = 500
timeout = 120
keepalive = 2
max_requests = 1000
max_requests_jitter = 100
preload_app = True

# Stable connection handling
bind = f"0.0.0.0:{os.environ.get('PORT', 8000)}"
backlog = 1024
