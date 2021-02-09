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
class __TwigTemplate_710270983adcc09738b676ae0aa9f631d7546b8f5ecc27a1fc7187d5e4af4f82 extends \Twig\Template
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
<div class=\"container\" style=\"max-width:1400px\">
\t<div class=\"rounded bg-dark\"  style=\"background:url('static/bank.jpg'); background-position: top; background-size: 100% auto\">
\t\t<div class=\"col-md-6 px-2 p-4 p-md-5 mb-4 text-white\">
\t\t\t<p class=\"lead my-3\">The Center for Macroeconomic Forecasting & Insights is a non-partisan think tank working to democratize macroeconomic knowledge by making the necessary tools, data, and insights more available for all.</p>
\t\t\t<p class=\"lead mb-0\"><a href=\"#\" class=\"text-white fw-bold\">Continue reading...</a></p>
\t\t</div>
\t\t<div class=\"col-md-6 p-0 col-sm-0\">
\t\t</div>
\t</div>


\t<hr>
\t<h1 style=\"color:var(--econgreen)\">New Releases</h1>
\t  <div class=\"row mb-2\">
\t\t<div class=\"col-md-4 col-sm-6\">
\t\t  <div class=\"row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-150 position-relative p-3\">
\t\t\t<div class=\"row\">
\t\t\t\t<div class=\"col-12\">
\t\t\t\t\t<strong class=\"d-inline-block mb-2 text-danger\">Indicators & Indices</strong>
\t\t\t\t\t<h3 class=\"mb-0\">Asset Correlation Index</h3>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\"row\">
\t\t\t\t<div class=\"col\">
\t\t\t\t\t<div class=\"mb-1 text-muted\">Feb 2021</div>
\t\t\t\t\t<p class=\"card-text mb-auto\">Historical data for the Asset Correlation Index is now available online.</p>
\t\t\t\t\t<a href=\"ac-assets\" class=\"stretched-link\">Click to go</a>
\t\t\t\t</div>
\t\t\t\t<div class=\"d-none d-lg-block col-lg-4 border rounded\" style=\"background:url('/static/probabilistic-forecasting-graph.png'); background-position:bottom; background-size:100% auto;   background-repeat: no-repeat;\">
\t\t\t\t</div>
\t\t\t</div>
\t\t  </div>
\t\t</div>
\t\t
\t\t
\t\t<div class=\"col-md-4 col-sm-6\">
\t\t  <div class=\"row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-150 position-relative p-3\">
\t\t\t<div class=\"row\">
\t\t\t\t<div class=\"col-12\">
\t\t\t\t\t<strong class=\"d-inline-block mb-2 text-danger\">Indicators & Indices</strong>
\t\t\t\t\t<h3 class=\"mb-0\">Regional Correlation Index</h3>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\"row\">
\t\t\t\t<div class=\"col\">
\t\t\t\t\t<div class=\"mb-1 text-muted\">Feb 2021</div>
\t\t\t\t\t<p class=\"card-text mb-auto\">Historical data for the Regional Correlation Index is now available online.</p>
\t\t\t\t\t<a href=\"ac-regions\" class=\"stretched-link\">Click to go</a>
\t\t\t\t</div>
\t\t\t\t<div class=\"d-none d-lg-block col-lg-4 border rounded\" style=\"background:url('/static/thumb003.png'); background-position:bottom; background-size:100% auto;   background-repeat: no-repeat;\">
\t\t\t\t</div>
\t\t\t</div>
\t\t  </div>
\t\t</div>

\t\t
\t\t
\t  </div>

  
</div>
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

<div class=\"container\" style=\"max-width:1400px\">
\t<div class=\"rounded bg-dark\"  style=\"background:url('static/bank.jpg'); background-position: top; background-size: 100% auto\">
\t\t<div class=\"col-md-6 px-2 p-4 p-md-5 mb-4 text-white\">
\t\t\t<p class=\"lead my-3\">The Center for Macroeconomic Forecasting & Insights is a non-partisan think tank working to democratize macroeconomic knowledge by making the necessary tools, data, and insights more available for all.</p>
\t\t\t<p class=\"lead mb-0\"><a href=\"#\" class=\"text-white fw-bold\">Continue reading...</a></p>
\t\t</div>
\t\t<div class=\"col-md-6 p-0 col-sm-0\">
\t\t</div>
\t</div>


\t<hr>
\t<h1 style=\"color:var(--econgreen)\">New Releases</h1>
\t  <div class=\"row mb-2\">
\t\t<div class=\"col-md-4 col-sm-6\">
\t\t  <div class=\"row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-150 position-relative p-3\">
\t\t\t<div class=\"row\">
\t\t\t\t<div class=\"col-12\">
\t\t\t\t\t<strong class=\"d-inline-block mb-2 text-danger\">Indicators & Indices</strong>
\t\t\t\t\t<h3 class=\"mb-0\">Asset Correlation Index</h3>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\"row\">
\t\t\t\t<div class=\"col\">
\t\t\t\t\t<div class=\"mb-1 text-muted\">Feb 2021</div>
\t\t\t\t\t<p class=\"card-text mb-auto\">Historical data for the Asset Correlation Index is now available online.</p>
\t\t\t\t\t<a href=\"ac-assets\" class=\"stretched-link\">Click to go</a>
\t\t\t\t</div>
\t\t\t\t<div class=\"d-none d-lg-block col-lg-4 border rounded\" style=\"background:url('/static/probabilistic-forecasting-graph.png'); background-position:bottom; background-size:100% auto;   background-repeat: no-repeat;\">
\t\t\t\t</div>
\t\t\t</div>
\t\t  </div>
\t\t</div>
\t\t
\t\t
\t\t<div class=\"col-md-4 col-sm-6\">
\t\t  <div class=\"row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-150 position-relative p-3\">
\t\t\t<div class=\"row\">
\t\t\t\t<div class=\"col-12\">
\t\t\t\t\t<strong class=\"d-inline-block mb-2 text-danger\">Indicators & Indices</strong>
\t\t\t\t\t<h3 class=\"mb-0\">Regional Correlation Index</h3>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\"row\">
\t\t\t\t<div class=\"col\">
\t\t\t\t\t<div class=\"mb-1 text-muted\">Feb 2021</div>
\t\t\t\t\t<p class=\"card-text mb-auto\">Historical data for the Regional Correlation Index is now available online.</p>
\t\t\t\t\t<a href=\"ac-regions\" class=\"stretched-link\">Click to go</a>
\t\t\t\t</div>
\t\t\t\t<div class=\"d-none d-lg-block col-lg-4 border rounded\" style=\"background:url('/static/thumb003.png'); background-position:bottom; background-size:100% auto;   background-repeat: no-repeat;\">
\t\t\t\t</div>
\t\t\t</div>
\t\t  </div>
\t\t</div>

\t\t
\t\t
\t  </div>

  
</div>
{% endblock %}", "home.html", "/var/www/econforecasting.com/public/templates/home.html");
    }
}
