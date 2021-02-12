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

/* fc-rates-tcurve.html */
class __TwigTemplate_9572e23f8e70d3002681c2a368d39cc44e79c525e39ebd63542f16e7a8404e5d extends \Twig\Template
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
        $this->parent = $this->loadTemplate("base.html", "fc-rates-tcurve.html", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_meta($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 4
        echo "<meta name=\"description\" content=\"Monthly 3-month, 6-month, 1-year, 5-year, 10-year, 20-year, and 30-year Treasury yield forecasts and historical data are provided using our model.\"/>
";
    }

    // line 7
    public function block_staticlinks($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 8
        echo "<script src=\"https://code.highcharts.com/8.2/highcharts-more.js\"></script>
<script src=\"https://cdn.datatables.net/responsive/2.2.7/js/dataTables.responsive.min.js\"></script>
";
    }

    // line 12
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 13
        echo "<div class=\"row gx-0\">
\t";
        // line 14
        $this->loadTemplate("fc-rates-sidebar.html", "fc-rates-tcurve.html", 14)->display($context);
        // line 15
        echo "\t<div class=\"col-12 col-lg-8 col-xl-9 col-xxl-9 m-auto pt-0 px-2 pb-5\">
\t
\t\t<div class=\"row justify-content-center\" style=\"background-color:rgba(25, 50, 20, 0.1)\">
\t\t\t<div id=\"chart-container\" class=\"col-xl-9 col-lg-10 col-12-md\">
\t\t\t</div>
\t\t\t<div id=\"chart-container-2\" class=\"col-xl-9 col-lg-10 col-12-md\">
\t\t\t</div>
\t\t</div>
\t\t<div class=\"row justify-content-center pt-3\">

\t\t\t<div class=\"card border-secondary border-2 m-2 col-xl-8 col-md-10 col-sm-12\">
\t\t\t\t<div class=\"card-body\">
\t\t\t\t<h5 class=\"card-title\" style=\"color:rgb(33, 177, 151)\">Treasury Curve Forecast Data</h5>
\t\t\t\t<h6 class=\"card-subtitle mb-2 text-muted fst-italic\">monthly frequency represents average of daily values</h6>
\t\t\t\t<table id=\"table-container-2\" class=\"table data-table w-100\"></table>
\t\t\t\t</div>
\t\t\t</div>

\t\t
\t\t\t<div class=\"card border-secondary border-2 m-2 col-xl-8 col-md-10 col-sm-12\">
\t\t\t\t<div class=\"card-body\">
\t\t\t\t<h5 class=\"card-title\" style=\"color: darkblue\">Treasury Curve Historical Data</h5>
\t\t\t\t<h6 class=\"card-subtitle mb-2 text-muted fst-italic\">monthly frequency represents average of daily values</h6>
\t\t\t\t<table id=\"table-container\" class=\"table data-table w-100\"></table>
\t\t\t\t</div>
\t\t\t</div>

\t\t</div>
\t\t

\t\t
\t</div>
</div>
";
    }

    public function getTemplateName()
    {
        return "fc-rates-tcurve.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  76 => 15,  74 => 14,  71 => 13,  67 => 12,  61 => 8,  57 => 7,  52 => 4,  48 => 3,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"base.html\" %}

{% block meta %}
<meta name=\"description\" content=\"Monthly 3-month, 6-month, 1-year, 5-year, 10-year, 20-year, and 30-year Treasury yield forecasts and historical data are provided using our model.\"/>
{% endblock %}

{% block staticlinks %}
<script src=\"https://code.highcharts.com/8.2/highcharts-more.js\"></script>
<script src=\"https://cdn.datatables.net/responsive/2.2.7/js/dataTables.responsive.min.js\"></script>
{% endblock %}

{% block content %}
<div class=\"row gx-0\">
\t{% include 'fc-rates-sidebar.html' %}
\t<div class=\"col-12 col-lg-8 col-xl-9 col-xxl-9 m-auto pt-0 px-2 pb-5\">
\t
\t\t<div class=\"row justify-content-center\" style=\"background-color:rgba(25, 50, 20, 0.1)\">
\t\t\t<div id=\"chart-container\" class=\"col-xl-9 col-lg-10 col-12-md\">
\t\t\t</div>
\t\t\t<div id=\"chart-container-2\" class=\"col-xl-9 col-lg-10 col-12-md\">
\t\t\t</div>
\t\t</div>
\t\t<div class=\"row justify-content-center pt-3\">

\t\t\t<div class=\"card border-secondary border-2 m-2 col-xl-8 col-md-10 col-sm-12\">
\t\t\t\t<div class=\"card-body\">
\t\t\t\t<h5 class=\"card-title\" style=\"color:rgb(33, 177, 151)\">Treasury Curve Forecast Data</h5>
\t\t\t\t<h6 class=\"card-subtitle mb-2 text-muted fst-italic\">monthly frequency represents average of daily values</h6>
\t\t\t\t<table id=\"table-container-2\" class=\"table data-table w-100\"></table>
\t\t\t\t</div>
\t\t\t</div>

\t\t
\t\t\t<div class=\"card border-secondary border-2 m-2 col-xl-8 col-md-10 col-sm-12\">
\t\t\t\t<div class=\"card-body\">
\t\t\t\t<h5 class=\"card-title\" style=\"color: darkblue\">Treasury Curve Historical Data</h5>
\t\t\t\t<h6 class=\"card-subtitle mb-2 text-muted fst-italic\">monthly frequency represents average of daily values</h6>
\t\t\t\t<table id=\"table-container\" class=\"table data-table w-100\"></table>
\t\t\t\t</div>
\t\t\t</div>

\t\t</div>
\t\t

\t\t
\t</div>
</div>
{% endblock %}", "fc-rates-tcurve.html", "/var/www/econforecasting.com/public/templates/fc-rates-tcurve.html");
    }
}
