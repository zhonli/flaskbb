# -*- coding: utf-8 -*-

from ..core.exceptions import BaseFlaskBBError

class StopNewPost(BaseFlaskBBError):
    def __init__(self, reason):
        super(StopNewPost, self).__init__(reason)
        self.reason = reason

class StopEditPost(BaseFlaskBBError):
    def __init__(self, reason):
        super(StopEditPost, self).__init__(reason)
        self.reason = reason

class StopNewTopic(BaseFlaskBBError):
    def __init__(self, reason):
        super(StopNewTopic, self).__init__(reason)
        self.reason = reason
