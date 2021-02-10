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

/* fc-rates-ffr.html */
class __TwigTemplate_1e89146a48b8cd5141546927cd1ee93654bf9a9145297c79e344400ff79e760a extends \Twig\Template
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
        $this->parent = $this->loadTemplate("base.html", "fc-rates-ffr.html", 1);
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
    }

    // line 10
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 11
        echo "<div class=\"row\">
\t";
        // line 12
        $this->loadTemplate("fc-rates-sidebar.html", "fc-rates-ffr.html", 12)->display($context);
        // line 13
        echo "\t<div class=\"col-md-9 col-xl-10 ms-auto pt-0 px-0\">
\t
\t\t<div class=\"row justify-content-center\" style=\"background-color:rgba(25, 50, 20, 0.1)\">
\t\t\t<div id=\"chart-container\" class=\"col-xl-9 col-lg-10 col-12-md\">
\t\t\t</div>
\t\t</div>

\t\t
\t</div>
</div>
";
    }

    public function getTemplateName()
    {
        return "fc-rates-ffr.html";
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
<meta name=\"description\" content=\"Monthly 3-month, 6-month, 1-year, 5-year, 10-year, 20-year, and 30-year Treasury yield forecasts and historical data are provided using our model.\"/>
{% endblock %}

{% block staticlinks %}
{% endblock %}

{% block content %}
<div class=\"row\">
\t{% include 'fc-rates-sidebar.html' %}
\t<div class=\"col-md-9 col-xl-10 ms-auto pt-0 px-0\">
\t
\t\t<div class=\"row justify-content-center\" style=\"background-color:rgba(25, 50, 20, 0.1)\">
\t\t\t<div id=\"chart-container\" class=\"col-xl-9 col-lg-10 col-12-md\">
\t\t\t</div>
\t\t</div>

\t\t
\t</div>
</div>
{% endblock %}", "fc-rates-ffr.html", "/var/www/econforecasting.com/public/templates/fc-rates-ffr.html");
    }
}
