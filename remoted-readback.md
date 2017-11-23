With reasonable optimizations, readback from GLBuffers can be efficient even on remoting implementations.

## GLServer

~~~
func GLServer.ReadPixels(PBO x):
    glReadPixels(x.id)
    BufferDataModified(x)


func GLServer.BufferDataModified(x):
    switch x.usage:
        case DYNAMIC_READ:
        case STATIC_READ:
        case STREAM_READ:
            break
        default:
            return

    self.nextSyncPointToEnqueue.callbacks.add(new DeferredReadback(x))


func GLServer.FenceSync():
    x = new FenceSync(glFenceSync())

    self.nextSyncPointToEnqueue.callbacks.add(new NotifyClientThatFencePassed(x))

    x.syncPoint = self.nextSyncPointToEnqueue
    self.nextSyncPointToEnqueue = new SyncPoint()
    x.syncPoint.next = self.nextSyncPointToEnqueue

    return x


func GLServer.PollSync(x, block):
    if x.isPassed:
        return true

    while self.lastPassedSyncPoint.next:
        id = self.lastPassedSyncPoint.next.id
        if block:
            glWaitSync(id)
        else if !glPollSync(id):
            return false

        self.lastPassedSyncPoint = self.lastPassedSyncPoint.next
        self.lastPassedSyncPoint.isPassed = true
        for y in self.lastPassedSyncPoint.callbacks:
            y.DoCallback()

        if self.lastPassedSyncPoint == x:
            return true
    ASSERT_UNREACHABLE()
~~~

## GLClient

~~~
func GLClient.GetBufferSubData(x):
    switch x.usage:
        case DYNAMIC_READ:
        case STATIC_READ:
        case STREAM_READ:
            if x.hasShmem:
                return x.GetShmem()
            Warning("Asking for readback without waiting to the command to complete is bad.")
            break

        default:
            Warning("Asking for readback from a non-_READ-usage buffer is bad.")
            break

    return server.SyncGetBufferSubData(x)
~~~