#!/bin/sh
sshfs -p 22222 -o default_permissions,IdentityFile=/home/mk/.ssh/id_rsa mkadmin@mister-k.net:/video /mnt/video
