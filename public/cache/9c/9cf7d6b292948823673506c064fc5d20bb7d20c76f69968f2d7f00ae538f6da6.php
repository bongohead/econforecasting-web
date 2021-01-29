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

/* ac-regions.html */
class __TwigTemplate_1575465283698c84790ce20c32eed00c32604c364e4c6eb6fdb1e1af47d77cb7 extends \Twig\Template
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
        $this->parent = $this->loadTemplate("base.html", "ac-regions.html", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_staticlinks($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 4
        echo "<script src=\"https://code.highcharts.com/modules/heatmap.js\"></script>
";
    }

    // line 7
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 8
        echo "<div class=\"row\">
\t";
        // line 9
        $this->loadTemplate("ac-sidebar.html", "ac-regions.html", 9)->display($context);
        // line 10
        echo "\t<div class=\"col-md-9 col-xl-10 ms-auto pt-4 px-2\">
\t
\t\t<div class=\"row justify-content-center py-2\">
\t\t\t<div class=\"card px-0\" style=\"max-width: 1200px\">
\t\t\t\t<h5 class=\"card-header\">Model Overview</h5>
\t\t\t\t<div class=\"card-body\">
\t\t\t\t\t<h5 class=\"card-title\">Cross-Region Correlation Index</h5>
\t\t\t\t\t<p class=\"card-text\">
\t\t\t\t\t<strong>What does this index measure?</strong><br>
\t\t\t\t\tThis index tracks the level of correlation between stock prices in different international economies; e.g. the correlation between the U.S. stock market and the Chinese stck market, and so on. The full list of tracked regions is available <a href='ac-regions-hm'>here</a>. When the index level is high, it means that different regional financial markets are moving closely with one another.
\t\t\t\t\t</p>
\t\t\t\t\t<p class=\"card-text\">
\t\t\t\t\t<strong>Why is this useful?</strong><br>
\t\t\t\t\tIn economic downturns, a sell-off in one country's stock market can trigger broader sell-offs in other countries, causing a contagion effect triggering a larger financial crisis. For example, during the global financial crisis, the crash in the U.S. stock market spread to infect countries globally. This index measures the degree of \"danger\" that a crisis in one country may infect the broader international financial market.
\t\t\t\t\t</p>
\t\t\t\t\t<p class=\"card-text\">
\t\t\t\t\t<strong>How do I interpret this index?</strong><br>
\t\t\t\t\tThis index tracks the strength of cross-regional stock market correlations between the world's major economies. The index is normalized to a level between zero and one hundred. High index values indicate that cross-regional return correlations are unusually high and the risk of a global financial crash is elevated.
\t\t\t\t\t</p>
\t\t\t\t\t<a href=\"#chart-container\" class=\"btn btn-primary\">Historical index data</a>
\t\t\t\t\t<a href=\"ac-regions-hm\" class=\"btn btn-danger\">Component heatmap</a>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t\t
\t\t<div class=\"row justify-content-center bg-light\">
\t\t\t<div class=\"container\" style=\"max-width:1200px\">
\t\t\t\t<div id=\"chart-container\"></div>
\t\t\t</div>
\t\t</div>
\t\t<div class=\"row justify-content-center pt-2\">
\t\t\t<div class=\"col-auto\" style=\"max-width:1200px\">
\t\t\t\t<h2 class=\"display-8\">Historical Data</h2>
\t\t\t\t<table id=\"table-container\" class=\"display\" width=\"500px\"></table>
\t\t\t</div>
\t\t</div>

\t\t
\t</div>
</div>
";
    }

    public function getTemplateName()
    {
        return "ac-regions.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  65 => 10,  63 => 9,  60 => 8,  56 => 7,  51 => 4,  47 => 3,  36 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"base.html\" %}

{% block staticlinks %}
<script src=\"https://code.highcharts.com/modules/heatmap.js\"></script>
{% endblock %}

{% block content %}
<div class=\"row\">
\t{% include 'ac-sidebar.html' %}
\t<div class=\"col-md-9 col-xl-10 ms-auto pt-4 px-2\">
\t
\t\t<div class=\"row justify-content-center py-2\">
\t\t\t<div class=\"card px-0\" style=\"max-width: 1200px\">
\t\t\t\t<h5 class=\"card-header\">Model Overview</h5>
\t\t\t\t<div class=\"card-body\">
\t\t\t\t\t<h5 class=\"card-title\">Cross-Region Correlation Index</h5>
\t\t\t\t\t<p class=\"card-text\">
\t\t\t\t\t<strong>What does this index measure?</strong><br>
\t\t\t\t\tThis index tracks the level of correlation between stock prices in different international economies; e.g. the correlation between the U.S. stock market and the Chinese stck market, and so on. The full list of tracked regions is available <a href='ac-regions-hm'>here</a>. When the index level is high, it means that different regional financial markets are moving closely with one another.
\t\t\t\t\t</p>
\t\t\t\t\t<p class=\"card-text\">
\t\t\t\t\t<strong>Why is this useful?</strong><br>
\t\t\t\t\tIn economic downturns, a sell-off in one country's stock market can trigger broader sell-offs in other countries, causing a contagion effect triggering a larger financial crisis. For example, during the global financial crisis, the crash in the U.S. stock market spread to infect countries globally. This index measures the degree of \"danger\" that a crisis in one country may infect the broader international financial market.
\t\t\t\t\t</p>
\t\t\t\t\t<p class=\"card-text\">
\t\t\t\t\t<strong>How do I interpret this index?</strong><br>
\t\t\t\t\tThis index tracks the strength of cross-regional stock market correlations between the world's major economies. The index is normalized to a level between zero and one hundred. High index values indicate that cross-regional return correlations are unusually high and the risk of a global financial crash is elevated.
\t\t\t\t\t</p>
\t\t\t\t\t<a href=\"#chart-container\" class=\"btn btn-primary\">Historical index data</a>
\t\t\t\t\t<a href=\"ac-regions-hm\" class=\"btn btn-danger\">Component heatmap</a>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t\t
\t\t<div class=\"row justify-content-center bg-light\">
\t\t\t<div class=\"container\" style=\"max-width:1200px\">
\t\t\t\t<div id=\"chart-container\"></div>
\t\t\t</div>
\t\t</div>
\t\t<div class=\"row justify-content-center pt-2\">
\t\t\t<div class=\"col-auto\" style=\"max-width:1200px\">
\t\t\t\t<h2 class=\"display-8\">Historical Data</h2>
\t\t\t\t<table id=\"table-container\" class=\"display\" width=\"500px\"></table>
\t\t\t</div>
\t\t</div>

\t\t
\t</div>
</div>
{% endblock %}", "ac-regions.html", "/var/www/econforecasting.com/public/templates/ac-regions.html");
    }
}
