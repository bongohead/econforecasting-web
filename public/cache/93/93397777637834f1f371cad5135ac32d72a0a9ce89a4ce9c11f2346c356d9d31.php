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

/* fc-rates-t.html */
class __TwigTemplate_ff1771623a83ffd6bd5b88fc1656ef8efb3f8e421e612460d4b8e6c7c3114337 extends \Twig\Template
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
        $this->parent = $this->loadTemplate("base.html", "fc-rates-t.html", 1);
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
    }

    // line 10
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 11
        echo "<div class=\"row gx-0\">
\t";
        // line 12
        $this->loadTemplate("fc-rates-sidebar.html", "fc-rates-t.html", 12)->display($context);
        // line 13
        echo "\t<div class=\"col-12 col-lg-8 col-xl-9 col-xxl-9 m-auto pt-0 px-2 pb-5\">
\t\t<div class=\"row justify-content-center\">
\t\t\t<div class=\"col-md-10 col-xl-9 py-2\">
\t\t\t\t<div class=\"card mt-2\">
\t\t\t\t\t<h5 class=\"card-header text-white\" style=\"background-color:var(--bs-econblue)\"><span class=\"t-varname\"></span> Forecast - 10 Years</h5>
\t\t\t\t\t<div class=\"card-body\">
\t\t\t\t\t\t<p class=\"card-text\">
\t\t\t\t\t\tThis forecast predicts the monthly average values of the <span class=\"t-varname\"></span> for the next 10 years.
\t\t\t\t\t\t</p>
\t\t\t\t\t\t<p class=\"card-text\">
\t\t\t\t\t\tThese values can be interpreted as a 'market consensus' forecast - the forecasts are derived from a model which uses spot and futures market prices to directly estimate market-implied Treasury prices, using minimal extraneous assumptions during the modeling process. For technical details, see <a href=\"/fc-rates-t-info\">the documentation</a>. For forecasts for other Treasury maturities, click <a href=\"/fc-rates-tcurve\">here</a>.
\t\t\t\t\t\t</p>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>

\t\t</div>
\t\t<div class=\"row justify-content-center bg-light\">
\t\t\t<div id=\"chart-container\" class=\"col-xl-8 col-lg-9 col-12-md\">
\t\t\t</div>
\t\t</div>
\t\t<div class=\"row justify-content-center pt-3\">
\t\t<!--
\t\t\t<div class=\"col-auto bd-callout bd-callout-info\" style=\"\">
\t\t\t\t<h2 class=\"display-8\">Historical Data</h2>
\t\t\t\t<table id=\"table-container\" class=\"display\" style=\"min-width:25rem\"></table>
\t\t\t</div>
\t\t-->
\t\t\t<div class=\"card border-secondary border-2 m-2 col-xl-4 col-md-6 col-sm-8\">
\t\t\t\t<div class=\"card-body\">
\t\t\t\t<h5 class=\"card-title\">Historical Data</h5>
\t\t\t\t<h6 class=\"card-subtitle mb-2 text-muted\">Daily Frequency</h6>
\t\t\t\t<table id=\"table-container\" class=\"table data-table w-100\"></table>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\"card border-secondary border-2 m-2 col-xl-4 col-md-6 col-sm-8\">
\t\t\t\t<div class=\"card-body\">
\t\t\t\t<h5 class=\"card-title text-danger\">Forecast Data</h5>
\t\t\t\t<h6 class=\"card-subtitle mb-2 text-muted\">Monthly Frequency</h6>
\t\t\t\t<table id=\"table-container-2\" class=\"table data-table w-100\"></table>
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
        return "fc-rates-t.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  72 => 13,  70 => 12,  67 => 11,  63 => 10,  57 => 7,  52 => 4,  48 => 3,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"base.html\" %}

{% block meta %}
<meta name=\"description\" content=\"Monthly 3-month, 6-month, 1-year, 5-year, 10-year, 20-year, and 30-year Treasury yield forecasts and historical data.\"/>
{% endblock %}

{% block staticlinks %}
{% endblock %}

{% block content %}
<div class=\"row gx-0\">
\t{% include 'fc-rates-sidebar.html' %}
\t<div class=\"col-12 col-lg-8 col-xl-9 col-xxl-9 m-auto pt-0 px-2 pb-5\">
\t\t<div class=\"row justify-content-center\">
\t\t\t<div class=\"col-md-10 col-xl-9 py-2\">
\t\t\t\t<div class=\"card mt-2\">
\t\t\t\t\t<h5 class=\"card-header text-white\" style=\"background-color:var(--bs-econblue)\"><span class=\"t-varname\"></span> Forecast - 10 Years</h5>
\t\t\t\t\t<div class=\"card-body\">
\t\t\t\t\t\t<p class=\"card-text\">
\t\t\t\t\t\tThis forecast predicts the monthly average values of the <span class=\"t-varname\"></span> for the next 10 years.
\t\t\t\t\t\t</p>
\t\t\t\t\t\t<p class=\"card-text\">
\t\t\t\t\t\tThese values can be interpreted as a 'market consensus' forecast - the forecasts are derived from a model which uses spot and futures market prices to directly estimate market-implied Treasury prices, using minimal extraneous assumptions during the modeling process. For technical details, see <a href=\"/fc-rates-t-info\">the documentation</a>. For forecasts for other Treasury maturities, click <a href=\"/fc-rates-tcurve\">here</a>.
\t\t\t\t\t\t</p>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>

\t\t</div>
\t\t<div class=\"row justify-content-center bg-light\">
\t\t\t<div id=\"chart-container\" class=\"col-xl-8 col-lg-9 col-12-md\">
\t\t\t</div>
\t\t</div>
\t\t<div class=\"row justify-content-center pt-3\">
\t\t<!--
\t\t\t<div class=\"col-auto bd-callout bd-callout-info\" style=\"\">
\t\t\t\t<h2 class=\"display-8\">Historical Data</h2>
\t\t\t\t<table id=\"table-container\" class=\"display\" style=\"min-width:25rem\"></table>
\t\t\t</div>
\t\t-->
\t\t\t<div class=\"card border-secondary border-2 m-2 col-xl-4 col-md-6 col-sm-8\">
\t\t\t\t<div class=\"card-body\">
\t\t\t\t<h5 class=\"card-title\">Historical Data</h5>
\t\t\t\t<h6 class=\"card-subtitle mb-2 text-muted\">Daily Frequency</h6>
\t\t\t\t<table id=\"table-container\" class=\"table data-table w-100\"></table>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\"card border-secondary border-2 m-2 col-xl-4 col-md-6 col-sm-8\">
\t\t\t\t<div class=\"card-body\">
\t\t\t\t<h5 class=\"card-title text-danger\">Forecast Data</h5>
\t\t\t\t<h6 class=\"card-subtitle mb-2 text-muted\">Monthly Frequency</h6>
\t\t\t\t<table id=\"table-container-2\" class=\"table data-table w-100\"></table>
\t\t\t\t</div>
\t\t\t</div>

\t\t</div>
\t\t

\t\t
\t</div>
</div>
{% endblock %}", "fc-rates-t.html", "/var/www/econforecasting.com/public/templates/fc-rates-t.html");
    }
}
