# Raspberry Pi Install List

## sshd

raspi-config, interface, activate ssh

## packages
sudo apt -y install nginx python3-pip tmux
sudo apt -y install samba samba-common-bin smbclient cifs-utils
sudo python3 -m pip install click
pip3 install --user youtube-dl

sudo apt -y install ffmpeg rtmpdump mplayer mpv


## nodejs
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs gcc g++ make

## nginx

* /etc/nginx


## service

* copy file to /lib/systemd/system/bbcloader-api.service
* cp 10-mk-pwless to /etc/sudoers.d/


## letsencrypt
# https://tecadmin.net/how-to-setup-lets-encrypt-on-ubuntu-20-04/
sudo snap install --classic certbot
sudo certbot --nginx
