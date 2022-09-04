## Compile - see https://getbootstrap.com/docs/5.2/customize/sass/
# 1. Download bootstrap source from https://getbootstrap.com/docs/5.2/getting-started/download/#package-managers
#    and place all contents of scss/* dir in a directory here called bootstrap/libs.
# 2. Now run this file. Note that bootstrap imports are located in _bootstrap.scss; your custom SCSS in _custom.scss;
#    main.scss just combines these.
sass main.scss ../public/static/style.css
