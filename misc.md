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

