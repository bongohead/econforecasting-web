## Compile - see https://getbootstrap.com/docs/5.3/customize/sass/
# - Download bootstrap source from https://getbootstrap.com/docs/5.3/getting-started/download/#package-managers
#    and place all contents of scss/* dir in a directory here called bootstrap/libs.
# - Now run this file. Note that bootstrap imports are located in _bootstrap.scss; your custom SCSS in _custom.scss;
#    main.scss just combines these.
# - Timestamp is built at the BOTTOM of the CSS file
export PATH="$HOME/.local/bin:$PATH"
sass --silence-deprecation=import --silence-deprecation=global-builtin --silence-deprecation=color-functions --silence-deprecation=mixed-decls --silence-deprecation=abs-percent ./main.scss ../web/static/css/style.css
echo "/* Built at $(date '+%Y-%m-%d %H:%M:%S') */" >> ../web/static/css/style.css