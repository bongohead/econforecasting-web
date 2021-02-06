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
class __TwigTemplate_27075bda472814d76ace8357e2feb7ad9af1e1a33f41779ced050bb2484aa139 extends \Twig\Template
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
        echo "<meta name=\"description\" content=\"Monthly 3-month, 6-month, 1-year, 5-year, 10-year, 20-year, and 30-year Treasury yield forecasts and historical data.\"/>
";
    }

    // line 7
    public function block_staticlinks($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 8
        echo "<script src=\"https://code.highcharts.com/8.2/highcharts-more.js\"></script>
";
    }

    // line 11
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 12
        echo "<div class=\"row\">
\t";
        // line 13
        $this->loadTemplate("fc-rates-sidebar.html", "fc-rates-tcurve.html", 13)->display($context);
        // line 14
        echo "\t<div class=\"col-md-9 col-xl-10 ms-auto pt-0 px-2\">
\t
\t\t<div class=\"row justify-content-center bg-light\">
\t\t\t<div id=\"chart-container\" class=\"col-xl-9 col-lg-10 col-12-md\">
\t\t\t</div>
\t\t\t<div id=\"chart-container-2\" class=\"col-xl-9 col-lg-10 col-12-md\">
\t\t\t</div>
\t\t</div>
\t\t<div class=\"row justify-content-center pt-3\">
\t\t\t<div class=\"card border-secondary border-2 m-2 col-xl-4 col-md-6 col-sm-8\">
\t\t\t\t<div class=\"card-body\">
\t\t\t\t<h5 class=\"card-title\">Historical Data</h5>
\t\t\t\t<h6 class=\"card-subtitle mb-2 text-muted\">Daily Frequency</h6>
\t\t\t\t<table id=\"table-container\" class=\"table w-100\"></table>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\"card border-secondary border-2 m-2 col-xl-4 col-md-6 col-sm-8\">
\t\t\t\t<div class=\"card-body\">
\t\t\t\t<h5 class=\"card-title text-danger\">Forecast Data</h5>
\t\t\t\t<h6 class=\"card-subtitle mb-2 text-muted\">Monthly Frequency</h6>
\t\t\t\t<table id=\"table-container-2\" class=\"table w-100\"></table>
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
        return array (  75 => 14,  73 => 13,  70 => 12,  66 => 11,  61 => 8,  57 => 7,  52 => 4,  48 => 3,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"base.html\" %}

{% block meta %}
<meta name=\"description\" content=\"Monthly 3-month, 6-month, 1-year, 5-year, 10-year, 20-year, and 30-year Treasury yield forecasts and historical data.\"/>
{% endblock %}

{% block staticlinks %}
<script src=\"https://code.highcharts.com/8.2/highcharts-more.js\"></script>
{% endblock %}

{% block content %}
<div class=\"row\">
\t{% include 'fc-rates-sidebar.html' %}
\t<div class=\"col-md-9 col-xl-10 ms-auto pt-0 px-2\">
\t
\t\t<div class=\"row justify-content-center bg-light\">
\t\t\t<div id=\"chart-container\" class=\"col-xl-9 col-lg-10 col-12-md\">
\t\t\t</div>
\t\t\t<div id=\"chart-container-2\" class=\"col-xl-9 col-lg-10 col-12-md\">
\t\t\t</div>
\t\t</div>
\t\t<div class=\"row justify-content-center pt-3\">
\t\t\t<div class=\"card border-secondary border-2 m-2 col-xl-4 col-md-6 col-sm-8\">
\t\t\t\t<div class=\"card-body\">
\t\t\t\t<h5 class=\"card-title\">Historical Data</h5>
\t\t\t\t<h6 class=\"card-subtitle mb-2 text-muted\">Daily Frequency</h6>
\t\t\t\t<table id=\"table-container\" class=\"table w-100\"></table>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\"card border-secondary border-2 m-2 col-xl-4 col-md-6 col-sm-8\">
\t\t\t\t<div class=\"card-body\">
\t\t\t\t<h5 class=\"card-title text-danger\">Forecast Data</h5>
\t\t\t\t<h6 class=\"card-subtitle mb-2 text-muted\">Monthly Frequency</h6>
\t\t\t\t<table id=\"table-container-2\" class=\"table w-100\"></table>
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
