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
    public function block_staticlinks($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 4
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

    // line 23
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 24
        echo "
<div class=\"container\">
\t<div class=\"p-4 p-md-5 mb-4 text-white rounded bg-dark\"  style=\"background:url('/static/bg001.jpg'); background-position: bottom; background-size: 100% auto\">
\t\t\t<div class=\"col-md-6 px-0\">
\t\t\t<p class=\"lead my-3\">econforecasting.com is a non-partisan think tank working to democratize macroeconomic knowledge by making the necessary tools, data, and insights more available for all.</p>
\t\t\t<p class=\"lead mb-0\"><a href=\"#\" class=\"text-white fw-bold\">Continue reading...</a></p>
\t\t</div>
\t</div>


\t  <div class=\"row mb-2\">
\t\t<div class=\"col-md-4\">
\t\t  <div class=\"row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-150 position-relative\">
\t\t\t<div class=\"col p-4 d-flex flex-column position-static\">
\t\t\t  <strong class=\"d-inline-block mb-2 text-primary\">Data</strong>
\t\t\t  <h3 class=\"mb-0\">GDP Forecasts</h3>
\t\t\t  <div class=\"mb-1 text-muted\">Jan 2021</div>
\t\t\t  <p class=\"card-text mb-auto\">Aggregated real GDP forecasts now available.</p>
\t\t\t  <a href=\"#\" class=\"stretched-link\">Click to go</a>
\t\t\t</div>
\t\t\t<div class=\"col-auto d-none d-lg-block\">
\t\t\t  <svg class=\"bd-placeholder-img\" width=\"150\" height=\"150\" xmlns=\"http://www.w3.org/2000/svg\" focusable=\"false\" role=\"img\">
\t\t\t\t  <image href=\"/static/thumb001.jpg\" height=\"150\" width=\"150\" />
\t\t\t  </svg>
\t\t\t</div>
\t\t  </div>
\t\t</div>
\t\t<div class=\"col-md-4\">
\t\t  <div class=\"row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-200 position-relative\">
\t\t\t<div class=\"col p-4 d-flex flex-column position-static\">
\t\t\t  <strong class=\"d-inline-block mb-2 text-primary\">Data</strong>
\t\t\t  <h3 class=\"mb-0\">Featured post</h3>
\t\t\t  <div class=\"mb-1 text-muted\">Nov 12</div>
\t\t\t  <p class=\"card-text mb-auto\">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
\t\t\t  <a href=\"#\" class=\"stretched-link\">Continue reading</a>
\t\t\t</div>
\t\t\t<div class=\"col-auto d-none d-lg-block\">
\t\t\t  <svg class=\"bd-placeholder-img\" width=\"150\" height=\"150\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"xMidYMid slice\" focusable=\"false\" role=\"img\" aria-label=\"Placeholder: Thumbnail\"><title>Placeholder</title><rect width=\"100%\" height=\"100%\" fill=\"#55595c\"/><text x=\"50%\" y=\"50%\" fill=\"#eceeef\" dy=\".3em\">Thumbnail</text></svg>
\t\t\t</div>
\t\t  </div>
\t\t</div>

\t\t<div class=\"col-md-4\">
\t\t  <div class=\"row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-200 position-relative\">
\t\t\t<div class=\"col p-4 d-flex flex-column position-static\">
\t\t\t  <strong class=\"d-inline-block mb-2 text-success\">Insights</strong>
\t\t\t  <h3 class=\"mb-0\">Post title</h3>
\t\t\t  <div class=\"mb-1 text-muted\">Nov 11</div>
\t\t\t  <p class=\"mb-auto\">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
\t\t\t  <a href=\"#\" class=\"stretched-link\">Continue reading</a>
\t\t\t</div>
\t\t\t<div class=\"col-auto d-none d-lg-block\">
\t\t\t  <svg class=\"bd-placeholder-img\" width=\"150\" height=\"150\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"xMidYMid slice\" focusable=\"false\" role=\"img\" aria-label=\"Placeholder: Thumbnail\"><title>Placeholder</title><rect width=\"100%\" height=\"100%\" fill=\"#55595c\"/><text x=\"50%\" y=\"50%\" fill=\"#eceeef\" dy=\".3em\">Thumbnail</text></svg>
\t\t\t</div>
\t\t  </div>
\t\t</div>
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
        return array (  75 => 24,  71 => 23,  51 => 4,  47 => 3,  36 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"base.html\" %}

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

<div class=\"container\">
\t<div class=\"p-4 p-md-5 mb-4 text-white rounded bg-dark\"  style=\"background:url('/static/bg001.jpg'); background-position: bottom; background-size: 100% auto\">
\t\t\t<div class=\"col-md-6 px-0\">
\t\t\t<p class=\"lead my-3\">econforecasting.com is a non-partisan think tank working to democratize macroeconomic knowledge by making the necessary tools, data, and insights more available for all.</p>
\t\t\t<p class=\"lead mb-0\"><a href=\"#\" class=\"text-white fw-bold\">Continue reading...</a></p>
\t\t</div>
\t</div>


\t  <div class=\"row mb-2\">
\t\t<div class=\"col-md-4\">
\t\t  <div class=\"row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-150 position-relative\">
\t\t\t<div class=\"col p-4 d-flex flex-column position-static\">
\t\t\t  <strong class=\"d-inline-block mb-2 text-primary\">Data</strong>
\t\t\t  <h3 class=\"mb-0\">GDP Forecasts</h3>
\t\t\t  <div class=\"mb-1 text-muted\">Jan 2021</div>
\t\t\t  <p class=\"card-text mb-auto\">Aggregated real GDP forecasts now available.</p>
\t\t\t  <a href=\"#\" class=\"stretched-link\">Click to go</a>
\t\t\t</div>
\t\t\t<div class=\"col-auto d-none d-lg-block\">
\t\t\t  <svg class=\"bd-placeholder-img\" width=\"150\" height=\"150\" xmlns=\"http://www.w3.org/2000/svg\" focusable=\"false\" role=\"img\">
\t\t\t\t  <image href=\"/static/thumb001.jpg\" height=\"150\" width=\"150\" />
\t\t\t  </svg>
\t\t\t</div>
\t\t  </div>
\t\t</div>
\t\t<div class=\"col-md-4\">
\t\t  <div class=\"row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-200 position-relative\">
\t\t\t<div class=\"col p-4 d-flex flex-column position-static\">
\t\t\t  <strong class=\"d-inline-block mb-2 text-primary\">Data</strong>
\t\t\t  <h3 class=\"mb-0\">Featured post</h3>
\t\t\t  <div class=\"mb-1 text-muted\">Nov 12</div>
\t\t\t  <p class=\"card-text mb-auto\">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
\t\t\t  <a href=\"#\" class=\"stretched-link\">Continue reading</a>
\t\t\t</div>
\t\t\t<div class=\"col-auto d-none d-lg-block\">
\t\t\t  <svg class=\"bd-placeholder-img\" width=\"150\" height=\"150\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"xMidYMid slice\" focusable=\"false\" role=\"img\" aria-label=\"Placeholder: Thumbnail\"><title>Placeholder</title><rect width=\"100%\" height=\"100%\" fill=\"#55595c\"/><text x=\"50%\" y=\"50%\" fill=\"#eceeef\" dy=\".3em\">Thumbnail</text></svg>
\t\t\t</div>
\t\t  </div>
\t\t</div>

\t\t<div class=\"col-md-4\">
\t\t  <div class=\"row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-200 position-relative\">
\t\t\t<div class=\"col p-4 d-flex flex-column position-static\">
\t\t\t  <strong class=\"d-inline-block mb-2 text-success\">Insights</strong>
\t\t\t  <h3 class=\"mb-0\">Post title</h3>
\t\t\t  <div class=\"mb-1 text-muted\">Nov 11</div>
\t\t\t  <p class=\"mb-auto\">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
\t\t\t  <a href=\"#\" class=\"stretched-link\">Continue reading</a>
\t\t\t</div>
\t\t\t<div class=\"col-auto d-none d-lg-block\">
\t\t\t  <svg class=\"bd-placeholder-img\" width=\"150\" height=\"150\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"xMidYMid slice\" focusable=\"false\" role=\"img\" aria-label=\"Placeholder: Thumbnail\"><title>Placeholder</title><rect width=\"100%\" height=\"100%\" fill=\"#55595c\"/><text x=\"50%\" y=\"50%\" fill=\"#eceeef\" dy=\".3em\">Thumbnail</text></svg>
\t\t\t</div>
\t\t  </div>
\t\t</div>
\t  </div>

  
</div>
{% endblock %}", "home.html", "/var/www/econforecasting.com/public/templates/home.html");
    }
}
