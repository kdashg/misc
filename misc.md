== Debugging gecko

=== Auto attach to process

Entrian Attach causes at least the following assert to be hit:
    MOZ_ASSERT(aPid == base::GetProcId(mChildProcessHandle));