

## NPM installation:
curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh

## Using PM2:
# https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-22-04
# https://node-postgres.com/features/queries
# https://www.loginradius.com/blog/engineering/hashing-user-passwords-using-bcryptjs/
- Install pm2 globally: npm install pm2 -g
- Start application: pm2 start app.js
- List: pm2 list
- To automate startup: pm2 startup (copy-paste as needed)
- Save app list to be rebooted at reboot: pm2 save
- To end automation: pm2 unstartup [run unstartup and startup after node update]