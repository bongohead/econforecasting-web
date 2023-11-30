// @ts-nocheck
import { Router } from 'express';
import { concat_js } from '../middleware.js';
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let forecast_router = Router();

// Set basic routes
const libs =
    [
        'jquery/jquery',
        'dt/jquery.dataTables', 'dt/dataTables.bootstrap5', 'dt/dataTables.buttons', 'dt/buttons.html5',
        'dayjs/dayjs', 'dayjs/timezone', 'dayjs/utc', 'dayjs/minmax', 'dayjs/advancedformat',
        'hc/highstock', 'hc/highcharts-more', 'hc/modules/accessibility',
        'bootstrap/bootstrap', 'gradient/gradient', 
    ].map(f => `libs/${f}`)
    .concat(['helpers'])
    .concat(['forecast'])

forecast_router.get('/:varname', concat_js('forecast.js', libs), async (req, res, next) => {

    const varname = String(req.params.varname);

    try {

        const data = await fs.promises.readFile(path.join(__dirname, '..', '..', 'views', 'forecasts', 'forecast_varnames.json'), 'utf8');
        const fdata  = await fs.promises.readFile(path.join(__dirname, '..', '..', 'views', 'forecasts', 'forecast_descriptions.json'), 'utf8');

        const varname_data = JSON.parse(data).filter(d => d.varname === varname)[0];
        if (varname_data == null) {
            res.redirect('/404');
        }
        const forecast_descriptions = JSON.parse(fdata);

        const secondary_forecasts_description = varname_data.secondary_forecasts.map(f => forecast_descriptions[f]).join('\n');

        res.render('forecast.html.twig', {
            site: process.env.SITE,
            title: varname_data.fullname + ' | Macropredictions.com',
            description: varname_data.meta_description,
            keywords: varname_data.meta_keywords,
            canonical: `https://macropredictions.com/forecast/${varname_data.varname}`,
            pagescript: 'forecast.js',
            varname: varname_data.varname,
            fullname: varname_data.fullname,
            primary_forecast: varname_data.primary_forecast,
            secondary_forecasts: varname_data.secondary_forecasts,
            show_vintage_chart: true,
            units: varname_data.units,
            hist_freq: varname_data.hist_freq,
            hist_update_freq: varname_data.hist_update_freq,
            variable_description: varname_data.variable_description,
            primary_forecast_description: varname_data.primary_forecast_description,
            secondary_forecasts_description: secondary_forecasts_description
        });

    } catch(err) {
      next(err);
    }
  
  });
  
  

export default forecast_router;