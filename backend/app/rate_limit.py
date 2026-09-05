from collections import defaultdict, deque
from threading import Lock
from time import monotonic

from fastapi import HTTPException, status


class SlidingWindowLimiter:
    def __init__(self, max_requests: int, window_seconds: float):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._events: dict[str, deque[float]] = defaultdict(deque)
        self._lock = Lock()

    def check_and_record(self, key: str) -> None:
        now = monotonic()
        with self._lock:
            events = self._events[key]
            while events and now - events[0] >= self.window_seconds:
                events.popleft()
            if len(events) >= self.max_requests:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="請求次數過多，請稍後再試。",
                )
            events.append(now)

    def reset(self) -> None:
        with self._lock:
            self._events.clear()


ip_otp_limiter = SlidingWindowLimiter(max_requests=10, window_seconds=3600)
otp_email_limiter = SlidingWindowLimiter(max_requests=5, window_seconds=86400)
global_otp_limiter = SlidingWindowLimiter(max_requests=200, window_seconds=86400)
