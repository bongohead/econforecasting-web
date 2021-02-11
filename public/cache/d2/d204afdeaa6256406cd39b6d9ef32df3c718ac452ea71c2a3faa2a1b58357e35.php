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
class __TwigTemplate_d5ce79fa8b112714ec4fe530757fbe022486cf32925156513a755b61c779329e extends \Twig\Template
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
        $this->parent = $this->loadTemplate("base.html", "ac-regions.html", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_meta($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 4
        echo "<meta name=\"description\" content=\"The region cross-correlation index measures the degree to which different asset prices in one country affect asset prices in other countries. In general, it is a measure of the level of systemic risk in the global economy.\"/>
<link rel=\"canonical\" href=\"https://econforecasting.com/ac-regions\">
";
    }

    // line 8
    public function block_staticlinks($context, array $blocks = [])
    {
        $macros = $this->macros;
    }

    // line 11
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 12
        echo "<div class=\"row\">
\t";
        // line 13
        $this->loadTemplate("ac-sidebar.html", "ac-regions.html", 13)->display($context);
        // line 14
        echo "\t<div class=\"col-12 col-lg-8 col-xl-9 col-xxl-9 m-auto pt-0 px-2 pb-5\">
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
\t\t\t<div class=\"col-auto\" style=\"\">
\t\t\t\t<h2 class=\"display-8\">Historical Data</h2>
\t\t\t\t<table id=\"table-container\" class=\"table data-table\" style=\"min-width:25rem\"></table>
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
        return array (  73 => 14,  71 => 13,  68 => 12,  64 => 11,  58 => 8,  52 => 4,  48 => 3,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"base.html\" %}

{% block meta %}
<meta name=\"description\" content=\"The region cross-correlation index measures the degree to which different asset prices in one country affect asset prices in other countries. In general, it is a measure of the level of systemic risk in the global economy.\"/>
<link rel=\"canonical\" href=\"https://econforecasting.com/ac-regions\">
{% endblock %}

{% block staticlinks %}
{% endblock %}

{% block content %}
<div class=\"row\">
\t{% include 'ac-sidebar.html' %}
\t<div class=\"col-12 col-lg-8 col-xl-9 col-xxl-9 m-auto pt-0 px-2 pb-5\">
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
\t\t\t<div class=\"col-auto\" style=\"\">
\t\t\t\t<h2 class=\"display-8\">Historical Data</h2>
\t\t\t\t<table id=\"table-container\" class=\"table data-table\" style=\"min-width:25rem\"></table>
\t\t\t</div>
\t\t</div>

\t\t
\t</div>
</div>
{% endblock %}", "ac-regions.html", "/var/www/econforecasting.com/public/templates/ac-regions.html");
    }
}
