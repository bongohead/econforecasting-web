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

/* nc-gdp.html */
class __TwigTemplate_971b11a3a68d568655a46ba4733e3a55c85f35e983a059decd19487cbd22747a extends \Twig\Template
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
        $this->parent = $this->loadTemplate("base.html", "nc-gdp.html", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_meta($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 4
        echo "<meta name=\"description\" content=\"GDP nowcasts - a rolling estimate of current and future GDP growth based on the latest available economic data.\"/>
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
\t<div class=\"col px-0\">
\t
\t\t
\t\t<div class=\"row justify-content-center mx-3\" style=\"background-color:rgba(25, 50, 20, 0.05)\">
\t\t\t<div id=\"chart-container\" class=\"col-xl-6 col-lg-10 col-12-md px-2\">
\t\t\t</div>
\t\t\t<div class=\"col-xl-2 col-lg-2 col-8-md px-2\">
\t\t\t\t<span style=\"font-size:1.5rem;font-family:'Assistant', Arial, 'sans-serif';text-align:center; padding-top:50px\" class=\"text-econblue d-block\">Data Release Calendar</span>
\t\t\t\t<div class=\"overflow-auto border border-econblue rounded\"  style=\"height:300px;margin-top:20px;position:relative\" id=\"release-container\">
\t\t\t\t</div>
\t\t\t\t<span class=\"d-block text-end fst-italic text-muted\">Major releases highlighted in <span class=\"text-econlred\">red</span></span>
\t\t\t</div>
\t\t</div>
\t\t
\t\t<div class=\"container pb-5\">
\t\t\t\t<div class=\"row justify-content-center pt-3 px-3 mx-1\">
\t\t\t\t\t<div class=\"col-xl-5 col-lg-10 col-sm-12\" id=\"text-container\">
\t\t\t\t\t\t<div class=\"d-inline\"><span style=\"vertical-align:middle;font-size:1.4rem; color: var(--bs-econgreen)\">OVERVIEW</span></div>
\t\t\t\t\t\t<hr class=\"mt-0 mb-3 bg-econgreen\">
\t\t\t\t\t\t<p><span class=\"fw-bold fst-italic\">Nowcasting</span> is the prediction of the present, the near future, and the near past. Nowcasting is important in economics because many important macroeconomic statistics are released with a lengthy delay. For example, the Bureau of Economic Analysis releases quarterly GDP data typically two months after the quarter has already ended - a significant delay for any companies or individuals who need the data for planning and forecast models.</p>
\t\t\t\t\t\t<p>
\t\t\t\t\t\t<strong>Nowcasting is about deciphering key information about the state of the economy before official data is released.</strong> Because of the fundamentally urgent nature of nowcasting, it is important that nowcast models exploit any latest, high-frequency data available. This nowcast generates constantly rolling forecasts, updating these numbers in response to any new data releases.
\t\t\t\t\t\t</p>
\t\t\t\t\t\t<img class=\"me-2\" src=\"/static/cmefi_short.png\" width=\"16\" height=\"16\"><div class=\"d-inline\"><span style=\"vertical-align:middle;font-size:1.4rem; color: var(--bs-econgreen)\">DETAILED METHODOLOGY</span></div>
\t\t\t\t\t\t<hr class=\"mt-0 mb-3 bg-econgreen\">
\t\t\t\t\t\t<iframe src=\"https://econforecasting.com/static/nowcast-documentation.pdf\" width=\"100%\" height=\"500px\"></iframe>
\t\t\t\t\t\t<a href=\"https://econforecasting.com/static/nowcast-documentation.pdf\" target=\"_blank\">Download</a>
\t\t\t\t\t</div>
\t\t\t
\t\t\t\t\t<div class=\"card border-secondary border-2 m-2 col-xl-6 col-lg-10 col-sm-12 bg-white\">
\t\t\t\t\t\t<div class=\"card-body\" id=\"tables-container\">
\t\t\t\t\t\t\t<div class=\"py-1 px-2 bg-econblue d-inline-block text-white\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-bar-chart-fill\" viewBox=\"0 0 16 16\">
\t\t\t\t\t\t\t  <path d=\"M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z\"/>
\t\t\t\t\t\t\t</svg></div>
\t\t\t\t\t\t\t<div class=\"d-inline\"><span style=\"vertical-align:middle;font-size:1.4rem; color: var(--bs-econblue)\"><span id=\"vdate\"></span>nowcasts for GDP & components</span></div>
\t\t\t\t\t\t\t<hr class=\"mt-0 mb-3 bg-econblue\">
\t\t\t\t\t\t\t<p class=\"fst-italic\">All units are reported in terms of annualized % change except for net exports and change in private inventories, which are reported in billions of dollars.</p>
\t\t\t\t\t\t\t<table class=\"table data-table w-100\" id=\"gdp-table\"></table>

\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t
\t\t\t</div>
\t\t</div>

\t
\t</div>
</div>
";
    }

    public function getTemplateName()
    {
        return "nc-gdp.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  67 => 11,  63 => 10,  57 => 7,  52 => 4,  48 => 3,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"base.html\" %}

{% block meta %}
<meta name=\"description\" content=\"GDP nowcasts - a rolling estimate of current and future GDP growth based on the latest available economic data.\"/>
{% endblock %}

{% block staticlinks %}
{% endblock %}

{% block content %}
<div class=\"row gx-0\">
\t<div class=\"col px-0\">
\t
\t\t
\t\t<div class=\"row justify-content-center mx-3\" style=\"background-color:rgba(25, 50, 20, 0.05)\">
\t\t\t<div id=\"chart-container\" class=\"col-xl-6 col-lg-10 col-12-md px-2\">
\t\t\t</div>
\t\t\t<div class=\"col-xl-2 col-lg-2 col-8-md px-2\">
\t\t\t\t<span style=\"font-size:1.5rem;font-family:'Assistant', Arial, 'sans-serif';text-align:center; padding-top:50px\" class=\"text-econblue d-block\">Data Release Calendar</span>
\t\t\t\t<div class=\"overflow-auto border border-econblue rounded\"  style=\"height:300px;margin-top:20px;position:relative\" id=\"release-container\">
\t\t\t\t</div>
\t\t\t\t<span class=\"d-block text-end fst-italic text-muted\">Major releases highlighted in <span class=\"text-econlred\">red</span></span>
\t\t\t</div>
\t\t</div>
\t\t
\t\t<div class=\"container pb-5\">
\t\t\t\t<div class=\"row justify-content-center pt-3 px-3 mx-1\">
\t\t\t\t\t<div class=\"col-xl-5 col-lg-10 col-sm-12\" id=\"text-container\">
\t\t\t\t\t\t<div class=\"d-inline\"><span style=\"vertical-align:middle;font-size:1.4rem; color: var(--bs-econgreen)\">OVERVIEW</span></div>
\t\t\t\t\t\t<hr class=\"mt-0 mb-3 bg-econgreen\">
\t\t\t\t\t\t<p><span class=\"fw-bold fst-italic\">Nowcasting</span> is the prediction of the present, the near future, and the near past. Nowcasting is important in economics because many important macroeconomic statistics are released with a lengthy delay. For example, the Bureau of Economic Analysis releases quarterly GDP data typically two months after the quarter has already ended - a significant delay for any companies or individuals who need the data for planning and forecast models.</p>
\t\t\t\t\t\t<p>
\t\t\t\t\t\t<strong>Nowcasting is about deciphering key information about the state of the economy before official data is released.</strong> Because of the fundamentally urgent nature of nowcasting, it is important that nowcast models exploit any latest, high-frequency data available. This nowcast generates constantly rolling forecasts, updating these numbers in response to any new data releases.
\t\t\t\t\t\t</p>
\t\t\t\t\t\t<img class=\"me-2\" src=\"/static/cmefi_short.png\" width=\"16\" height=\"16\"><div class=\"d-inline\"><span style=\"vertical-align:middle;font-size:1.4rem; color: var(--bs-econgreen)\">DETAILED METHODOLOGY</span></div>
\t\t\t\t\t\t<hr class=\"mt-0 mb-3 bg-econgreen\">
\t\t\t\t\t\t<iframe src=\"https://econforecasting.com/static/nowcast-documentation.pdf\" width=\"100%\" height=\"500px\"></iframe>
\t\t\t\t\t\t<a href=\"https://econforecasting.com/static/nowcast-documentation.pdf\" target=\"_blank\">Download</a>
\t\t\t\t\t</div>
\t\t\t
\t\t\t\t\t<div class=\"card border-secondary border-2 m-2 col-xl-6 col-lg-10 col-sm-12 bg-white\">
\t\t\t\t\t\t<div class=\"card-body\" id=\"tables-container\">
\t\t\t\t\t\t\t<div class=\"py-1 px-2 bg-econblue d-inline-block text-white\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-bar-chart-fill\" viewBox=\"0 0 16 16\">
\t\t\t\t\t\t\t  <path d=\"M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z\"/>
\t\t\t\t\t\t\t</svg></div>
\t\t\t\t\t\t\t<div class=\"d-inline\"><span style=\"vertical-align:middle;font-size:1.4rem; color: var(--bs-econblue)\"><span id=\"vdate\"></span>nowcasts for GDP & components</span></div>
\t\t\t\t\t\t\t<hr class=\"mt-0 mb-3 bg-econblue\">
\t\t\t\t\t\t\t<p class=\"fst-italic\">All units are reported in terms of annualized % change except for net exports and change in private inventories, which are reported in billions of dollars.</p>
\t\t\t\t\t\t\t<table class=\"table data-table w-100\" id=\"gdp-table\"></table>

\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t
\t\t\t</div>
\t\t</div>

\t
\t</div>
</div>
{% endblock %}", "nc-gdp.html", "/var/www/econforecasting.com/public/templates/nc-gdp.html");
    }
}
