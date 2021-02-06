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

/* ac-assets.html */
class __TwigTemplate_e302131279aad8628c1f934c2467b206e8abc97669846bf344b960b10e43308b extends \Twig\Template
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
        $this->parent = $this->loadTemplate("base.html", "ac-assets.html", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_meta($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 4
        echo "<meta name=\"description\" content=\"The asset cross-correlation index measures the degree to which different asset classes prices affect other asset class prices. In general, it is a measure of the level of systemic risk in the economy.\"/>
<link rel=\"canonical\" href=\"https://econforecasting.com/ac-assets\">
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
        $this->loadTemplate("ac-sidebar.html", "ac-assets.html", 13)->display($context);
        // line 14
        echo "\t<div class=\"col-md-9 col-xl-10 ms-auto pt-4 px-2\">
\t
\t\t<div class=\"row justify-content-center py-2\">
\t\t\t<div class=\"card px-0\" style=\"max-width: 1200px\">
\t\t\t\t<h5 class=\"card-header\">Model Overview</h5>
\t\t\t\t<div class=\"card-body\">
\t\t\t\t\t<h5 class=\"card-title\">Cross-Asset Correlation Index</h5>
\t\t\t\t\t<p class=\"card-text\">
\t\t\t\t\t<strong>What does this index measure?</strong><br>
\t\t\t\t\tThis index tracks the level of correlation between different asset classes in the macroeconomy; e.g. the correlation between stocks and bonds, bonds and real estate, and so on. The full list of tracked asset classes is available <a href='ac-assets-hm'>here</a>. When the index level is high, it means that different asset classes are moving closely with one another.
\t\t\t\t\t</p>
\t\t\t\t\t<p class=\"card-text\">
\t\t\t\t\t<strong>Why is this useful?</strong><br>
\t\t\t\t\tIn economic downturns, a sell-off in one asset class can trigger broader sell-offs in other asset classes, causing a contagion effect triggering a larger financial crisis. For example, during the global financial crisis, declines in real estate prices triggered sell-offs in mortgage-backed bonds and later equity prices. This index measures the degree of \"danger\" that a crisis in one asset class may infect the broader financial market.
\t\t\t\t\t<br>
\t\t\t\t\tAdditionally, the level of cross-asset correlation in the economy is a leading indicator for bubbles and economic downturns. Cross-asset correlations are typically high when investors are \"searching for yield\" - i.e., the demand for one asset has spilled over into general markets, which can lead to a general bubble in financial assets.
\t\t\t\t\t</p>
\t\t\t\t\t<p class=\"card-text\">
\t\t\t\t\t<strong>How do I interpret this index?</strong><br>
\t\t\t\t\tThis index tracks the strength of cross-asset correlations between major asset classes in the international economy. The index is normalized to a level between zero and one hundred. High index values indicate that cross-asset return correlations are unusually high and the risk of a broad financial crash is high.
\t\t\t\t\t</p>
\t\t\t\t\t<a href=\"#chart-container\" class=\"btn btn-primary\">Historical index data</a>
\t\t\t\t\t<a href=\"ac-assets-hm\" class=\"btn btn-danger\">Component heatmap</a>
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
\t\t\t\t<table id=\"table-container\" class=\"table\" style=\"min-width:25rem\"></table>
\t\t\t</div>
\t\t</div>

\t\t
\t</div>
</div>
";
    }

    public function getTemplateName()
    {
        return "ac-assets.html";
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
<meta name=\"description\" content=\"The asset cross-correlation index measures the degree to which different asset classes prices affect other asset class prices. In general, it is a measure of the level of systemic risk in the economy.\"/>
<link rel=\"canonical\" href=\"https://econforecasting.com/ac-assets\">
{% endblock %}

{% block staticlinks %}
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
\t\t\t\t\t<h5 class=\"card-title\">Cross-Asset Correlation Index</h5>
\t\t\t\t\t<p class=\"card-text\">
\t\t\t\t\t<strong>What does this index measure?</strong><br>
\t\t\t\t\tThis index tracks the level of correlation between different asset classes in the macroeconomy; e.g. the correlation between stocks and bonds, bonds and real estate, and so on. The full list of tracked asset classes is available <a href='ac-assets-hm'>here</a>. When the index level is high, it means that different asset classes are moving closely with one another.
\t\t\t\t\t</p>
\t\t\t\t\t<p class=\"card-text\">
\t\t\t\t\t<strong>Why is this useful?</strong><br>
\t\t\t\t\tIn economic downturns, a sell-off in one asset class can trigger broader sell-offs in other asset classes, causing a contagion effect triggering a larger financial crisis. For example, during the global financial crisis, declines in real estate prices triggered sell-offs in mortgage-backed bonds and later equity prices. This index measures the degree of \"danger\" that a crisis in one asset class may infect the broader financial market.
\t\t\t\t\t<br>
\t\t\t\t\tAdditionally, the level of cross-asset correlation in the economy is a leading indicator for bubbles and economic downturns. Cross-asset correlations are typically high when investors are \"searching for yield\" - i.e., the demand for one asset has spilled over into general markets, which can lead to a general bubble in financial assets.
\t\t\t\t\t</p>
\t\t\t\t\t<p class=\"card-text\">
\t\t\t\t\t<strong>How do I interpret this index?</strong><br>
\t\t\t\t\tThis index tracks the strength of cross-asset correlations between major asset classes in the international economy. The index is normalized to a level between zero and one hundred. High index values indicate that cross-asset return correlations are unusually high and the risk of a broad financial crash is high.
\t\t\t\t\t</p>
\t\t\t\t\t<a href=\"#chart-container\" class=\"btn btn-primary\">Historical index data</a>
\t\t\t\t\t<a href=\"ac-assets-hm\" class=\"btn btn-danger\">Component heatmap</a>
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
\t\t\t\t<table id=\"table-container\" class=\"table\" style=\"min-width:25rem\"></table>
\t\t\t</div>
\t\t</div>

\t\t
\t</div>
</div>
{% endblock %}", "ac-assets.html", "/var/www/econforecasting.com/public/templates/ac-assets.html");
    }
}
