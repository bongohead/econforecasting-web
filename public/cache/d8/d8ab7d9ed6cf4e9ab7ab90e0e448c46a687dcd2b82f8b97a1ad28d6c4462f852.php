<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* home.html */
class __TwigTemplate_4848799cd9d7664fb9f430ea315c54eaf57da1e68128344aed928ef98c30971a extends \Twig\Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->blocks = [
            'meta' => [$this, 'block_meta'],
            'staticlinks' => [$this, 'block_staticlinks'],
            'content' => [$this, 'block_content'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return "base.html";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        $this->parent = $this->loadTemplate("base.html", "home.html", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_meta($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 4
        echo "<meta name=\"description\" content=\"Get aggregated macroeconomic data, forecasts, models, and insights including GDP forecasts, interest rate forecasts, and Treasury yield forecasts.\"/>
<link rel=\"canonical\" href=\"https://econforecasting.com\">
";
    }

    // line 8
    public function block_staticlinks($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 9
        echo "<!--<script src=\"//code.highcharts.com/stock/highstock.js\"></script>
<script src=\"//code.highcharts.com/modules/heatmap.js\"></script>

<script src=\"//cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.6/proj4.js\"></script>
<script src=\"//code.highcharts.com/maps/modules/map.js\"></script>
<script src=\"//code.highcharts.com/mapdata/custom/world-robinson.js\"></script>
<script src=\"//code.highcharts.com/mapdata/custom/europe.js\"></script>

<script src=\"//code.highcharts.com/stock/indicators/indicators.js\"></script>
<script src=\"//code.highcharts.com/stock/indicators/ema.js\"></script>
<script src=\"//code.highcharts.com/stock/indicators/bollinger-bands.js\"></script>

<script src=\"static/script-fincontagion.js\"></script>
<script src=\"static/mapGenerator.js\"></script>
<script src=\"static/tsGenerator.js\"></script>
-->
";
    }

    // line 28
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 29
        echo "
<div class=\"container-fluid\" id=\"homepage-banner\" >
\t<div class=\"container px-4\">
\t<div class=\"row align-items-lg-center pt-2\">
      <div class=\"col-md-4 order-md-1 col-lg-6 text-center text-md-start\">
        <h1 class=\"mb-3\" style=\"font-family:Molengo\">The Center for Macroeconomic Forecasting & Insights</h1>
        <p class=\"lead mb-4\">
        </p>

\t\t<!--
        <div class=\"d-flex flex-column flex-md-row\">
          <a href=\"/docs/5.0/getting-started/introduction/\" class=\"btn btn-lg btn-bd-primary mb-3 me-md-3\" onclick=\"ga('send', 'event', 'Jumbotron actions', 'Get started', 'Get started');\">Get started</a>
          <a href=\"/docs/5.0/getting-started/download/\" class=\"btn btn-lg btn-outline-secondary mb-3\" onclick=\"ga('send', 'event', 'Jumbotron actions', 'Download', 'Download 5.0.0-beta2');\">Download</a>
        </div>
        <p class=\"text-muted mb-0\">
          Currently <strong>v5.0.0-beta2</strong>
          <span class=\"px-1\">·</span>
          <a href=\"https://getbootstrap.com/docs/4.6/getting-started/introduction/\" class=\"link-secondary\">v4.6.x docs</a>
          <span class=\"px-1\">·</span>
          <a href=\"/docs/versions/\" class=\"link-secondary\">All releases</a>
        </p>
\t\t-->
      </div>

      <div class=\"col-10 mx-auto col-md-8 order-md-2 col-lg-6 \">
\t\t<div class=\"p-1 mb-1 bg-econgreen d-inline-block text-white\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-bar-chart-fill\" viewBox=\"0 0 16 16\">
\t\t  <path d=\"M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z\"/>
\t\t</svg></div>
\t\t<div class=\"d-inline\"><span style=\"vertical-align:middle;font-size:1.4rem; color: var(--bs-econgreen)\">New Data Releases</span></div>
\t\t<div class=\"list-group\">
\t\t\t<a href=\"/fc-rates-ffr\" class=\"list-group-item list-group-item-action\" aria-current=\"true\">
\t\t\t\t<div class=\"d-flex w-100 justify-content-between\">
\t\t\t\t\t<h5 class=\"mb-1\">Federal Funds Rate & SOFR Forecasts Updated</h5>
\t\t\t\t\t<small>Today</small>
\t\t\t\t</div>
\t\t\t\t<p class=\"mb-1\">FFR & SOFR forecasts have been updated using our futures model</p>
\t\t\t\t<span class=\"btn btn-sm\">Click to go</span>
\t\t\t</a>

\t\t\t<a href=\"/fc-rates-tcurve\" class=\"list-group-item list-group-item-action\" aria-current=\"true\">
\t\t\t\t<div class=\"d-flex w-100 justify-content-between\">
\t\t\t\t\t<h5 class=\"mb-1\">Treasury Yield Forecasts Updated</h5>
\t\t\t\t\t<small>Today</small>
\t\t\t\t</div>
\t\t\t\t<p class=\"mb-1\">3-month, 1-year, 5-year, 10-year, 20-year, 30-year Treasury yield forecasts have been updated</p>
\t\t\t\t<span class=\"btn btn-sm\">Click to go</span>
\t\t\t</a>

\t\t\t<a href=\"/ac-assets\" class=\"list-group-item list-group-item-action\" aria-current=\"true\">
\t\t\t\t<div class=\"d-flex w-100 justify-content-between\">
\t\t\t\t\t<h5 class=\"mb-1\">Asset Correlation Index Updated</h5>
\t\t\t\t\t<small>Yesterday</small>
\t\t\t\t</div>
\t\t\t\t<p class=\"mb-1\">Historical data for the Asset Correlation Index has been updated</p>
\t\t\t\t<span class=\"btn btn-sm\">Click to go</span>
\t\t\t</a>
\t\t\t
\t\t\t<a href=\"/ac-regions\" class=\"list-group-item list-group-item-action\" aria-current=\"true\">
\t\t\t\t<div class=\"d-flex w-100 justify-content-between\">
\t\t\t\t\t<h5 class=\"mb-1\">Regional Correlation Index Updated</h5>
\t\t\t\t\t<small>Yesterday</small>
\t\t\t\t</div>
\t\t\t\t<p class=\"mb-1\">Historical data for the Asset Correlation Index has been updated</p>
\t\t\t\t<span class=\"btn btn-sm\">Click to go</span>
\t\t\t</a>

\t\t</div>

      </div>
\t  

\t\t<!--
        <div class=\"d-flex flex-column flex-md-row\">
          <a href=\"/docs/5.0/getting-started/introduction/\" class=\"btn btn-lg btn-bd-primary mb-3 me-md-3\" onclick=\"ga('send', 'event', 'Jumbotron actions', 'Get started', 'Get started');\">Get started</a>
          <a href=\"/docs/5.0/getting-started/download/\" class=\"btn btn-lg btn-outline-secondary mb-3\" onclick=\"ga('send', 'event', 'Jumbotron actions', 'Download', 'Download 5.0.0-beta2');\">Download</a>
        </div>
        <p class=\"text-muted mb-0\">
          Currently <strong>v5.0.0-beta2</strong>
          <span class=\"px-1\">·</span>
          <a href=\"https://getbootstrap.com/docs/4.6/getting-started/introduction/\" class=\"link-secondary\">v4.6.x docs</a>
          <span class=\"px-1\">·</span>
          <a href=\"/docs/versions/\" class=\"link-secondary\">All releases</a>
        </p>
\t\t-->
    </div>
\t</div>  
</div>


<div class=\"container-fluid px-0 pb-5\" style=\"background-image:url(static/svg_bg.svg);background-size:cover;background-position:top left\">
\t<div class=\"container-fluid mt-5\" style=\"height:2rem;background-image:linear-gradient(45deg, var(--bs-econblue) 50%, var(--bs-econpale) 50%)\">
\t\t<div class=\"container px-2 py-0\" style=\"height:2rem;background-image:linear-gradient(45deg, var(--bs-econblue) 50%, rgba(255, 255, 255, 0) 50%)\">
\t\t\t<h4 class=\"text-white\">Data & Forecasts</h4>
\t\t</div>
\t</div>

\t<div class=\"container-fluid\">
\t\t<div class=\"container pt-2 pb-2\">
\t\t\t<div class=\"row justify-content-center\">
\t\t\t
\t\t\t  <div class=\"col-12 col-xl-5 border rounded shadow-sm p-3 mx-1 bg-white\">
\t\t\t\t\t<h6 class=\"d-inline-block mb-2 text-econred fw-bold\">Forecasts & Nowcasts</h6>
\t\t\t\t\t<div class=\"row row-cols-3 row-cols-sm-4 row-cols-md-5 row-cols-lg-6 row-cols-xl-5\">
\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/fc-rates-tcurve\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9) 50%), url(/static/svg_fc_rates_tcurve.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded border-2 border-econred\">
\t\t\t\t\t\t\t\t\t<span>Treasury<br>Yield Curve</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/fc-rates-t-3m\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9)50%), url(/static/svg_fc_rates_t.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded border-2 border-econred\">
\t\t\t\t\t\t\t\t\t<span>Treasury<br>Yields</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/fc-rates-ffr\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9)50%), url(/static/svg_fc_rates_ffr.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded border-2 border-econred\">
\t\t\t\t\t\t\t\t\t<span>Federal<br>Funds<br>Rate</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/fc-rates-sofr\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9)50%), url(/static/svg_fc_rates_sofr.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded border-2 border-econred\">
\t\t\t\t\t\t\t\t\t<span>SOFR<br>Rate</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/fc-rates-mort15y\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9)50%), url(/static/svg_fc_rates_mort15y.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded border-2 border-econred\">
\t\t\t\t\t\t\t\t\t<span>15-Year<br>Mortgage<br>Rate</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>

\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/fc-rates-mort30y\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9)50%), url(/static/svg_fc_rates_mort30y.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded border-2 border-econred\">
\t\t\t\t\t\t\t\t\t<span>30-Year<br>Mortgage<br>Rate</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/fc-macro-inf\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9)50%), url(/static/svg_fc_macro_inf.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded border-2 border-econred\">
\t\t\t\t\t\t\t\t\t<span>Inflation<br>Rate</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/nc-gdp\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9)50%), url(/static/svg_nc_gdp.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded border-2 border-econred\">
\t\t\t\t\t\t\t\t\t<span>GDP<br>Nowcasts</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>

\t\t\t\t\t</div>
\t\t\t  </div>

\t\t\t
\t\t\t  <div class=\"col-12 col-xl-5 border rounded shadow-sm p-3 mx-1 bg-white\">
\t\t\t\t\t<h6 class=\"d-inline-block mb-2 text-econgreen fw-bold\">Indicators & Indices</h6>
\t\t\t\t\t<div class=\"row row-cols-3 row-cols-sm-4 row-cols-md-5 row-cols-lg-6 row-cols-xl-5\">
\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/ac-assets\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9)50%), url(/static/svg_ac_assets.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded\">
\t\t\t\t\t\t\t\t\t<span>Asset<br>Correlation<br>Index</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/ac-regions\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9)50%), url(/static/svg_ac_regions.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded\">
\t\t\t\t\t\t\t\t\t<span>Regional<br>Correlation<br>Index</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t  </div>
\t\t\t  
\t\t\t</div>
\t\t\t
\t\t</div>
\t</div>
\t<div class=\"container-fluid mt-2\" style=\"height:2rem;background-image:linear-gradient(45deg, var(--bs-econorange) 50%, var(--bs-econpale) 50%)\">
\t\t<div class=\"container px-2 py-0\" style=\"height:2rem;background-image:linear-gradient(45deg, var(--bs-econorange) 50%, rgba(255, 255, 255, 0) 50%)\">
\t\t\t<h4 class=\"text-white\">About Us</h4>
\t\t</div>
\t</div>
\t<div class=\"container pt-1\">
\t<h4>
\tCMEFI is a non-partisan think tank working to democratize macroeconomic knowledge by making the necessary tools, data, and insights more available for all.
\t</h4>
\t</div>
</div>



\t

";
    }

    public function getTemplateName()
    {
        return "home.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  86 => 29,  82 => 28,  62 => 9,  58 => 8,  52 => 4,  48 => 3,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"base.html\" %}

{% block meta %}
<meta name=\"description\" content=\"Get aggregated macroeconomic data, forecasts, models, and insights including GDP forecasts, interest rate forecasts, and Treasury yield forecasts.\"/>
<link rel=\"canonical\" href=\"https://econforecasting.com\">
{% endblock %}

{% block staticlinks %}
<!--<script src=\"//code.highcharts.com/stock/highstock.js\"></script>
<script src=\"//code.highcharts.com/modules/heatmap.js\"></script>

<script src=\"//cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.6/proj4.js\"></script>
<script src=\"//code.highcharts.com/maps/modules/map.js\"></script>
<script src=\"//code.highcharts.com/mapdata/custom/world-robinson.js\"></script>
<script src=\"//code.highcharts.com/mapdata/custom/europe.js\"></script>

<script src=\"//code.highcharts.com/stock/indicators/indicators.js\"></script>
<script src=\"//code.highcharts.com/stock/indicators/ema.js\"></script>
<script src=\"//code.highcharts.com/stock/indicators/bollinger-bands.js\"></script>

<script src=\"static/script-fincontagion.js\"></script>
<script src=\"static/mapGenerator.js\"></script>
<script src=\"static/tsGenerator.js\"></script>
-->
{% endblock %}


{% block content %}

<div class=\"container-fluid\" id=\"homepage-banner\" >
\t<div class=\"container px-4\">
\t<div class=\"row align-items-lg-center pt-2\">
      <div class=\"col-md-4 order-md-1 col-lg-6 text-center text-md-start\">
        <h1 class=\"mb-3\" style=\"font-family:Molengo\">The Center for Macroeconomic Forecasting & Insights</h1>
        <p class=\"lead mb-4\">
        </p>

\t\t<!--
        <div class=\"d-flex flex-column flex-md-row\">
          <a href=\"/docs/5.0/getting-started/introduction/\" class=\"btn btn-lg btn-bd-primary mb-3 me-md-3\" onclick=\"ga('send', 'event', 'Jumbotron actions', 'Get started', 'Get started');\">Get started</a>
          <a href=\"/docs/5.0/getting-started/download/\" class=\"btn btn-lg btn-outline-secondary mb-3\" onclick=\"ga('send', 'event', 'Jumbotron actions', 'Download', 'Download 5.0.0-beta2');\">Download</a>
        </div>
        <p class=\"text-muted mb-0\">
          Currently <strong>v5.0.0-beta2</strong>
          <span class=\"px-1\">·</span>
          <a href=\"https://getbootstrap.com/docs/4.6/getting-started/introduction/\" class=\"link-secondary\">v4.6.x docs</a>
          <span class=\"px-1\">·</span>
          <a href=\"/docs/versions/\" class=\"link-secondary\">All releases</a>
        </p>
\t\t-->
      </div>

      <div class=\"col-10 mx-auto col-md-8 order-md-2 col-lg-6 \">
\t\t<div class=\"p-1 mb-1 bg-econgreen d-inline-block text-white\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-bar-chart-fill\" viewBox=\"0 0 16 16\">
\t\t  <path d=\"M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z\"/>
\t\t</svg></div>
\t\t<div class=\"d-inline\"><span style=\"vertical-align:middle;font-size:1.4rem; color: var(--bs-econgreen)\">New Data Releases</span></div>
\t\t<div class=\"list-group\">
\t\t\t<a href=\"/fc-rates-ffr\" class=\"list-group-item list-group-item-action\" aria-current=\"true\">
\t\t\t\t<div class=\"d-flex w-100 justify-content-between\">
\t\t\t\t\t<h5 class=\"mb-1\">Federal Funds Rate & SOFR Forecasts Updated</h5>
\t\t\t\t\t<small>Today</small>
\t\t\t\t</div>
\t\t\t\t<p class=\"mb-1\">FFR & SOFR forecasts have been updated using our futures model</p>
\t\t\t\t<span class=\"btn btn-sm\">Click to go</span>
\t\t\t</a>

\t\t\t<a href=\"/fc-rates-tcurve\" class=\"list-group-item list-group-item-action\" aria-current=\"true\">
\t\t\t\t<div class=\"d-flex w-100 justify-content-between\">
\t\t\t\t\t<h5 class=\"mb-1\">Treasury Yield Forecasts Updated</h5>
\t\t\t\t\t<small>Today</small>
\t\t\t\t</div>
\t\t\t\t<p class=\"mb-1\">3-month, 1-year, 5-year, 10-year, 20-year, 30-year Treasury yield forecasts have been updated</p>
\t\t\t\t<span class=\"btn btn-sm\">Click to go</span>
\t\t\t</a>

\t\t\t<a href=\"/ac-assets\" class=\"list-group-item list-group-item-action\" aria-current=\"true\">
\t\t\t\t<div class=\"d-flex w-100 justify-content-between\">
\t\t\t\t\t<h5 class=\"mb-1\">Asset Correlation Index Updated</h5>
\t\t\t\t\t<small>Yesterday</small>
\t\t\t\t</div>
\t\t\t\t<p class=\"mb-1\">Historical data for the Asset Correlation Index has been updated</p>
\t\t\t\t<span class=\"btn btn-sm\">Click to go</span>
\t\t\t</a>
\t\t\t
\t\t\t<a href=\"/ac-regions\" class=\"list-group-item list-group-item-action\" aria-current=\"true\">
\t\t\t\t<div class=\"d-flex w-100 justify-content-between\">
\t\t\t\t\t<h5 class=\"mb-1\">Regional Correlation Index Updated</h5>
\t\t\t\t\t<small>Yesterday</small>
\t\t\t\t</div>
\t\t\t\t<p class=\"mb-1\">Historical data for the Asset Correlation Index has been updated</p>
\t\t\t\t<span class=\"btn btn-sm\">Click to go</span>
\t\t\t</a>

\t\t</div>

      </div>
\t  

\t\t<!--
        <div class=\"d-flex flex-column flex-md-row\">
          <a href=\"/docs/5.0/getting-started/introduction/\" class=\"btn btn-lg btn-bd-primary mb-3 me-md-3\" onclick=\"ga('send', 'event', 'Jumbotron actions', 'Get started', 'Get started');\">Get started</a>
          <a href=\"/docs/5.0/getting-started/download/\" class=\"btn btn-lg btn-outline-secondary mb-3\" onclick=\"ga('send', 'event', 'Jumbotron actions', 'Download', 'Download 5.0.0-beta2');\">Download</a>
        </div>
        <p class=\"text-muted mb-0\">
          Currently <strong>v5.0.0-beta2</strong>
          <span class=\"px-1\">·</span>
          <a href=\"https://getbootstrap.com/docs/4.6/getting-started/introduction/\" class=\"link-secondary\">v4.6.x docs</a>
          <span class=\"px-1\">·</span>
          <a href=\"/docs/versions/\" class=\"link-secondary\">All releases</a>
        </p>
\t\t-->
    </div>
\t</div>  
</div>


<div class=\"container-fluid px-0 pb-5\" style=\"background-image:url(static/svg_bg.svg);background-size:cover;background-position:top left\">
\t<div class=\"container-fluid mt-5\" style=\"height:2rem;background-image:linear-gradient(45deg, var(--bs-econblue) 50%, var(--bs-econpale) 50%)\">
\t\t<div class=\"container px-2 py-0\" style=\"height:2rem;background-image:linear-gradient(45deg, var(--bs-econblue) 50%, rgba(255, 255, 255, 0) 50%)\">
\t\t\t<h4 class=\"text-white\">Data & Forecasts</h4>
\t\t</div>
\t</div>

\t<div class=\"container-fluid\">
\t\t<div class=\"container pt-2 pb-2\">
\t\t\t<div class=\"row justify-content-center\">
\t\t\t
\t\t\t  <div class=\"col-12 col-xl-5 border rounded shadow-sm p-3 mx-1 bg-white\">
\t\t\t\t\t<h6 class=\"d-inline-block mb-2 text-econred fw-bold\">Forecasts & Nowcasts</h6>
\t\t\t\t\t<div class=\"row row-cols-3 row-cols-sm-4 row-cols-md-5 row-cols-lg-6 row-cols-xl-5\">
\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/fc-rates-tcurve\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9) 50%), url(/static/svg_fc_rates_tcurve.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded border-2 border-econred\">
\t\t\t\t\t\t\t\t\t<span>Treasury<br>Yield Curve</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/fc-rates-t-3m\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9)50%), url(/static/svg_fc_rates_t.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded border-2 border-econred\">
\t\t\t\t\t\t\t\t\t<span>Treasury<br>Yields</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/fc-rates-ffr\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9)50%), url(/static/svg_fc_rates_ffr.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded border-2 border-econred\">
\t\t\t\t\t\t\t\t\t<span>Federal<br>Funds<br>Rate</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/fc-rates-sofr\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9)50%), url(/static/svg_fc_rates_sofr.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded border-2 border-econred\">
\t\t\t\t\t\t\t\t\t<span>SOFR<br>Rate</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/fc-rates-mort15y\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9)50%), url(/static/svg_fc_rates_mort15y.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded border-2 border-econred\">
\t\t\t\t\t\t\t\t\t<span>15-Year<br>Mortgage<br>Rate</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>

\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/fc-rates-mort30y\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9)50%), url(/static/svg_fc_rates_mort30y.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded border-2 border-econred\">
\t\t\t\t\t\t\t\t\t<span>30-Year<br>Mortgage<br>Rate</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/fc-macro-inf\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9)50%), url(/static/svg_fc_macro_inf.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded border-2 border-econred\">
\t\t\t\t\t\t\t\t\t<span>Inflation<br>Rate</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/nc-gdp\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9)50%), url(/static/svg_nc_gdp.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded border-2 border-econred\">
\t\t\t\t\t\t\t\t\t<span>GDP<br>Nowcasts</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>

\t\t\t\t\t</div>
\t\t\t  </div>

\t\t\t
\t\t\t  <div class=\"col-12 col-xl-5 border rounded shadow-sm p-3 mx-1 bg-white\">
\t\t\t\t\t<h6 class=\"d-inline-block mb-2 text-econgreen fw-bold\">Indicators & Indices</h6>
\t\t\t\t\t<div class=\"row row-cols-3 row-cols-sm-4 row-cols-md-5 row-cols-lg-6 row-cols-xl-5\">
\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/ac-assets\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9)50%), url(/static/svg_ac_assets.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded\">
\t\t\t\t\t\t\t\t\t<span>Asset<br>Correlation<br>Index</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"col homepage-links mb-2\">
\t\t\t\t\t\t\t<a href=\"/ac-regions\" class=\"d-block text-dark text-decoration-none\" style=\"background-image:linear-gradient(45deg, rgba(255, 255, 255, .9) 50%, rgba(255, 255, 255, .9)50%), url(/static/svg_ac_regions.svg);background-size:100%, 90%;background-repeat:no-repeat;background-position:center center\">
\t\t\t\t\t\t\t\t<div class=\"text-center rounded\">
\t\t\t\t\t\t\t\t\t<span>Regional<br>Correlation<br>Index</span>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t  </div>
\t\t\t  
\t\t\t</div>
\t\t\t
\t\t</div>
\t</div>
\t<div class=\"container-fluid mt-2\" style=\"height:2rem;background-image:linear-gradient(45deg, var(--bs-econorange) 50%, var(--bs-econpale) 50%)\">
\t\t<div class=\"container px-2 py-0\" style=\"height:2rem;background-image:linear-gradient(45deg, var(--bs-econorange) 50%, rgba(255, 255, 255, 0) 50%)\">
\t\t\t<h4 class=\"text-white\">About Us</h4>
\t\t</div>
\t</div>
\t<div class=\"container pt-1\">
\t<h4>
\tCMEFI is a non-partisan think tank working to democratize macroeconomic knowledge by making the necessary tools, data, and insights more available for all.
\t</h4>
\t</div>
</div>



\t

{% endblock %}", "home.html", "/var/www/econforecasting.com/public/templates/home.html");
    }
}
