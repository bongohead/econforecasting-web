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

/* ac-assets-hm.html */
class __TwigTemplate_84ca99f1d5c928c791295b8dcd959aa421906bd96173bbd0101630e08b4a10f3 extends \Twig\Template
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
        $this->parent = $this->loadTemplate("base.html", "ac-assets-hm.html", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_meta($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 4
        echo "<meta name=\"description\" content=\"The asset cross-correlation index measures the degree to which different asset classes prices affect other asset class prices. In general, it is a measure of the level of systemic risk in the economy.\"/>
<link rel=\"canonical\" href=\"https://econforecasting.com/ac-assets-hm\">
";
    }

    // line 8
    public function block_staticlinks($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 9
        echo "<script src=\"https://code.highcharts.com/8.2/modules/heatmap.js\"></script>
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
        $this->loadTemplate("ac-sidebar.html", "ac-assets-hm.html", 14)->display($context);
        // line 15
        echo "\t<div class=\"col-12 col-lg-8 col-xl-9 col-xxl-9 m-auto pt-0 px-2 pb-5\">
\t
\t\t<div class=\"row justify-content-center py-2\">
\t\t\t<div class=\"card px-0\" style=\"max-width: 1200px\">
\t\t\t\t<div class=\"card-body\">
\t\t\t\t\t<h5 class=\"card-title\">Asset Class Correlation Heatmap</h5>
\t\t\t\t\t<p class=\"card-text\">
\t\t\t\t\tThis heatmap measures the correlation between returns of the world's major asset classes. Click the arrow buttons to see how cross-asset correlation has changed over time.
\t\t\t\t\t</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>

\t\t<div class=\"row justify-content-center\">
\t\t\t<div class=\"container\" style=\"max-width:1200px\">
\t\t\t\t<div id=\"heatmap-container\"></div>
\t\t\t</div>
\t\t</div>

\t\t
\t</div>
</div>
";
    }

    public function getTemplateName()
    {
        return "ac-assets-hm.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  76 => 15,  74 => 14,  71 => 13,  67 => 12,  62 => 9,  58 => 8,  52 => 4,  48 => 3,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"base.html\" %}

{% block meta %}
<meta name=\"description\" content=\"The asset cross-correlation index measures the degree to which different asset classes prices affect other asset class prices. In general, it is a measure of the level of systemic risk in the economy.\"/>
<link rel=\"canonical\" href=\"https://econforecasting.com/ac-assets-hm\">
{% endblock %}

{% block staticlinks %}
<script src=\"https://code.highcharts.com/8.2/modules/heatmap.js\"></script>
{% endblock %}

{% block content %}
<div class=\"row gx-0\">
\t{% include 'ac-sidebar.html' %}
\t<div class=\"col-12 col-lg-8 col-xl-9 col-xxl-9 m-auto pt-0 px-2 pb-5\">
\t
\t\t<div class=\"row justify-content-center py-2\">
\t\t\t<div class=\"card px-0\" style=\"max-width: 1200px\">
\t\t\t\t<div class=\"card-body\">
\t\t\t\t\t<h5 class=\"card-title\">Asset Class Correlation Heatmap</h5>
\t\t\t\t\t<p class=\"card-text\">
\t\t\t\t\tThis heatmap measures the correlation between returns of the world's major asset classes. Click the arrow buttons to see how cross-asset correlation has changed over time.
\t\t\t\t\t</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>

\t\t<div class=\"row justify-content-center\">
\t\t\t<div class=\"container\" style=\"max-width:1200px\">
\t\t\t\t<div id=\"heatmap-container\"></div>
\t\t\t</div>
\t\t</div>

\t\t
\t</div>
</div>
{% endblock %}", "ac-assets-hm.html", "/var/www/econforecasting.com/public/templates/ac-assets-hm.html");
    }
}
