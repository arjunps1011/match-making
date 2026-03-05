import multiprocessing
import os

# Optimized for performance
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'gevent'
worker_connections = 1000
timeout = 60
keepalive = 5
max_requests = 2000
max_requests_jitter = 200
preload_app = True

# Performance optimizations
bind = f"0.0.0.0:{os.environ.get('PORT', 8000)}"
backlog = 2048
max_worker_memory = 200  # MB
worker_tmp_dir = '/dev/shm'  # Use RAM for temp files
