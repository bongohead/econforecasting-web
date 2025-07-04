Description TBA

# Using PM2:
- Install pm2 globally: npm install pm2 -g
- Start application: NODE_PORT=4000 NODE_ENV=production pm2 start app.js --name <app_name>
- List: pm2 list
- To automate startup: pm2 startup (copy-paste as needed)
- Save app list to be rebooted at reboot: pm2 save
- To end automation: pm2 unstartup [run unstartup and startup after node update]
- To restart: pm2 reload

# TBD
- Add support for LLM to ping data

# CHANGELOG
## 2025-07-04 [v3.3]
- Added dynamic TZ updating
- Added minor styling improvements for Treasury curve pages
- Updated & simplified build system, support for Sass 1.89
- Updated support for DT v2.0+

## 2025-07-02 [v3.2]
- Updated variable descriptions
- Added Euribor, deprecated BSBY

## 2024-01-13 [v3.1]
- Misc styling fixes, about page, contact page

## 2024-01-03 [v3.0]
- Updated homepage UI
- Cleanup UI for forecast history

## 2023-01-23 [v2.00] (CSS Overhaul & Express Migration)
- Added rebuilt SASS styles
- Added new logo integration
- Added Express migration
- Added new REST API Oauth integration
- Added speed optimizations to load pages and better error handling
- Added reduction of JS load weight and moved variable description loads to server side
- Added new build system
- Added new Treasury docs

## 2022-12-13 [v1.04] (VPS Migration, API Integration & Misc)
- Added API v0 with JWT auth
- Added some better SCSS compilation documentation
- Added some minor fix for VPS migration
- Fixed bug caused by lack of ordering in get_forecast_values_last_vintage causing charts to not render max date correctly
- Fixed bug with Treasury forecasts not exporting table data correctly
- Moved vintage chart load to an event trigger to reduce initial page load time
- Removed ads code

## 2022-08-30 [v1.03] (Logo Update & Vintages)
- Added code for displaying forecast vintages (primary forecast)
- Cleaned up old images
- Improved build system for SCSS files
- Removed nowcast from rate forecasts
- Updated all logos to new Inkscape SVGs

## 2022-06-12 [v1.02] (Cleanup & Homepage Revamp)
- Added homepage new sections & cleanup
- Fixed Treasury yield curve summary chart bug w/date ordering, cleaned up padding & styling on chart
- Improved footer
- Updated Bootstrap to 5.2.0 and cleaned up SCSS

## 2022-05-16 [v1.01] (Minor Optimizations & Additions, Sentiment Analysis Releases)
- Added server-side meta descriptions
- Added SONIA, ESTR rate pages
- Added limit to max date on forecast chart to be bounded at max date of latest forecast
- Added sentiment analysis page
- Added sentiment analysis gauge, ts, emotion charts
- Added sentiment analysis documentation
- Fixed bug with tables not rendering correct forecast on load
- Removed client-side meta descriptions

## 2022-03-02 [v0.20 -> v1.00] (Beta Model Release Version)
- Added new SOFR forecast page
- Added new FFR forecast page
- Added new homepage w/autocomplete
- Added new centralized forecast JS template
- Added new descriptions system for varname forecasts
- Added inflation forecasts
- Added composite model forecasts
- Improved CSS styline & SCSS settings
- Improved nowcast page
- Updated BS5 to 5.1.3
- Updated minor version dependencies for Highcharts and DataTables
- Updated CMEFI logo & fixed Chrome rendering issue
- Removed most text on error page

## 2021-09-21 [v0.17] (Adding Updated Model Forecasts to Site)
- Added new import files to get data from csm_\* SQL tables
- Added scenario baseline forecast page
- Added tables & charts
- Improved styling/colors
- Updated SCSS to Bootstrap 5.1.1

## 2021-09-03 [v0.16] (Minor Update)
- Updated sitemap

## 2021-08-01 [v0.15] (Minor Bugfix)
- Fixed bug caused by missing GDP release date two quarters out

