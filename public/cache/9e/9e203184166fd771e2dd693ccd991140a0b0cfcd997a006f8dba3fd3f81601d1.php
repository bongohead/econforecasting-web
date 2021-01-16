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
class __TwigTemplate_20ec55ccb91cd0b0ed20e3476920df3c687e3396f2b7fa73120a4a49610f894d extends \Twig\Template
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
        $this->parent = $this->loadTemplate("base.html", "ac-assets-hm.html", 1);
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
        echo "    
";
        // line 9
        $this->loadTemplate("ac-sidebar.html", "ac-assets-hm.html", 9)->display($context);
        // line 10
        echo "<main class=\"col-md-9 col-lg-10 ml-sm-auto pt-4 px-2\" id=\"main\">

\t<div class=\"row\" style =\"max-width:1200px\">
\t\t<div class=\"col-lg-12\">
\t\t\t<div id=\"heatmap-container\"></div>
\t\t</div>
\t</div>

\t<div class=\"row justify-content-end\" style =\"max-width:1200px\">
\t\t<div class=\"col-lg-3\">
\t\t\t<form class=\"form-row justify-content-center\" method=\"post\" action=\"\" id=\"corrselector\">
\t\t\t  <div class=\"input-group input-group-sm\">
\t\t\t\t<div class=\"input-group-prepend\">
\t\t\t\t  <div class=\"input-group-text\">Change Roll Window:</div>
\t\t\t\t</div>
\t\t\t\t<select class=\"form-control form-control-sm\" id=\"roll\">
\t\t\t\t\t<option value=\"30\">30</option>
\t\t\t\t\t<option value=\"90\">90</option>
\t\t\t\t\t<option value=\"180\">180</option>
\t\t\t\t</select>
\t\t\t</div>
\t\t\t</form>
\t\t</div>
\t</div>
    
</main>

    
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
        return array (  65 => 10,  63 => 9,  60 => 8,  56 => 7,  51 => 4,  47 => 3,  36 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"base.html\" %}

{% block staticlinks %}
<script src=\"https://code.highcharts.com/modules/heatmap.js\"></script>
{% endblock %}

{% block content %}
    
{% include 'ac-sidebar.html' %}
<main class=\"col-md-9 col-lg-10 ml-sm-auto pt-4 px-2\" id=\"main\">

\t<div class=\"row\" style =\"max-width:1200px\">
\t\t<div class=\"col-lg-12\">
\t\t\t<div id=\"heatmap-container\"></div>
\t\t</div>
\t</div>

\t<div class=\"row justify-content-end\" style =\"max-width:1200px\">
\t\t<div class=\"col-lg-3\">
\t\t\t<form class=\"form-row justify-content-center\" method=\"post\" action=\"\" id=\"corrselector\">
\t\t\t  <div class=\"input-group input-group-sm\">
\t\t\t\t<div class=\"input-group-prepend\">
\t\t\t\t  <div class=\"input-group-text\">Change Roll Window:</div>
\t\t\t\t</div>
\t\t\t\t<select class=\"form-control form-control-sm\" id=\"roll\">
\t\t\t\t\t<option value=\"30\">30</option>
\t\t\t\t\t<option value=\"90\">90</option>
\t\t\t\t\t<option value=\"180\">180</option>
\t\t\t\t</select>
\t\t\t</div>
\t\t\t</form>
\t\t</div>
\t</div>
    
</main>

    
{% endblock %}", "ac-assets-hm.html", "/var/www/econforecasting.com/public/templates/ac-assets-hm.html");
    }
}
