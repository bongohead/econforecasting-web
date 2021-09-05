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

/* csm-all-forecasts.html */
class __TwigTemplate_194ee816b763d592516e3b3e22c1510bc56904266c2a956713c072da14f19be3 extends \Twig\Template
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
        $this->parent = $this->loadTemplate("base.html", "csm-all-forecasts.html", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_meta($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 4
        echo "<meta name=\"description\" content=\"Aggregated macroeconomic forecasts for GDP, consumption, federal funds rates, Treasury yields, and others.\"/>
";
    }

    // line 7
    public function block_staticlinks($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 8
        echo "<script src=\"https://code.highcharts.com/9.1/highcharts-more.js\"></script>
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
        $this->loadTemplate("fc-rates-sidebar.html", "csm-all-forecasts.html", 14)->display($context);
        // line 15
        echo "\t<div class=\"col-12 col-lg-8 col-xl-9 col-xxl-9 m-auto pt-0 px-2 pb-5\">
\t
\t\t<div class=\"row justify-content-center px-3\" style=\"background-color:rgba(25, 50, 20, 0.1)\">
\t\t\t<div id=\"chart-container\" class=\"col-xl-9 col-lg-10 col-12-md\">
\t\t\t</div>
\t\t</div>
\t\t<div class=\"row justify-content-center pt-3 px-3\">
\t\t
\t\t\t<div class=\"col-xl-7 col-md-7 col-sm-12\">
\t\t\t\t<h2 class=\"text-decoration-underline\">Overview</h2>
\t\t\t</div>

\t\t\t<div class=\"card border-secondary border-2 m-2 col-xl-4 col-md-4 col-sm-10\" style=\"background-color:rgba(200, 200, 250, .1)\">
\t\t\t\t<div class=\"card-body\">
\t\t\t\t<h6>For a full 10-year forecast of all Treasury yields, please click <a href=\"/fc-rates-tcurve\">here.</a></h6>
\t\t\t\t<h6 class=\"card-subtitle mb-2 text-muted fst-italic\">*forecasted values</h6>
\t\t\t\t<table id=\"table-container\" class=\"table summary-table w-100\"></table>
\t\t\t\t</div>
\t\t\t</div>

\t\t
\t\t</div>
\t\t

\t\t
\t</div>
</div>
";
    }

    public function getTemplateName()
    {
        return "csm-all-forecasts.html";
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
<meta name=\"description\" content=\"Aggregated macroeconomic forecasts for GDP, consumption, federal funds rates, Treasury yields, and others.\"/>
{% endblock %}

{% block staticlinks %}
<script src=\"https://code.highcharts.com/9.1/highcharts-more.js\"></script>
<script src=\"https://cdn.datatables.net/responsive/2.2.7/js/dataTables.responsive.min.js\"></script>
{% endblock %}

{% block content %}
<div class=\"row gx-0\">
\t{% include 'fc-rates-sidebar.html' %}
\t<div class=\"col-12 col-lg-8 col-xl-9 col-xxl-9 m-auto pt-0 px-2 pb-5\">
\t
\t\t<div class=\"row justify-content-center px-3\" style=\"background-color:rgba(25, 50, 20, 0.1)\">
\t\t\t<div id=\"chart-container\" class=\"col-xl-9 col-lg-10 col-12-md\">
\t\t\t</div>
\t\t</div>
\t\t<div class=\"row justify-content-center pt-3 px-3\">
\t\t
\t\t\t<div class=\"col-xl-7 col-md-7 col-sm-12\">
\t\t\t\t<h2 class=\"text-decoration-underline\">Overview</h2>
\t\t\t</div>

\t\t\t<div class=\"card border-secondary border-2 m-2 col-xl-4 col-md-4 col-sm-10\" style=\"background-color:rgba(200, 200, 250, .1)\">
\t\t\t\t<div class=\"card-body\">
\t\t\t\t<h6>For a full 10-year forecast of all Treasury yields, please click <a href=\"/fc-rates-tcurve\">here.</a></h6>
\t\t\t\t<h6 class=\"card-subtitle mb-2 text-muted fst-italic\">*forecasted values</h6>
\t\t\t\t<table id=\"table-container\" class=\"table summary-table w-100\"></table>
\t\t\t\t</div>
\t\t\t</div>

\t\t
\t\t</div>
\t\t

\t\t
\t</div>
</div>
{% endblock %}", "csm-all-forecasts.html", "/var/www/econforecasting.com/public/templates/csm-all-forecasts.html");
    }
}
