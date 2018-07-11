## Debugging gecko

### Auto attach to process

Entrian Attach causes at least the following assert to be hit:
    MOZ_ASSERT(aPid == base::GetProcId(mChildProcessHandle));

## depot_tools

~~~
$ git cl upload
Credentials for the following hosts are required:
  -review
~~~

depot_tools is trying to infer the url of the review server and failing.
For me, this was because I originally created a local branch tracking my github repo.
This fixed it for me:

~~~
$ git config --unset branch.my_branch_name.remote
$ git config --unset branch.my_branch_name.merge
$ git config --unset branch.my_branch_name.base
$ git config --unset branch.my_branch_name.base-upstream
~~~

## Git on Windows

You basically need Git Bash, even if you choose not to use that shell.
With another shell, you'll need to use `GIT_SSH_COMMAND=/bin/ssh git` in order to get ssh-agent to work.

You can hook python up to Git Bash, but it breaks everything (failing to TTY detect?) when starting the repl.
It works fine if you start it as `python -i` though.

