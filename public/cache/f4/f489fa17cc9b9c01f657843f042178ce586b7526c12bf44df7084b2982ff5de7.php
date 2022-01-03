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

/* ac-sidebar.html */
class __TwigTemplate_e25ee183ff47311ae1ec94944de5f4825819bf344c398a04ad32ee0c7755e900 extends \Twig\Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 1
        echo "<nav class=\"sidebar col-lg-auto d-none d-lg-block px-0 py-2 bg-light\" id=\"sidebar\"> <!-- Hide Sidebar for XS to M Devices -->
\t<div class=\"nav flex-column\">
\t\t<a href=\"#cross-asset\" data-bs-toggle=\"collapse\" class=\"nav-link\">
\t\t\t<div>
\t\t\t\t<span class=\"fa fa-list fa-fw me-1\"></span> 
\t\t\t\t<span>Cross Asset Correlation</span>
\t\t\t\t<span class=\"fas fa-caret-down ms-auto\"></span>
\t\t\t</div>
\t\t</a>
\t\t<div id='cross-asset' class=\"collapse show sidebar-submenu\">
\t\t\t<a class=\"text-truncate\" href=\"/ac-assets\">
\t\t\t\t<span class=\"fas fa-info-circle\"></span><span class=\"ps-2\">Index Overview</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/ac-assets#chart-container\">
\t\t\t\t<span class=\"fas fa-chart-area\"></span><span class=\"ps-2\">Index Data</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/ac-assets-hm\">
\t\t\t\t<span class=\"fas fa-table\"></span><span class=\"ps-2\">Asset Class Heatmap</span>
\t\t\t</a>
\t\t</div>\t\t\t\t
\t\t
\t\t<a href=\"#cross-region\" data-bs-toggle=\"collapse\" class=\"nav-link\">
\t\t\t<div>
\t\t\t\t<span class=\"fas fa-globe-americas fas-fw me-1\"></span> 
\t\t\t\t<span>Cross Region Correlation</span>
\t\t\t\t<span class=\"fas fa-caret-down ml-auto\"></span>
\t\t\t</div>
\t\t</a>
\t\t<div id='cross-region' class=\"collapse show sidebar-submenu\">
\t\t\t<a class=\"text-truncate\" href=\"/ac-regions\">
\t\t\t\t<span class=\"fas fa-info-circle\"></span><span class=\"ps-2\">Index Overview</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/ac-regions#chart-container\">
\t\t\t\t<span class=\"fas fa-chart-area\"></span><span class=\"ps-2\">Index Data</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/ac-regions-hm\">
\t\t\t\t<span class=\"fas fa-table\"></span><span class=\"ps-2\">Regional Heatmap</span>
\t\t\t</a>
\t\t</div>\t\t\t\t
\t</div>
</nav>
";
    }

    public function getTemplateName()
    {
        return "ac-sidebar.html";
    }

    public function getDebugInfo()
    {
        return array (  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("<nav class=\"sidebar col-lg-auto d-none d-lg-block px-0 py-2 bg-light\" id=\"sidebar\"> <!-- Hide Sidebar for XS to M Devices -->
\t<div class=\"nav flex-column\">
\t\t<a href=\"#cross-asset\" data-bs-toggle=\"collapse\" class=\"nav-link\">
\t\t\t<div>
\t\t\t\t<span class=\"fa fa-list fa-fw me-1\"></span> 
\t\t\t\t<span>Cross Asset Correlation</span>
\t\t\t\t<span class=\"fas fa-caret-down ms-auto\"></span>
\t\t\t</div>
\t\t</a>
\t\t<div id='cross-asset' class=\"collapse show sidebar-submenu\">
\t\t\t<a class=\"text-truncate\" href=\"/ac-assets\">
\t\t\t\t<span class=\"fas fa-info-circle\"></span><span class=\"ps-2\">Index Overview</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/ac-assets#chart-container\">
\t\t\t\t<span class=\"fas fa-chart-area\"></span><span class=\"ps-2\">Index Data</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/ac-assets-hm\">
\t\t\t\t<span class=\"fas fa-table\"></span><span class=\"ps-2\">Asset Class Heatmap</span>
\t\t\t</a>
\t\t</div>\t\t\t\t
\t\t
\t\t<a href=\"#cross-region\" data-bs-toggle=\"collapse\" class=\"nav-link\">
\t\t\t<div>
\t\t\t\t<span class=\"fas fa-globe-americas fas-fw me-1\"></span> 
\t\t\t\t<span>Cross Region Correlation</span>
\t\t\t\t<span class=\"fas fa-caret-down ml-auto\"></span>
\t\t\t</div>
\t\t</a>
\t\t<div id='cross-region' class=\"collapse show sidebar-submenu\">
\t\t\t<a class=\"text-truncate\" href=\"/ac-regions\">
\t\t\t\t<span class=\"fas fa-info-circle\"></span><span class=\"ps-2\">Index Overview</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/ac-regions#chart-container\">
\t\t\t\t<span class=\"fas fa-chart-area\"></span><span class=\"ps-2\">Index Data</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/ac-regions-hm\">
\t\t\t\t<span class=\"fas fa-table\"></span><span class=\"ps-2\">Regional Heatmap</span>
\t\t\t</a>
\t\t</div>\t\t\t\t
\t</div>
</nav>
", "ac-sidebar.html", "/var/www/beta.econforecasting.com/public/templates/ac-sidebar.html");
    }
}
