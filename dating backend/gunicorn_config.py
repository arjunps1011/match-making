import multiprocessing

# Optimized for Render Free Tier
workers = 1
worker_class = 'sync'
worker_connections = 50
timeout = 120
keepalive = 5
max_requests = 500
max_requests_jitter = 50
preload_app = True