## 2021-06-24 [v0.14] (Minor Bugfix)
- Fixed broken GH pages link and replaced with local file for nowcast documentation

## 2021-05-25 [v0.13] (Updated Nowcasts with Release Calendar)
- Added data release calendar 
- Added onHover scrolling for data release calendar
- Added major data release markings on graph
- Added +1 date shift to Treasury yield forecasts
- Fixed bug with contagion index dates being a day behind
- Fixed timezone bug with charts by adding moment-timezone.js

## 2021-05-09 [v0.12] (Misc Dependencies Update)
- Updated to Bootstrap 5.0.0
- Updated to Highcharts 9.1 (added Highcharts.AST.allowedAttributes to prevent automatic HTML filtration)
- Updated to jQuery 3.6.0

## 2021-03-12 [v0.11] (Finalize Nowcast Page)
- Added data table with GDP nowcasts
- Added chart data for nowcasts
- Added event listener for button to switch between nowcast forecast dates
- Added nowcast model summary and link to detailed overview
- Added nowcast to navbar and home page

## 2021-03-08 [v0.10] (Adding Nowcast Models)
- Added PHP code to pull nowcast from SQL
- Added JS code to import nowcast data
- Added nowcast datatables code with correct ordering, indenting for GDP & subcomponents

## 2021-02-19 [v0.09] (Added Mortgage Models & inflation model)
- Added mortgage models
- Added highcharts theme consistency
- Added inflation rate forecasts
- Improved navbar multi dropdown CSS

## 2021-02-10 [v0.08] (More General Forecasts)
- Added API model for selecting all last vintage models by date
- Added SCSS compiling code for modifing Bootstrap theming
- Added some raw JS promises in lieu of old JQuery promises
- Added federal funds rate forecast chart
- Added major overhaul of homepage design
- Added nice SVG backgrounds
- Added consistent SCSS styling and replaced all inline CSS color variables
- Added consistent color pallette
- Added banners to homepage
- Added FFR forecasts, API, table, downloads, and methodology
- Added SOFR forecasts, API, table, downloads, and methodology
- Improved sidebar design & grid layout
- Fixed major bug with BS5 gutters causing horizontal overflow/scrolling on every page with a sidebar

## 2021-02-09 [v0.07] (SEO & First Forecasts)
- Added robots.txt
- Added sitemap.xml
- Added meta description
- Added individual yield curve pages, graphs, and tables
- Added Treasury yield curve pages and graphs
- Added methodology page
- Fixed toolbar color formatting
- Fixed various HTML syntax errors
- Fixed ac-regions and ac-assets table appearance on mobile
- Fixed heatmap bug caused by highcharts upgrade
- Improved frontpage CSS appearance on mobile
- Removed meta keywords

## 2021-01-29 [v0.06]
- Added description of asset contagion indices
- Added datatables of asset contagion indices
- Added CSV export of asset contagion indices
- Added temporary logo
- Improved homepage code for new data/index additions

## 2021-01-28 [v0.05]
- Added roll-change option in heatmap title
- Added code to make getAcSeriesDates() pull the dates of the series with the latest obs_start of each usage group
- Added correlation index page and chart
- Improved heatmap appearance significantly
- Improved various formatting issues related to BS5 upgrade
- Fixed bug with buttons not working correctly in heatmap

## 2021-01-28 [v0.04]
- Added Google Analytics tracking
- Updated from Bootstrap 4.5.3 to Bootstrap 5.0.0-beta1

## 2021-01-14 [v0.03]
- Added code for non-region correlation matrices
- Added in-development code for S&P 500 daily correlation extraction

## 2021-01-13 [v0.02]
- Added code for finalizing heatmap
- Added code for time-traveling heatmap
- Improved colors and styling
- Improved organization of AJAX queries


## 2021-01-11 [v0.01]
- Added code for SELECT statements for asset-correlation tables
- Added initial code for heatmap
- Added code for ordering funds from correlation matrix
- Fixed bug with additional row appearing on heatmap

## 2021-01-08 [v0.00]
- Initial upload
- Added templating system
- Updated external js links
