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
class __TwigTemplate_33e6f4caac112b2e2d2aad661e5d10a5339da8ff4d7c4f9f7158f2a55c8e7e0e extends \Twig\Template
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
        echo "<nav class=\"sidebar col-md-3 col-xl-2 d-none d-md-block px-0 py-2\" id=\"sidebar\"> <!-- Hide Sidebar for XS and S Devices -->
\t<ul class=\"nav flex-column\">
\t\t<a href=\"#cross-asset\" data-bs-toggle=\"collapse\" class=\"nav-link\">
\t\t\t<div>
\t\t\t\t<span class=\"fa fa-list fa-fw mx-2\"></span> 
\t\t\t\t<span>Cross Asset Correlation</span>
\t\t\t\t<span class=\"fas fa-caret-down ms-auto\"></span>
\t\t\t</div>
\t\t</a>
\t\t<div id='cross-asset' class=\"collapse show sidebar-submenu\">
\t\t\t<a class=\"list-group-item list-group-item-action py-1 text-truncate\" href=\"/ac-assets-hm\">
\t\t\t\t<span class=\"fas fa-chart-area\"></span><span class=\"ps-2\">Index Data</span>
\t\t\t</a>
\t\t\t<a class=\"list-group-item list-group-item-action py-1 text-truncate\" href=\"/ac-assets-hm\">
\t\t\t\t<span class=\"fas fa-table\"></span><span class=\"ps-2\">Heatmap</span>
\t\t\t</a>
\t\t</div>\t\t\t\t
\t\t
\t\t<a href=\"#cross-region\" data-bs-toggle=\"collapse\" class=\"nav-link\">
\t\t\t<div>
\t\t\t\t<span class=\"fas fa-globe-americas fas-fw mx-2\"></span> 
\t\t\t\t<span>Cross Region Correlation</span>
\t\t\t\t<span class=\"fas fa-caret-down ml-auto\"></span>
\t\t\t</div>
\t\t</a>
\t\t<div id='cross-region' class=\"collapse show sidebar-submenu\">
\t\t\t<a class=\"list-group-item list-group-item-action py-1 text-truncate\" href=\"/ac-regions-hm\">
\t\t\t\t<span class=\"fas fa-chart-area\"></span><span class=\"ps-2\">Index Data</span>
\t\t\t</a>
\t\t\t<a class=\"list-group-item list-group-item-action py-1 text-truncate\" href=\"/ac-regions-hm\">
\t\t\t\t<span class=\"fas fa-table\"></span><span class=\"ps-2\">Heatmap</span>
\t\t\t</a>
\t\t</div>\t\t\t\t
\t</ul>
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
        return new Source("<nav class=\"sidebar col-md-3 col-xl-2 d-none d-md-block px-0 py-2\" id=\"sidebar\"> <!-- Hide Sidebar for XS and S Devices -->
\t<ul class=\"nav flex-column\">
\t\t<a href=\"#cross-asset\" data-bs-toggle=\"collapse\" class=\"nav-link\">
\t\t\t<div>
\t\t\t\t<span class=\"fa fa-list fa-fw mx-2\"></span> 
\t\t\t\t<span>Cross Asset Correlation</span>
\t\t\t\t<span class=\"fas fa-caret-down ms-auto\"></span>
\t\t\t</div>
\t\t</a>
\t\t<div id='cross-asset' class=\"collapse show sidebar-submenu\">
\t\t\t<a class=\"list-group-item list-group-item-action py-1 text-truncate\" href=\"/ac-assets-hm\">
\t\t\t\t<span class=\"fas fa-chart-area\"></span><span class=\"ps-2\">Index Data</span>
\t\t\t</a>
\t\t\t<a class=\"list-group-item list-group-item-action py-1 text-truncate\" href=\"/ac-assets-hm\">
\t\t\t\t<span class=\"fas fa-table\"></span><span class=\"ps-2\">Heatmap</span>
\t\t\t</a>
\t\t</div>\t\t\t\t
\t\t
\t\t<a href=\"#cross-region\" data-bs-toggle=\"collapse\" class=\"nav-link\">
\t\t\t<div>
\t\t\t\t<span class=\"fas fa-globe-americas fas-fw mx-2\"></span> 
\t\t\t\t<span>Cross Region Correlation</span>
\t\t\t\t<span class=\"fas fa-caret-down ml-auto\"></span>
\t\t\t</div>
\t\t</a>
\t\t<div id='cross-region' class=\"collapse show sidebar-submenu\">
\t\t\t<a class=\"list-group-item list-group-item-action py-1 text-truncate\" href=\"/ac-regions-hm\">
\t\t\t\t<span class=\"fas fa-chart-area\"></span><span class=\"ps-2\">Index Data</span>
\t\t\t</a>
\t\t\t<a class=\"list-group-item list-group-item-action py-1 text-truncate\" href=\"/ac-regions-hm\">
\t\t\t\t<span class=\"fas fa-table\"></span><span class=\"ps-2\">Heatmap</span>
\t\t\t</a>
\t\t</div>\t\t\t\t
\t</ul>
</nav>
", "ac-sidebar.html", "/var/www/econforecasting.com/public/templates/ac-sidebar.html");
    }
}
